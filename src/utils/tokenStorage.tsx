export interface loginResponse {
    access_token: string;
    refresh_token: string;
}

export const saveTokens = (tokens: loginResponse) => {
    localStorage.setItem("access_token", JSON.stringify(tokens.access_token));
    localStorage.setItem("refresh_token", JSON.stringify(tokens.refresh_token));
};

export const getTokens = (): loginResponse | null => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!accessToken || !refreshToken) return null;
  return {
    access_token: JSON.parse(accessToken),
    refresh_token: JSON.parse(refreshToken),
  };
};


export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};