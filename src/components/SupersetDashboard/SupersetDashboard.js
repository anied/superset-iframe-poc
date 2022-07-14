import React, { useEffect } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useAuth, useConfig } from '../../hooks';

import './SupersetDashboard.css';

const SupersetDashboard = () => {
    const { guestToken } = useAuth();
    const {
        supersetResolvedDomain: supersetDomain,
        dashboardId,
    } = useConfig();


    useEffect(() => {
        console.log('embedding dashboard');
        embedDashboard({
            id: dashboardId, // given by the Superset embedding UI
            supersetDomain,
            mountPoint: document.getElementById("dashboard-mount-point"), // any html element that can contain an iframe
            fetchGuestToken: () => Promise.resolve(guestToken),
            dashboardUiConfig: { hideTitle: true }, // dashboard UI config: hideTitle, hideTab, hideChartControls (optional)
        });
    })

    return (
        <div id="dashboard-mount-point" className="superset-dashboard flex-grow-1 d-flex">
            <p>Loading... please wait...</p>
        </div>
    );
};

export default SupersetDashboard;
