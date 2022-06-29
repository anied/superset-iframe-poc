import SupersetDashboard from './components/SupersetDashboard/SupersetDashboard';

import './App.css';

function App() {
  return (
    <div className="app d-flex flex-column vh-100">
      <h1>Superset Bidirectional Communication POC</h1>
      <SupersetDashboard />
    </div>
  );
}

export default App;
