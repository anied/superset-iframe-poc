import { useContext } from 'react';
import AuthContext from './context';

const useAuthHook = () => {
    const authObj = useContext(AuthContext);
    return authObj;
};

export default useAuthHook;