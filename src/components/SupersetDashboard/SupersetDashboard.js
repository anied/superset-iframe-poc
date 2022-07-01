import React, { useEffect } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";

import './SupersetDashboard.css';

const SupersetDashboard = () => {
    useEffect(() => {
        console.log('embedding dashboard');
        embedDashboard({
            id: "e30ac258-c73c-462f-b42b-036858680bd6", // given by the Superset embedding UI
            supersetDomain: "http://localhost:9000",
            mountPoint: document.getElementById("dashboard-mount-point"), // any html element that can contain an iframe
            fetchGuestToken: () => Promise.resolve('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Imxhc3RfbmFtZSI6Ikxlc2VyIiwiZmlyc3RfbmFtZSI6IlBldGVyIiwidXNlcm5hbWUiOiJndWVzdCJ9LCJyZXNvdXJjZXMiOlt7ImlkIjoiNDljNTRlMGUtOWIzNi00NDc5LThjMDAtMDAzZTNiYzRhZTgzIiwidHlwZSI6ImRhc2hib2FyZCJ9XSwicmxzX3J1bGVzIjpbXSwiaWF0IjoxNjU2NjExODI2LjU0OTc5NTIsImV4cCI6MTY1NjYxMjEyNi41NDk3OTUyLCJhdWQiOiJodHRwOi8vMC4wLjAuMDo4MDgwLyIsInR5cGUiOiJndWVzdCJ9.1o7ni000WE84hwZJFye5YBjnusYqZr3nT1_BtntKeZ0'),
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
