import { UnauthorizedError } from "../types/UnauthorizedError";
import { getAccessToken } from "./getAccessToken";

/**
 * Wrapper utility that handles 401 responses by refreshing the access token
 * and retrying the service call once
 * 
 * @param serviceFn - The service function to call, should accept accessToken as a parameter
 * @param currentToken - The current access token
 * @param updateToken - Callback to update the token in application state
 * @returns Promise resolving to the service function result
 */
export async function withAuthRetry<T>(
  serviceFn: (token?: string) => Promise<T>,
  currentToken: string | undefined | null,
  updateToken?: (newToken: string | null) => void
): Promise<T> {
  try {
    // First attempt with current token
    return await serviceFn(currentToken ?? undefined);
  } catch (error) {
    // Check if it's a 401 unauthorized error
    if (error instanceof UnauthorizedError) {
      // Try to refresh the token
      const newToken = await getAccessToken();
      
      // Update token in application state if callback provided
      if (updateToken) {
        updateToken(newToken);
      }
      
      // Retry the service call once with new token
      return await serviceFn(newToken ?? undefined);
    }
    
    // Re-throw other errors
    throw error;
  }
}
