import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { error } from "console";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/"
      : "https://admin.b-lur.com/",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
{
  /*
const fetchCsrfToken = () =>
  instance.get("user/get-token").then((response) => response.data);

instance.interceptors.request.use(
  async (config) => {
    let csrfToken = Cookies.get("csrftoken");
    if (!csrfToken) {
      csrfToken = await fetchCsrfToken();
      if (csrfToken) {
        Cookies.set("csrftoken", csrfToken);
      }
    }
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
*/
}
export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

export const getPostListPagenate = ({ queryKey }: QueryFunctionContext) => {
  const [_, page] = queryKey;
  return instance.get(`post/?page=${page}`).then((response) => response.data);
};

export const getCategoryPostListPagenate = ({
  queryKey,
}: QueryFunctionContext) => {
  const [_, categoryId, page] = queryKey;
  return instance
    .get(`category/${categoryId}/post?page=${page}`)
    .then((response) => response.data);
};

export const getCategoryPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryId] = queryKey;
  return instance
    .get(`category/${categoryId}/post`)
    .then((response) => response.data);
};

export const getCategory = () =>
  instance.get("category/").then((response) => response.data);

export const getCategoryInfo = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryPk] = queryKey;
  return instance
    .get(`category/${categoryPk}`)
    .then((response) => response.data);
};

export const getPostCount = () =>
  instance.get("post/count").then((responce) => responce.data);

export const getCategoryPostCount = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryPk] = queryKey;
  return instance
    .get(`category/${categoryPk}/count`)
    .then((response) => response.data);
};

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
export const DeletePostDetail = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, postPk] = queryKey;
  return instance
    .delete(`post/${postPk}`, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const DeleteReviewDetail = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, reviewPk] = queryKey;
  return instance
    .put(`review/${reviewPk}/delete`, null, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
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
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
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
  response: { data: { error: string; email: string } };
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
          "X-CSRFToken": Cookies.get("csrftoken") || "",
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
  response: { data: { error: string; email: string } };
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
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export interface IUploadPostVariables {
  title: string;
  file: FileList;
  content: string;
  category: number;
}

export const uploadPost = (variables: IUploadPostVariables) =>
  instance
    .post(`post/`, variables, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUpdatePostVariables {
  title: string;
  content: string;
  category: number;
  postPk: number;
  mainimage: string;
}
export const updatePost = (variables: IUpdatePostVariables) =>
  instance
    .put(`post/${variables.postPk}`, variables, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUserUpdateSuccess {
  ok: string;
}
export interface IUserUpdateError {
  response: {
    data: {
      error: string;
    };
  };
}
export interface IUserUpdateVariables {
  name: string;
  old_password: string;
  new_password: string;
}

export interface IUploadImageVarialbes {
  file: FileList;
  uploadURL: string;
}

export const getUploadURL = () =>
  instance
    .post(`media/photo/get-url`, null, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const uploadImage = ({ file, uploadURL }: IUploadImageVarialbes) => {
  const form = new FormData();
  form.append("file", file[0]);
  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export const userUpdate = ({
  name,
  old_password,
  new_password,
}: IUserUpdateVariables) =>
  instance
    .put(
      `user/update`,
      { name, old_password, new_password },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export const getMyPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, author, page] = queryKey;
  return instance
    .get(`post/${author}/author?page=${page}`)
    .then((response) => response.data);
};

export const getOtherInfo = ({ queryKey }: QueryFunctionContext) => {
  const [_, otherId] = queryKey;
  return instance
    .get(`user/${otherId}/Other`)
    .then((response) => response.data);
};
export interface IUploadImages {
  blob: Blob;
  uploadURL: string;
  regexwords: string;
  count: number;
}

export const uploadImages = ({ blob, uploadURL }: IUploadImages) => {
  const formData = new FormData();
  formData.append("file", blob);

  return axios
    .post(uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export interface IUploadReviewVariables {
  review_content: string;
  postPk: number;
  parent_review: number | null;
}

export const uploadReview = (variables: IUploadReviewVariables) =>
  instance
    .post(`post/${variables.postPk}/reviews`, variables, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUpdateReviewVariables {
  review_content: string;
  reviewPk: number;
}

export const updateReview = (variables: IUpdateReviewVariables) =>
  instance
    .put(`review/${variables.reviewPk}/update`, variables, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const isLike = ({ queryKey }: QueryFunctionContext) => {
  const [_, postpk] = queryKey;
  return instance.get(`post/${postpk}/like`).then((response) => response.data);
};

export const addLike = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, postpk] = queryKey;
  return instance
    .put(`post/${postpk}/like`, null, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const deleteLike = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, postpk] = queryKey;
  return instance
    .delete(`post/${postpk}/like`, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const isDislike = ({ queryKey }: QueryFunctionContext) => {
  const [_, postpk] = queryKey;
  return instance
    .get(`post/${postpk}/dislike`)
    .then((response) => response.data);
};

export const addDislike = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, postpk] = queryKey;
  return instance
    .put(`post/${postpk}/dislike`, null, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const deleteDislike = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, postpk] = queryKey;
  return instance
    .delete(`post/${postpk}/dislike`, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const isFavorite = ({ queryKey }: QueryFunctionContext) => {
  const [_, categorypk] = queryKey;
  if (categorypk == undefined) {
    return Promise.resolve(false);
  }
  return instance
    .get(`favorite/${categorypk}/exists`)
    .then((response) => response.data);
};

export const addFavorite = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, categorypk] = queryKey;
  return instance
    .post(`favorite/${categorypk}/toggle`, null, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const removeFavorite = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}) => {
  const [_, categorypk] = queryKey;
  return instance
    .put(`favorite/${categorypk}/toggle`, null, {
      headers: {
        "X-CSRFTOKEN": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

export const GetLikeSortPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, page] = queryKey;
  return instance
    .get(`post/sort/likes?page=${page}`)
    .then((response) => response.data);
};

export const GetLikeSortCategoryList = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryId, page] = queryKey;
  return instance
    .get(`category/${categoryId}/sort/likes?page=${page}`)
    .then((response) => response.data);
};

export const getLikesSortPostCount = () =>
  instance.get("post/sort/likes/count").then((responce) => responce.data);

export const getLikesSortCategoryPostCount = ({
  queryKey,
}: QueryFunctionContext) => {
  const [_, categoryPk] = queryKey;
  return instance
    .get(`category/${categoryPk}/sort/likes/count`)
    .then((response) => response.data);
};

export const GetsearchPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, keyword, srcObject, page] = queryKey;
  return instance
    .get(`post/${keyword}/search?search=${srcObject}&page=${page}`)
    .then((response) => response.data);
};

export const GetFavoriteCategory = () =>
  instance.get("favorite/").then((response) => response.data);

export const resendActivationEmail = (email: string) =>
  instance
    .post(
      "/user/resend-activation-email",
      { email },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => console.error("Error:", error));

export const getNotifications = () =>
  instance.get("notifications/").then((response) => response.data);

export interface IPostNotifications {
  user: number;
  message: string;
}

export const postNotifications = (variables: IPostNotifications) =>
  instance
    .post("/notifications/create/", variables, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const readNotifications = () =>
  instance
    .put("notifications/read", null, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const verifyToken = async (uid: string, token: string) => {
  try {
    const response = await instance.post('user/verify-token', { uid, token });
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'トークン検証に失敗しました');
  }
};

export const resetPassword = async (uid: string, token: string, password: string) => {
  try {
    const response = await instance.post('user/reset-password', { uid, token, password });
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'パスワードリセットに失敗しました');
  }
};

export const sendLoginEmail = (email: string) =>
  instance
    .post(
      "/user/send-loginid-Email",
      { email },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => console.error("Error:", error));

export const sendPasswordEmail = (email: string) =>
  instance
    .post(
      "/user/send-password-Email",
      { email },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => console.error("Error:", error));
