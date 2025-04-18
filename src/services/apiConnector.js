import axios from "axios";

// Directly use the local URL for development
const BASE_URL = "http://localhost:4000/api/v1";

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
