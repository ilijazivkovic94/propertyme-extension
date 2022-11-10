import axios from "axios";

const defaultAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2Njc5NTY1OTQsImV4cCI6MTY2Nzk2MDE5NCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5wcm9wZXJ0eW1lLmNvbSIsImF1ZCI6WyJodHRwczovL2xvZ2luLnByb3BlcnR5bWUuY29tL3Jlc291cmNlcyIsImh0dHBzOi8vYXBwLnByb3BlcnR5bWUuY29tL2FwaSJdLCJjbGllbnRfaWQiOiI3ZjQ0MjYwZS1jMmFjLTQzMzMtYTFiNC01NzQxMjkxNmEyZDUiLCJzdWIiOiJDdXN0b21lcklkX2FhOWQwMTY1LWQwZDMtNGNjNy1iZjFkLTFiMTU5ZmJiMDAyMyIsImF1dGhfdGltZSI6MTY2NzgzMjI0NywiaWRwIjoibG9jYWwiLCJjdXN0b21lcl9pZCI6ImFhOWQwMTY1LWQwZDMtNGNjNy1iZjFkLTFiMTU5ZmJiMDAyMyIsIm1lbWJlcl9pZCI6ImFkOTAwMDk2LTgxMjUtNGRhYi05YTlmLTYxNzliYWU1YzU2ZSIsIm1lbWJlcl9hY2Nlc3NfaWQiOiJhZDkwMDA5Ni04MTI3LTRiZGUtODNkNi1kMzgwMzQ1ZjBjMjEiLCJzY29wZSI6WyJwcm9wZXJ0eTpyZWFkIiwiY29tbXVuaWNhdGlvbjpyZWFkIiwiYWN0aXZpdHk6cmVhZCIsInRyYW5zYWN0aW9uOnJlYWQiLCJjb250YWN0OnJlYWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.b9AfwSKafKBNKhHoBas6i0vh4hQvTrFCnM709ZAZ_uTtRBG_nZ_YbLEWD5qt4_TDzXjLPZbvicpPwK9MqDyEuuqZY4G_cR_L_tJaCbW-1eaXHwig9vVVcsulO0QSAW4nPpJ1K3cRIvuCICBIuziPPs3ZSMFh6PDOHkibB0PcY6Na80PTt6fiMASDkQva0GS_XMKKOWAB6-SSegwt2RNG01Ze29OiFVFlm4yZJjgXetOAit3alosP_7PT5qa_0i_lGqgimEvczEtpDVr6CXBIlYEQ-JwOunlwnl5cvMV9s9Izfugn5EulQxm0QBswd3PGIWlt08Jpums7UX5zZSUqlQ";
const defaultRefreshToken = "0ddfcb7fc7731c0bc518ffce369335e2e0f90f517c8d43a92947752fd50d3772";

const accessTokenValue = localStorage.getItem('@access_token') || defaultAccessToken;

export const instance = axios.create({
  baseURL: `https://app.propertyme.com/api/v1`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    'Content-Type': "application/json",
    Authorization: "Bearer " + accessTokenValue,
    'Access-Control-Allow-Origin': "*",
  },
});
/**
 * login Auth URL: https://login.propertyme.com/connect/authorize?response_type=code&state=a&client_id=7f44260e-c2ac-4333-a1b4-57412916a2d5&client_secret=228104cd-fbae-40f6-ac03-7bca4f7298c5&scope=activity:read%20communication:read%20contact:read%20property:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback
 */
export const loginInstance = axios.create({
  baseURL: `https://login.propertyme.com`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    Authorization:
      "Basic N2Y0NDI2MGUtYzJhYy00MzMzLWExYjQtNTc0MTI5MTZhMmQ1OjIyODEwNGNkLWZiYWUtNDBmNi1hYzAzLTdiY2E0ZjcyOThjNQ==",
  },
});

export const refreshToken = () => {
  const currentRefreshToken = localStorage.getItem("@refresh_token") || defaultRefreshToken;
  const postData = {
    grant_type: "refresh_token",
    redirect_uri: "https://hello.propertyme.com/home/callback",
    scope:
      "activity:read contact:read communication:read property:read communication:read transaction:read offline_access",
    refresh_token: currentRefreshToken,
  };
  return loginInstance
    .post("/connect/token", postData)
    .then((res) => res.data)
    .then((res) => {
      localStorage.setItem("@access_token", res.access_token);
      instance.defaults.headers.common['Authorization'] = 'Bearer ' + res.access_token;
      localStorage.setItem("@token_type", res.token_type);
      localStorage.setItem("@refresh_token", res.refresh_token);
      return res;
    });
};

export const getToken = () => {
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

instance.interceptors.response.use(response => response.data, error => {
	const status = error.response ? error.response.status : null

    if (status === 401 && !error.config._retry) {
    	return refreshToken().then(data => {
        console.log(data);
    		defaultAccessToken = data.access_token;
        return instance({
          ...error.config,
          headers: {
              Accept: "application/json",
              'Content-Type': "application/json",
              'Access-Control-Allow-Origin': "*",
              Authorization: 'Bearer ' + defaultAccessToken
          },
        });
    	});
    }
    return Promise.reject(error);
})
