/**
 * JWT Configuration
 * Centralized JWT settings for token validation
 */

export interface JwtConfig {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
}

export const jwtConfig = (): JwtConfig => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET environment variable must be set');
    }

    return {
        secret,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    };
};
