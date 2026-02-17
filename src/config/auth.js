import { createAuthClient } from 'better-auth/react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authClient = createAuthClient({
    baseURL: `${API_BASE_URL}/api/auth/better`
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient;

export default authClient;
