import axios from "axios";

const instance = axios.create({
  baseURL: `https://app.propertyme.com/api/openapi`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
});
/**
 * login Auth URL: https://login.propertyme.com/connect/authorize?response_type=code&state=a&client_id=7f44260e-c2ac-4333-a1b4-57412916a2d5&client_secret=228104cd-fbae-40f6-ac03-7bca4f7298c5&scope=activity:read%20communication:read%20contact:read%20property:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback
 */
const loginInstance = axios.create({
  baseURL: `https://login.propertyme.com`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Authorization:
      "Basic N2Y0NDI2MGUtYzJhYy00MzMzLWExYjQtNTc0MTI5MTZhMmQ1OjIyODEwNGNkLWZiYWUtNDBmNi1hYzAzLTdiY2E0ZjcyOThjNQ==",
  },
});

const refreshToken = () => {
  const currentRefreshToken = localStorage.getItem("@refresh_token");
  const postData = {
    grant_type: "refresh_token",
    redirect_uri: "https://hello.propertyme.com/home/callback",
    scope:
      "activity:read contact:read communication:read property:read communication:read transaction:read offline_access",
    refresh_token: currentRefreshToken,
  };
  return loginInstance
    .post("/connect/token", postData)
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("@access_token", res.access_token);
      localStorage.setItem("@token_type", res.token_type);
      localStorage.setItem("@refresh_token", res.refresh_token);
    });
};

const getToken = () => {
  const currentCode = localStorage.getItem("@code");
  const postData = {
    grant_type: "authorization_code",
    redirect_uri: "https://hello.propertyme.com/home/callback",
    scope:
      "activity:read contact:read communication:read property:read communication:read transaction:read offline_access",
    code: currentCode,
  };
  return loginInstance
    .post("/connect/token", postData)
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("@access_token", res.access_token);
      localStorage.setItem("@token_type", res.token_type);
      localStorage.setItem("@refresh_token", res.refresh_token);
    });
};

export default {
  instance,
  loginInstance,
  refreshToken,
  getToken,
};
