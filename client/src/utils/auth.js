// Save token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token
export const clearToken = () => {
  localStorage.removeItem("token");
};

// Attach token to fetch
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  return fetch(url, { ...options, headers });
};
