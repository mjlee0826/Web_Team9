import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLogto } from '@logto/react';

// Create the Authentication Context to share state across the entire app hierarchy.
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * This provider wraps the application and handles:
 * 1. Proactive Token Validation (The "Preemptive Check")
 * 2. Global User Data & Roles Management
 * 3. Synchronization between Logto and App State
 */
const AuthProvider = ({ children }) => {
    // Extract core authentication tools and states from Logto React SDK.
    const { 
        isAuthenticated, 
        isLoading: isLogtoLoading, 
        getAccessToken, 
        getIdTokenClaims,
        signOut 
    } = useLogto();

    // --- Custom States ---
    const [user, setUser] = useState(null);
    // isAuthReady is TRUE only when identity is confirmed AND data is fetched.
    const [isAuthReady, setIsAuthReady] = useState(false);

    /**
     * Helper: Clear all local states and log out.
     * Use useCallback to maintain a stable function reference.
     */
    const handleSecureSignOut = useCallback(async () => {
        setUser(null);
        setIsAuthReady(false);
        // Navigate the user to Logto's sign-out flow.
        await signOut(window.location.origin);
    }, [signOut]);

    /**
     * Main Effect: Sync Identity and Fetch Data
     * This effect runs when the authentication state changes.
     */
    useEffect(() => {
        const initializeAuth = async () => {
            // Wait until Logto SDK has finished its internal initialization (reading storage).
            if (isLogtoLoading) return;

            // If the user is not authenticated, reset states and finish.
            if (!isAuthenticated) {
                setUser(null);
                setIsAuthReady(true);
                return;
            }

            try {
                // --- Step A: Proactive Access Token Test ---
                // This forces Logto to refresh the token if it's expired.
                // Replace 'YOUR_API_RESOURCE' with your actual API identifier from Logto console.
                const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
                console.log(token)
                
                if (!token) throw new Error('Failed to obtain a valid access token');

                // --- Step B: Fetch User Info & Roles ---
                // You can fetch basic info from Logto, or call your own Express backend here.
                const userInfo = await getIdTokenClaims();
                
                // Example: Extract roles from custom data or a separate API call to your Express backend.
                // const userRoles = await myExpressApi.getRoles(userInfo.sub);
                
                setUser(userInfo);
                // setRoles(userRoles);

                console.log('✅ Auth successfully initialized for user:', userInfo.sub);
            } catch (error) {
                // If Token is invalid or Refresh Token has expired, force a clean sign-out.
                console.error('❌ Authentication check failed. Forcing log out...', error);
                handleSecureSignOut();
            } finally {
                // Mark the authentication process as completed.
                setIsAuthReady(true);
            }
        };

        initializeAuth();
    }, [isAuthenticated, isLogtoLoading, getAccessToken, getIdTokenClaims, handleSecureSignOut]);

    // Construct the context value object.
    const value = {
        user,
        isAuthenticated,
        // Combined loading state: still initializing SDK OR still fetching custom data.
        getIdTokenClaims,
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
 * Custom Hook: useAuth
 * Provides an easy way for components to access authentication data.
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