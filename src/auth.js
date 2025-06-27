export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");
export const setName = (name) => localStorage.setItem("name", name);
export const getName = () => localStorage.getItem("name");
export const clearName = () => localStorage.removeItem("name");
