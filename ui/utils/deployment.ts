/**
 * Deployment and read-only mode utilities
 * 
 * In production (Netlify), the UI operates in read-only mode:
 * - No editing modules
 * - No saving changes
 * - No server-side prompt generation
 * 
 * All content is served from the committed builds/ directory
 */

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isReadOnly = isProduction;

/**
 * Throws an error if attempting to write in read-only mode
 */
export function assertWriteAccess(action: string = 'This action'): void {
    if (isReadOnly) {
        throw new Error(
            `Read-only mode: ${action} is not available in production. ` +
            `Please make changes locally and commit to update the deployed site.`
        );
    }
}

/**
 * Returns a user-friendly message for read-only mode
 */
export function getReadOnlyMessage(action: string = 'editing'): string {
    return `${action.charAt(0).toUpperCase() + action.slice(1)} is disabled in production. ` +
        `This is a read-only library viewer. To make changes, edit locally and push to GitHub.`;
}

/**
 * Check if a feature should be enabled based on environment
 */
export function isFeatureEnabled(feature: 'edit' | 'save' | 'generate' | 'delete'): boolean {
    // All write operations are disabled in production
    if (isReadOnly) {
        return false;
    }

    // In development, all features are enabled
    return true;
}

/**
 * Get deployment info for display
 */
export function getDeploymentInfo() {
    return {
        environment: process.env.NODE_ENV || 'development',
        isProduction,
        isDevelopment,
        isReadOnly,
        platform: isProduction ? 'Netlify' : 'Local',
    };
}
