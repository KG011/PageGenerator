import { AxiosRequestConfig, AxiosResponse } from 'axios';
// import cookie from 'js-cookie';

// 请求拦截器
export const requestSuccess = (request: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // 此处有坑，下方记录
    request.headers['Authorization'] =token;
  }
  return request;
};

export const requestFail = (error: AxiosRequestConfig) => {
  return Promise.reject(error);
};

// 接收拦截器
export const responseSuccess = (response: AxiosResponse) => {
  return response;
};

export const responseFail = (error: AxiosResponse) => {
  return Promise.reject(error);
};