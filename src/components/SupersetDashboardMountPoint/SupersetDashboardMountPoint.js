import './SupersetDashboardMountPoint.css';

const SupersetDashboardMountPoint = ({ containerId }) => {
    if (!containerId) {
        console.warn('without a containerId the dashboard container cannot be targeted!')
    }

    return (
        <div id={containerId} className="superset-dashboard flex-grow-1 d-flex">
            <p>Loading... please wait...</p>
        </div>
    );
};

export default SupersetDashboardMountPoint;
