import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isTokenExpired = (token: string, leewaySeconds = 0): boolean => {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;
    return exp * 1000 <= Date.now() + leewaySeconds * 1000;
  } catch {
    return true; // token malformado
  }
};