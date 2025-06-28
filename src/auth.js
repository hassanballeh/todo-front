import * as jwt_decode from "jwt-decode";
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");
export const setName = (name) => localStorage.setItem("name", name);
export const getName = () => localStorage.getItem("name");
export const clearName = () => localStorage.removeItem("name");
export const setExpiresAt = (expiresAt) =>
  localStorage.setItem("expiresAt", expiresAt);
export function isTokenExpired() {
  const expiresAt = () => localStorage.getItem("expiresAt");
  if (!expiresAt()) return true;

  const currentTime = new Date().getTime();
  const expirationTime = new Date(expiresAt()).getTime();
  console.log(expirationTime);
  console.log(currentTime);
  console.log(currentTime - expirationTime);

  return currentTime > expirationTime;
}
