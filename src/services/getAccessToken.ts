import { msalInstance } from "./msalConfig";

export async function getAccessToken(): Promise<string | null> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return null;
  try {
    const response = await msalInstance.acquireTokenSilent({
      account: accounts[0],
      scopes: ["User.Read"] // Adjust scopes as needed for your API
    });
    return response.accessToken;
  } catch (err) {
    return null;
  }
}
