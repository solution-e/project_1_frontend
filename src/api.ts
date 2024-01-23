import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

  export const getCategoryPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryId] = queryKey;
  return instance.get(`category/${categoryId}/post`).then((response) => response.data);
};

export const getCategory = () =>
  instance.get("category/").then((response) => response.data);

export const getCategoryPost = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryPk] = queryKey;
  return instance
    .get(`category/${categoryPk}/post`)
    .then((response) => response.data);
};

export const getPostDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPk] = queryKey;
  return instance.get(`post/${postPk}`).then((response) => response.data);
};

export const getPostReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, postPk] = queryKey;
  return instance
    .get(`post/${postPk}/reviews`)
    .then((response) => response.data);
};

export const getMe = () =>
  instance.get(`user/me`).then((response) => response.data);

export const logOut = () =>
  instance
    .post(`user/logout`, null, {
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUsernameLoginVariables {
  username: string;
  password: string;
}
export interface IUsernameLoginSuccess {
  ok: string;
}
export interface IUsernameLoginError {
  error: string;
}

export const usernameLogIn = ({
  username,
  password,
}: IUsernameLoginVariables) =>
  instance
    .post(
      `/user/login`,
      { username, password },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
  password2: string;
}

export interface ISignUpSuccess {
  ok: string;
}

export interface ISignUpError {
  response: { data: { error: string } };
}

export const signUp = ({
  name,
  email,
  username,
  password,
  password2,
}: ISignUpVariables) =>
  instance
    .post(
      "user/signup",
      { name, email, username, password, password2 },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export interface IUploadPostVariables {
  title: string;
  content: string;
  category: number;
}

export const uploadPost = (variables: IUploadPostVariables) =>
  instance
    .post(`post/`, variables, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
