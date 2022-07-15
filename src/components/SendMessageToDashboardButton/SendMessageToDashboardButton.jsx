import IframeMessageService from "../../services/IframeMessageService";

const SendMessageToDashboardButton = () => {
    const btnClickHandler = (e) => {
        e.preventDefault();
        IframeMessageService.sendMessageToSupersetDashboard('Greetings from the parent app!');
    }
    
    return (
        <button type="button" onClick={btnClickHandler}>Send message to dashboard</button>
    );
}

export default SendMessageToDashboardButton;
