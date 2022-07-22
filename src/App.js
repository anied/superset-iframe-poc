import { useState, useEffect } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import RequestChartUrlControl from './components/RequestChartUrlControl/RequestChartUrlControl';
import SupersetDashboardMountPoint from './components/SupersetDashboardMountPoint/SupersetDashboardMountPoint';
import { useAuth, useConfig } from './hooks';

import './App.css';

function App() {
  const mountPointId = "superset-dashboard-target"
  const { guestToken } = useAuth();
  const {
      supersetResolvedDomain: supersetDomain,
      dashboardId,
  } = useConfig();
  const [dashboardApi, setDashboardApi] = useState();

  useEffect(() => {
    embedDashboard({
      id: dashboardId, // given by the Superset embedding UI
      supersetDomain,
      mountPoint: document.querySelector(`#${mountPointId}`), // any html element that can contain an iframe
      fetchGuestToken: () => Promise.resolve(guestToken),
      dashboardUiConfig: { hideTitle: true }, // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
    }).then(api => {
      setDashboardApi(api);
    });
    return () => dashboardApi?.unmount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app d-flex flex-column vh-100">
      <h1>Superset Bidirectional Communication POC</h1>
      <RequestChartUrlControl dashboardApi={dashboardApi} />
      <SupersetDashboardMountPoint containerId={mountPointId} />
    </div>
  );
}

export default App;
