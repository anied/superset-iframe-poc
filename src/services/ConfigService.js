const supersetPort = process.env.REACT_APP_SUPERSET_PORT;
const supersetProtocol = process.env.REACT_APP_SUPERSET_PROTOCOL;
const supersetDomain = process.env.REACT_APP_SUPERSET_DOMAIN;
const supersetFrontEndPort = process.env.REACT_APP_SUPERSET_FRONT_END_PORT;
const supersetFrontEndProtocol = process.env.REACT_APP_SUPERSET_FRONT_END_PROTOCOL;
const supersetFrontEndDomain = process.env.REACT_APP_SUPERSET_FRONT_END_DOMAIN;
const supersetUser = process.env.REACT_APP_SUPERSET_USER;
const supersetPw = process.env.REACT_APP_SUPERSET_PW;
const supersetApiPath = process.env.REACT_APP_SUPERSET_API_PATH;
const dashboardId = process.env.REACT_APP_DASHBOARD_ID;

const envVars = {
    supersetPort,
    supersetProtocol,
    supersetDomain,
    supersetFrontEndPort,
    supersetFrontEndProtocol,
    supersetFrontEndDomain,
    supersetUser,
    supersetPw,
    supersetApiPath,
    dashboardId,
};

const appConfig = {
    ...envVars,
    // api: `${supersetProtocol}://${supersetDomain}:${supersetPort}/${supersetApiPath}`, // NON DEV?
    supersetResolvedDomain: `${supersetFrontEndProtocol}://${supersetFrontEndDomain}:${supersetFrontEndPort}`,
    api: `/${supersetApiPath}`,
};

class ConfigService {
    static getAppConfig = () => {
        const appConfigCopy = { ...appConfig };
        Object.freeze(appConfigCopy);
        return appConfigCopy;
    }
}

export default ConfigService;
