const ACCOUNT_KEY = "admin-account";
const SESSION_KEY = "admin-session";
const LEGACY_ACCOUNT_KEY = "admin-user";

function parseJson(storage, key) {
  try { return JSON.parse(storage.getItem(key) || "null"); }
  catch { return null; }
}

function isValidAccount(value) {
  return Boolean(value && typeof value.email === "string" && typeof value.password === "string");
}

export function getAdminAccount() {
  const savedAccount = parseJson(localStorage, ACCOUNT_KEY);
  if (isValidAccount(savedAccount)) return savedAccount;

  // Migrate account data created by the previous version of the demo.
  const legacyAccount = parseJson(localStorage, LEGACY_ACCOUNT_KEY);
  if (!isValidAccount(legacyAccount)) return null;

  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(legacyAccount));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: legacyAccount.email }));
    localStorage.removeItem(LEGACY_ACCOUNT_KEY);
  } catch {
    // Keep using the legacy account if storage migration is unavailable.
  }
  return legacyAccount;
}

export function hasAdminSession() {
  const account = getAdminAccount();
  const session = parseJson(sessionStorage, SESSION_KEY);
  return Boolean(account && session && session.email?.toLowerCase() === account.email.toLowerCase());
}

export function startAdminSession(email) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

export function endAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
