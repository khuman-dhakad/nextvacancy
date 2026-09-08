"use server";

export async function requestPasswordResetAction(): Promise<{
  success: false;
  error: string;
}> {
  return {
    success: false,
    error:
      "Password recovery is not configured yet. Please contact the administrator.",
  };
}
