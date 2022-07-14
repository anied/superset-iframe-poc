import { useEffect } from 'react';

import IframeMessageService from './services/IframeMessageService';
import SupersetDashboard from './components/SupersetDashboard/SupersetDashboard';

import './App.css';

function App() {
  const btnClickHandler = (e) => {
    e.preventDefault();
    IframeMessageService.sendMessageToSupersetDashboard('Greetings from the parent app!');
  }

  useEffect(() => {
    const useEffect = IframeMessageService.subscribeToMessagesFromSupersetDashboard((event) => {
      console.log('parent received message from iframe', event);
    });
    return () => IframeMessageService.unsubscribeFromMessagesFromSupersetDashboard(useEffect);
  })

  return (
    <div className="app d-flex flex-column vh-100">
      <h1>Superset Bidirectional Communication POC</h1>
      <button type="button" onClick={btnClickHandler}>Send message to dashboard</button>
      <SupersetDashboard />
    </div>
  );
}

export default App;
