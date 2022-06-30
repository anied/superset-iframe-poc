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
            fetchGuestToken: () => Promise.resolve('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImZpcnN0X25hbWUiOiJQZXRlciIsImxhc3RfbmFtZSI6Ikxlc2VyIiwidXNlcm5hbWUiOiJndWVzdCJ9LCJyZXNvdXJjZXMiOlt7ImlkIjoiNDljNTRlMGUtOWIzNi00NDc5LThjMDAtMDAzZTNiYzRhZTgzIiwidHlwZSI6ImRhc2hib2FyZCJ9XSwicmxzX3J1bGVzIjpbXSwiaWF0IjoxNjU2NjA1MzY2LjY2NDEyMTIsImV4cCI6MTY1NjYwNTY2Ni42NjQxMjEyLCJhdWQiOiJodHRwOi8vMC4wLjAuMDo4MDgwLyIsInR5cGUiOiJndWVzdCJ9.MU0yRxY5sTRdSmlH4Sx9aqSbmf0TnpOaQQ46aKWndSM'),
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
