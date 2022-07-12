import ConfigService from "../services/ConfigService";

const useConfigHook = () => {
    const configObj = ConfigService.getAppConfig();
    return configObj;
}

export default useConfigHook;