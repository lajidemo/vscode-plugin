import axios, { AxiosRequestConfig } from "axios";
import { window } from "vscode";
import { loginFlow } from "@/extensions/login";
import { getUserInfo } from "./userFn";

export const servers = axios.create({
  baseURL: 'http://localhost/api',
  timeout: 3600000,
})

servers.interceptors.request.use((config: AxiosRequestConfig)=>{
  console.log('config===',config)
  if(!config.headers){
    config.headers = {}
  }
  config.headers['Cookie'] = getUserInfo('cookieStr') || ''
  return config
})

servers.interceptors.response.use(res=>{
  console.log('res===',res)
  const data = res.data
  if(res.config.url === '/auth/login'){
    return res
  }else if(data.status === 0){
    return data.data
  }else if(data.status === 10002){
    window.showErrorMessage(data.message, '重新登录').then((res) => {
      if(res){
        loginFlow()
      }
    })
  }
},err=>{
  console.log('err===',err)
  window.showErrorMessage(err.message)
  return Promise.reject(err.message)
})