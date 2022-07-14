import ConfigService from "./ConfigService";

const { supersetResolvedDomain } = ConfigService.getAppConfig();

class IframeMessageService {
    static #subscriptions = [];
    static #addSubscription = (eventHandlerFunction) => IframeMessageService.#subscriptions.push(eventHandlerFunction) - 1
    static #getSubscription = (referenceNumber) => IframeMessageService.#subscriptions[referenceNumber]
    static #removeSubscription = (referenceNumber) => delete IframeMessageService.#subscriptions[referenceNumber]

    static sendMessageToSupersetDashboard = (message, transfer) => {
        const targetIframe = document.querySelector(`iframe[src^="${supersetResolvedDomain}"]`)
        if (typeof targetIframe?.contentWindow?.postMessage !== 'function') {
            console.warn("superset dashboard iframe not found");
        } else {
            targetIframe.contentWindow.postMessage(message, supersetResolvedDomain, transfer);
        }
    }

    static subscribeToMessagesFromSupersetDashboard = (originalEventHandler) => {
        const protectedEventHandler = (event) => {
            if (event.origin === supersetResolvedDomain) {
                originalEventHandler(event);
            }
        }
        window.addEventListener('message', protectedEventHandler, false);
        const subscriptionReference = IframeMessageService.#addSubscription(protectedEventHandler);
        return subscriptionReference;
    }

    static unsubscribeFromMessagesFromSupersetDashboard = (eventHandlerReferenceNumber) => {
        const protectedEventHandler = IframeMessageService.#getSubscription(eventHandlerReferenceNumber);
        if (protectedEventHandler) {
            window.removeEventListener('message', protectedEventHandler, false);
            return IframeMessageService.#removeSubscription(eventHandlerReferenceNumber);
        } else {
            console.warn(`IframeMessageService.unsubscribeFromMessagesFromSupersetDashboard: Subscription ${eventHandlerReferenceNumber} not found; perhaps it was already unsubscribed?`);
        }
    }
}

export default IframeMessageService;
