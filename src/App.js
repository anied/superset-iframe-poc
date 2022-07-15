import { useEffect } from 'react';

import IframeMessageService from './services/IframeMessageService';
import SendMessageToDashboardButton from './components/SendMessageToDashboardButton/SendMessageToDashboardButton';
import SupersetDashboard from './components/SupersetDashboard/SupersetDashboard';

import './App.css';

function App() {
  useEffect(() => {
    const useEffect = IframeMessageService.subscribeToMessagesFromSupersetDashboard((event) => {
      console.log('parent received message from iframe', event);
    });
    return () => IframeMessageService.unsubscribeFromMessagesFromSupersetDashboard(useEffect);
  })

  return (
    <div className="app d-flex flex-column vh-100">
      <h1>Superset Bidirectional Communication POC</h1>
      <SendMessageToDashboardButton />
      <SupersetDashboard />
    </div>
  );
}

export default App;
