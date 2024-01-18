import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const instance = axios.create({
    baseURL:"http://127.0.0.1:8000/",
    withCredentials: true,
}) 

export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

export const getPostDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPk] = queryKey;
  return instance.get(`post/${postPk}`).then((response) => response.data);
};

export const getPostReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPk] = queryKey;
  return instance.get(`post/${postPk}/reviews`).then((response) => response.data);
};

export const getMe = () => 
  instance.get(`user/me`).then((response) => response.data);

export const logOut = () => instance.post(`user/logout`, null, {
  headers: {
    "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
  }
}).then((response) => response.data);