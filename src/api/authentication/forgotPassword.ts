import { API_URL } from "../config";
import { TOO_MANY_TRIES } from "../apiClient";

interface PasswordResetResponse {
  message: string;
}

export async function requestPasswordReset(): Promise<PasswordResetResponse> {
  try {
    const response = await fetch(`${API_URL}/admin/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // The server says why (for example, a reset email was sent a moment ago).
      const body = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(
        body.error ||
          (response.status === 429 ? TOO_MANY_TRIES : "Failed to send password reset email. Please try again.")
      );
    }

    const data = await response.json() as PasswordResetResponse;
    return data;
  } catch (error) {
    throw error;
  }
}
