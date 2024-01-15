import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const instance = axios.create({
    baseURL:"http://127.0.0.1:8000/"
}) 

export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

export const getPostDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPK] = queryKey;
  return instance.get(`post/${postPK}`).then((response) => response.data);
};