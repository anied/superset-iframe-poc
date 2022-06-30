import React, { useEffect } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";

import './SupersetDashboard.css';

const SupersetDashboard = () => {
    useEffect(() => {
        console.log('embedding dashboard');
        embedDashboard({
            id: "49c54e0e-9b36-4479-8c00-003e3bc4ae83", // given by the Superset embedding UI
            supersetDomain: "http://localhost:9000",
            mountPoint: document.getElementById("dashboard-mount-point"), // any html element that can contain an iframe
            fetchGuestToken: () => Promise.resolve('--guest_token--'),
            dashboardUiConfig: { hideTitle: true }, // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
        });
    })

    return (
        <div id="dashboard-mount-point" className="superset-dashboard flex-grow-1">
            <h2>Superset Dashboard</h2>
        </div>
    );
};

export default SupersetDashboard;
