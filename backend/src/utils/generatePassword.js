const crypto = require("crypto");

/**
 * Generates a temporary password for admin-invited users. There's no
 * email service configured in this environment, so the invite flow
 * displays this once to the inviting admin to share manually — the same
 * pattern real admin consoles (AWS IAM, etc.) fall back to without a
 * configured mail provider. Not a placeholder: this is a real random
 * value, hashed the same way as any user-chosen password.
 */
const generateTempPassword = () => {
  return crypto.randomBytes(9).toString("base64").replace(/[+/=]/g, "x");
};

module.exports = { generateTempPassword };
