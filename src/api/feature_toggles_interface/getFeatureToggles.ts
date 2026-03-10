import { API_URL } from "../config";
import type { FeatureToggles } from "../../types";

/**
 * Fetch feature toggles without using the global apiRequest.
 * This endpoint is public and must not trigger the client's 401 redirect
 * (clearAuth + window.location.href), which would send users to the homepage
 * before they can see the admin password prompt on fresh load.
 */
export async function getFeatureToggles(): Promise<FeatureToggles> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  const response = await fetch(`${API_URL}/feature-toggles`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to load feature toggles: ${response.status}`);
  }
  return response.json() as Promise<FeatureToggles>;
}
