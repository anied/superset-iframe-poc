import { Buffer } from 'buffer';

const setupBrowserEnvironment = () => {
    // load polyfills
    window.Buffer = Buffer;
};

export default setupBrowserEnvironment;