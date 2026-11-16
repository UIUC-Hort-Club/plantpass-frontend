import { API_URL } from "../config";
import { TOO_MANY_TRIES } from "../apiClient";

interface PasswordResetResponse {
  message: string;
}

const FAILED = "Failed to send password reset email. Please try again.";

export async function requestPasswordReset(): Promise<PasswordResetResponse> {
  const response = await fetch(`${API_URL}/admin/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch(() => {
    throw new Error(FAILED);
  });

  if (response.status === 429) {
    // The server says why when it can (a reset email was sent a moment ago).
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error || TOO_MANY_TRIES);
  }
  if (!response.ok) {
    throw new Error(FAILED);
  }

  return response.json() as Promise<PasswordResetResponse>;
}
