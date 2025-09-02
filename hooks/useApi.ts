import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create an Axios instance with base URL
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  });

  // Generic request function
  const request = async (method: HttpMethod, url: string, body?: any, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.request<T>({
        url,
        method,
        data: body,
        ...config,
      });
      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (url: string, config?: AxiosRequestConfig) => request("get", url, null, config);
  const post = (url: string, body: any, config?: AxiosRequestConfig) => request("post", url, body, config);
  const put = (url: string, body: any, config?: AxiosRequestConfig) => request("put", url, body, config);
  const patch = (url: string, body: any, config?: AxiosRequestConfig) => request("patch", url, body, config);
  const del = (url: string, config?: AxiosRequestConfig) => request("delete", url, null, config);

  return { data, loading, error, get, post, put, patch, del };
}

export default useApi;
