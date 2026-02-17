const SESSION_PASSWORD_KEY = 'covenant_chat_password';

export function setSessionPassword(password: string): void {
  sessionStorage.setItem(SESSION_PASSWORD_KEY, password);
}

export function getSessionPassword(): string | null {
  return sessionStorage.getItem(SESSION_PASSWORD_KEY);
}

export function clearSessionPassword(): void {
  sessionStorage.removeItem(SESSION_PASSWORD_KEY);
}

