import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const instance = axios.create({
    baseURL:"http://127.0.0.1:8000/"
}) 

export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

export const getPostDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPk] = queryKey;
  return instance.get(`post/${postPk}`).then((response) => response.data);
};


export const getCategoryName = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryPk] = queryKey;
  return instance.get(`category/${categoryPk}`).then((response) => response.data);
};