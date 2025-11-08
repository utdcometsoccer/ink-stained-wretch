import { msalInstance } from "./msalConfig";

export async function getAccessToken(): Promise<string | null> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return null;
  try {
    const response = await msalInstance.acquireTokenSilent({
      account: accounts[0],
      scopes:import.meta.env.VITE_ENTRA_SCOPES.split(",")
    });
    return response.accessToken;
  } catch {
    return null;
  }
}
