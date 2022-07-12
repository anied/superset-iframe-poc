import React from 'react';

const AuthContext = React.createContext({
    accessToken: undefined,
    guestToken: undefined,
})

export default AuthContext;