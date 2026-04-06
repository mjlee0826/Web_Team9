import React from 'react';
import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';

/**
 * CallbackPage Component
 * * This serves as the dedicated "Redirect URI" for the Logto OIDC flow.
 * It is responsible for handling the response from the identity provider,
 * exchanging the authorization code for tokens, and finalizing the session.
 */
export default function CallbackPage() {
    const navigate = useNavigate();

    /**
     * useHandleSignInCallback Hook
     * * This hook automatically detects and parses authentication parameters 
     * (like 'code' and 'state') from the current URL.
     * * @param {Function} onFinished - A callback function executed after 
     * successful authentication and state synchronization.
     */
    const { isLoading } = useHandleSignInCallback(() => {
        // Redirect the user to the main application page.
        // We use { replace: true } to remove the /callback path from the 
        // browser's history stack, preventing "back-button loops."
        navigate('/home', { replace: true });
    });

    /**
     * Show the futuristic LoadingPage while the SDK performs 
     * the heavy lifting (token exchange and cryptographic verification).
     */
    if (isLoading) {
        return <LoadingPage message='Verifying authentication, please wait...' />
    }

    // Return null or an empty fragment if the hook is finished or if an error occurred,
    // though usually, the redirection in onFinished handles the exit.
    return null;
}