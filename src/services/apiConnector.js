import axios from "axios";

// Use environment variables with fallback for production deployment
const BASE_URL = process.env.REACT_APP_BASE_URL || "https://server-1-aw2i.onrender.com";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  console.log("API Call:", method, url);
  
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  }); 
}
