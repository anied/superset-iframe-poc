import { useState } from 'react';

import './RequestChartUrlControl.css';

const RequestChartUrlControl = ({ dashboardApi }) => {
    const [chartId, setChartId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chartUrl, setChartUrl] = useState();

    const handleChange = ({ target: { value } }) => setChartId(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        dashboardApi.getUrlByChartId(chartId)
            .then((url) => {
                setChartUrl(url);
                setIsLoading(false);
            });
            // todo-- add error handling
    }

    return (
        <form className="request-chart-url-control" onSubmit={handleSubmit}>
            <fieldset className="m-1 p-1 border border-dark" disabled={isLoading || !dashboardApi} >
                <legend className="h3">Get chart permalink</legend>
                <div className="d-flex align-items-center">
                    <label htmlFor="chartIdForUrl" className="text-nowrap me-2">Chart ID:</label>
                    <input
                        className="form-control me-2"
                        id="chartIdForUrl"
                        value={chartId}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="btn btn-dark"
                    >
                        Request URL
                    </button>
                </div>
            </fieldset>
            {isLoading && (<p>Loading...</p>)}
            {chartUrl && <p>{`Chart URL is ${chartUrl}`}</p>}
        </form>
    );
}

export default RequestChartUrlControl;
