// frontend/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLogto } from '@logto/react';

/**
 * AuthContext serves as the global single source of truth for 
 * authentication state, user profiles, and access tokens.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * * This provider orchestrates the following:
 * 1. Proactive Token Validation: Ensures the Access Token is valid upon app load.
 * 2. User Profile Sync: Fetches ID Token claims (userInfo) after successful auth.
 * 3. State Consolidation: Combines SDK loading states with custom data fetching states.
 */
const AuthProvider = ({ children }) => {
    // Destructure core tools and reactive states from Logto React SDK.
    const {
        isAuthenticated, 
        isLoading: isLogtoLoading, 
        getAccessToken, 
        getIdTokenClaims,
        signOut 
    } = useLogto();

    // --- Custom Application States ---
    
    // 'user' holds the decoded JWT claims (e.g., sub, name, email).
    const [user, setUser] = useState(null);
    
    // 'isAuthReady' tracks whether our custom initialization (token check + profile fetch) is done.
    const [isAuthReady, setIsAuthReady] = useState(false);

    /**
     * handleSecureSignOut
     * * Performs a clean logout by:
     * 1. Wiping local application state.
     * 2. Triggering the remote OIDC sign-out flow via Logto.
     * * Wrapped in useCallback to ensure a stable function reference for child components.
     */
    const handleSecureSignOut = useCallback(async () => {
        setUser(null);
        setIsAuthReady(false);
        // Redirects the browser to the Logto sign-out endpoint.
        await signOut(window.location.origin);
    }, [signOut]);

    /**
     * initializeAuth
     * * An internal effect-driven function that synchronizes the SDK's 
     * authentication state with our internal 'user' state.
     */
    useEffect(() => {
        const initializeAuth = async () => {
            // Early exit if the user is not logged in.
            if (!isAuthenticated) {
                setUser(null);
                setIsAuthReady(true);
                return;
            }

            try {
                // --- Step A: Access Token Verification ---
                // We proactively call getAccessToken to ensure the token is valid/refreshable.
                // This prevents silent failures when the app makes its first API call.
                const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
                
                if (!token) throw new Error('Failed to obtain a valid access token');

                // --- Step B: Identity Mapping ---
                // Retrieve the user claims (profile info) from the ID Token.
                const userInfo = await getIdTokenClaims();
                setUser(userInfo);

                console.log('✅ AuthContext: Successfully initialized for user:', userInfo.sub);
            } catch (error) {
                // Critical failure: If we are 'authenticated' but cannot get a token, 
                // the session is likely corrupted. Force a sign-out for safety.
                console.error('❌ AuthContext: Initialization failed. Forcing logout...', error);
                handleSecureSignOut();
            } finally {
                // Notify the app that the authentication handshake is complete.
                setIsAuthReady(true);
            }
        };

        initializeAuth();
        
        // Note: We include getAccessToken and handleSecureSignOut to satisfy 
        // the eslint-plugin-react-hooks, assuming they are stabilized by the SDK/useCallback.
    }, [isAuthenticated, getIdTokenClaims, getAccessToken, handleSecureSignOut]);

    /**
     * The context value exposed to the rest of the application.
     */
    const value = {
        user,
        isAuthenticated,
        // Expose raw claims getter if components need fresh data.
        getIdTokenClaims,
        // isLoading is true if EITHER the SDK is booting OR we are still syncing user data.
        isLoading: isLogtoLoading || !isAuthReady,
        signOut: handleSecureSignOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * useAuth Custom Hook
 * * Provides a convenient and type-safe way for functional components 
 * to access the authentication context.
 * * @returns {AuthContextValue} The authentication state and helper functions.
 * @throws {Error} If used outside of an AuthProvider.
 */
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthProvider, useAuth };