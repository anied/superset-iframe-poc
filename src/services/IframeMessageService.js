import ConfigService from "./ConfigService";

const { supersetResolvedDomain } = ConfigService.getAppConfig();

class IframeMessageService {
    static #subscriptions = [];
    static #addSubscription = (eventHandlerFunction) => IframeMessageService.#subscriptions.push(eventHandlerFunction) - 1
    static #getSubscription = (referenceNumber) => IframeMessageService.#subscriptions[referenceNumber]
    static #removeSubscription = (referenceNumber) => delete IframeMessageService.#subscriptions[referenceNumber]
    static #transactionId = 0;
    static messageTypes = { // needed to differentiate in handlers how to route the message
        message: 'message',
        urlRequest: 'urlRequest',
    }

    // fetching the iframe with `querySelector` in the method is maybe not a "production-ready" solution
    static getIframeReference = () => document.querySelector(`iframe[src^="${supersetResolvedDomain}"]`);

    static generateTransactionID = () => {
        const currentTransactionId = IframeMessageService.#transactionId;
        IframeMessageService.#transactionId += 1;
        let stringifiedTransactionID = String(currentTransactionId);
        stringifiedTransactionID = stringifiedTransactionID.padStart(8 - stringifiedTransactionID.length, '0');
        return stringifiedTransactionID;
    }

    static sendMessageToSupersetDashboard = ({message, type = IframeMessageService.messageTypes.message, transactionId}, transfer) => {
        const targetIframe = IframeMessageService.getIframeReference();
        if (typeof targetIframe?.contentWindow?.postMessage !== 'function') {
            console.warn("superset dashboard iframe not found");
        } else {
            const payload = {
                type,
                message,
                transactionId,
            }
            targetIframe.contentWindow.postMessage(payload, supersetResolvedDomain, transfer);
        }
    }

    static subscribeToMessagesFromSupersetDashboard = (originalEventHandler, messageType = IframeMessageService.messageTypes.message) => {
        const protectedEventHandler = (event) => {
            if (
                event.origin === supersetResolvedDomain
                && (!event?.data?.type || event.data.type === messageType)
            ) {
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

    static requestUrlFromSupersetDashboardById = (id) => {
        return new Promise((resolve, reject) => {
            const transactionId = IframeMessageService.generateTransactionID();
            const timeoutInterval = 5000;
    
            const payload = {
                type: IframeMessageService.messageTypes.urlRequest,
                message: id,
                transactionId,
            }
            
            const subscriptionReference = IframeMessageService.subscribeToMessagesFromSupersetDashboard(
                ({data: {message, transactionId: incomingTransactionId}}) => {
                    if (incomingTransactionId === transactionId) {
                        IframeMessageService.unsubscribeFromMessagesFromSupersetDashboard(subscriptionReference);
                        resolve(message);
                    }
                },
                IframeMessageService.messageTypes.urlRequest,
            )
            
            IframeMessageService.sendMessageToSupersetDashboard(payload);

            setTimeout(() => {
                IframeMessageService.unsubscribeFromMessagesFromSupersetDashboard(subscriptionReference);
                reject(`Request to superset for chart URL timed out after ${timeoutInterval}ms; the dashboard may have logged an error to the console`);
            }, timeoutInterval);
        });

    }
}

export default IframeMessageService;
