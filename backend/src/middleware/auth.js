// backend/src/middleware/auth.js
import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose";

/**
 * Logto configuration derived from environment variables.
 * These are essential for verifying the token signature, issuer, and audience.
 */
const JWKS_URL = process.env.LOGTO_JWKS_URL;
const ISSUER = process.env.LOGTO_ISSUER;
const API_RESOURCE = process.env.LOGTO_API_RESOURCE;

/**
 * Initialize a remote JSON Web Key Set (JWKS).
 * 'jose' handles key fetching, rotation, and internal caching automatically.
 */
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Extracts the JWT from the incoming request's Authorization header.
 * Expected format: "Bearer <access_token>"
 * * @param {Object} headers - The request headers object.
 * @returns {string} The extracted JWT token.
 * @throws {Error} If the header is missing or the format is invalid.
 */
const getTokenFromHeader = (headers) => {
    const { authorization } = headers;
    const bearerTokenIdentifier = "Bearer";

    if (!authorization) {
        throw new Error("Authorization header missing");
    }

    if (!authorization.startsWith(bearerTokenIdentifier)) {
        throw new Error("Authorization token type not supported");
    }

    // Slice out the token string after "Bearer "
    return authorization.slice(bearerTokenIdentifier.length + 1);
};

/**
 * Compares the scopes present in the token against the scopes required for the route.
 * * @param {string[]} tokenScopes - Array of scopes from the JWT payload.
 * @param {string[]} requiredScopes - Array of scopes needed to access the resource.
 * @returns {boolean} True if all required scopes are present.
 */
const hasScopes = (tokenScopes, requiredScopes) => {
    if (!requiredScopes || requiredScopes.length === 0) {
        return true; // No specific scopes required, allow access
    }
    const scopeSet = new Set(tokenScopes);
    return requiredScopes.every((scope) => scopeSet.has(scope));
};

/**
 * Performs cryptographic verification of the JWT.
 * Validates the signature using JWKS and checks the 'iss' (issuer) and 'aud' (audience).
 * * @param {string} token - The raw JWT string.
 * @returns {Promise<Object>} The verified JWT payload.
 */
const verifyJwt = async (token) => {
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: ISSUER,
            audience: API_RESOURCE,
        });
        return payload;
    } catch (error) {
        // Log the decoded (unverified) payload for debugging purposes
        const decoded = decodeJwt(token);
        console.error("JWT Verification Failed. Payload structure:", decoded);
        throw error; // Re-throw to be caught by the middleware
    }
};

/**
 * Higher-order Express middleware for enforcing authentication and scope-based access control.
 * * @param {string[]} requiredScopes - Optional list of required scopes for authorization.
 * @returns {Function} Express middleware function.
 */
const requireAuth = (requiredScopes = []) => {
    return async (req, res, next) => {
        try {
            // 1. Extract the token from the HTTP Authorization header
            const token = getTokenFromHeader(req.headers);

            // 2. Cryptographically verify the token
            const payload = await verifyJwt(token);

            // 3. Attach user info to the request object for downstream use
            req.user = {
                id: payload.sub, // The unique user ID from Logto
                scopes: payload.scope?.split(" ") || [], // Scopes are usually space-separated strings
            };

            console.log(`User ${payload.sub}: JWT verification successful`);

            // 4. Check for sufficient permissions (Authorization)
            if (!hasScopes(req.user.scopes, requiredScopes)) {
                console.warn(`User ${payload.sub}: Insufficient scopes. Required: ${requiredScopes}`);
                return res.status(403).json({ error: "Insufficient permissions" });
            }

            // Authentication and Authorization passed, proceed to next handler
            next();
        } catch (error) {
            // Treat any error in this process as an authentication failure
            res.status(401).json({ error: "Unauthorized" });
        }
    };
};

export { requireAuth, hasScopes };