import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfigService from '../../services/ConfigService';
import AuthContext from './context';

const retryAttempts = 5;

const AuthProvider = ({ children }) => {

    const [remainingAuthAttempts, setRemainingAuthAttempts] = useState(retryAttempts);
    const [remainingGuestAttempts, setRemainingGuestAttempts] = useState(retryAttempts);
    const [accessTokenRequestInFlight, setAccessTokenRequestInFlight] = useState();
    const [guestTokenRequestInFlight, setGuestTokenRequestInFlight] = useState();
    const [loginFailed, setLoginFailed] = useState(false);
    const [accessToken, setAccessToken] = useState();
    const [guestToken, setGuestToken] = useState();
    
    const authValue = { accessToken, guestToken };

    useEffect(() => {
        const { api, supersetUser, supersetPw, dashboardId } = ConfigService.getAppConfig();
        if (remainingAuthAttempts < 0 || remainingGuestAttempts < 0) {
            setLoginFailed(true);
        } else if (!accessToken && !accessTokenRequestInFlight) {
            const payload = {
                username: supersetUser,
                password: supersetPw,
                provider: 'db',
                refresh: false
            }
            setAccessTokenRequestInFlight(true);
            axios.post(`${api}/security/login`, payload, )
                .then((response) => {
                    setAccessTokenRequestInFlight(false);
                    const { data: { access_token } } = response;
                    setAccessToken(access_token);
                })
                .catch((e) => {
                    setAccessTokenRequestInFlight(false);
                    setRemainingAuthAttempts(remainingAuthAttempts - 1);
                });
        } else if (accessToken && !guestToken && !guestTokenRequestInFlight) {
            const payload = {
                user: {
                    username: 'guest',
                    first_name: 'Gary',
                    last_name: 'Guest',
                },
                rls: [],
                resources: [
                    {
                        type: 'dashboard',
                        id: dashboardId,
                    }
                ]
            }
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
            setGuestTokenRequestInFlight(true);
            axios.post(`${api}/security/guest_token/`, payload, config)
                .then((response) => {
                    setGuestTokenRequestInFlight(false);
                    const { data: { token } } = response;
                    setGuestToken(token);
                })
                .catch((e) => {
                    setGuestTokenRequestInFlight(false);
                    setRemainingGuestAttempts(remainingGuestAttempts - 1);
                });
        }
    }, [remainingAuthAttempts, remainingGuestAttempts, accessToken, accessTokenRequestInFlight, guestToken, guestTokenRequestInFlight])

    if (loginFailed) {
        return (<h1>Login Failed!</h1>);
    } else if (!accessToken || !guestToken) {
        return (<h1>Loading, please wait...</h1>);
    }  else {
        return (
            <AuthContext.Provider value={authValue}>
                {children}
            </AuthContext.Provider>
        );
    }
};

export default AuthProvider;
