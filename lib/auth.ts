/**
 * Helper to extract user-friendly error messages from Clerk API responses.
 */
export function getClerkErrorMessage(err: any): string {
  if (!err) return "An unexpected error occurred. Please try again.";

  // Clerk standard error array format
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    const firstErr = err.errors[0];
    const message = firstErr.longMessage || firstErr.message;
    if (message) {
      // Sanitize generic terms if needed
      return message
        .replace(/identifier/gi, "email address")
        .replace(/clerk/gi, "Recurrly");
    }
  }

  if (typeof err.message === "string" && err.message.length > 0) {
    return err.message
      .replace(/identifier/gi, "email address")
      .replace(/clerk/gi, "Recurrly");
  }

  return "An error occurred. Please check your credentials and try again.";
}

/**
 * Validates email format using regex.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates password strength (minimum 8 characters).
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
