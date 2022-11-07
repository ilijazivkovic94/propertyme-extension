import axios from "axios";

const instance = axios.create({
  baseURL: `https://app.propertyme.com/api/openapi`,
});
/**
 * login Auth URL: https://login.propertyme.com/connect/authorize?response_type=code&state=a&client_id=7f44260e-c2ac-4333-a1b4-57412916a2d5&client_secret=228104cd-fbae-40f6-ac03-7bca4f7298c5&scope=activity:read%20communication:read%20contact:read%20property:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback

 */
const loginInstance = axios.create({
  baseURL: `https://app.propertyme.com/api/openapi`,
});
