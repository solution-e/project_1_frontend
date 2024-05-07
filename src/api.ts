import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

export const getPostList = () =>
  instance.get("post/").then((response) => response.data);

export const getPostListPagenate = ({ queryKey }: QueryFunctionContext) => {
const [_, page] = queryKey;
return instance
  .get(`post/?page=${page}`)
  .then((response) => response.data);
};

export const getCategoryPostListPagenate = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryId ,page] = queryKey;
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
export const DeletePostDetail = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, postPk] = queryKey;
  return instance.delete(`post/${postPk}`, {
    headers: {
      "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
    },
  })
  .then((response) => response.data);
};



export const DeleteReviewDetail = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, reviewPk] = queryKey;
  return instance.put(`review/${reviewPk}/delete`, null,{
    headers: {
      "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
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
  file: FileList;
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

export interface IUpdatePostVariables {
  title: string;
  content: string;
  category: number;
  postPk: number;
  mainimage:string;
}
export const updatePost = (variables: IUpdatePostVariables) =>
    instance
      .put(`post/${variables.postPk}`, variables, {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      })
      .then((response) => response.data);

export interface IUserUpdateSuccess {
  ok: string;
}
export interface IUserUpdateError {
  error: string;
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
        "X-CSRFToken": Cookie.get("csrftoken") || "",
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
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export const getMyPostList = ({ queryKey }: QueryFunctionContext) => {
  const [_, author] = queryKey;
  return instance
    .get(`post/${author}/author`)
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
  regexwords:string;
  count:number;
}

export const uploadImages = ({ blob, uploadURL }: IUploadImages) => {
  const formData = new FormData();
  formData.append("file",blob)

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
        "X-CSRFToken": Cookie.get("csrftoken") || "",
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
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  })
  .then((response) => response.data);

export const isLike = ({ queryKey }: QueryFunctionContext) => {
  const [_, postpk] = queryKey;
  return instance
    .get(`post/${postpk}/like`)
    .then((response) => response.data);
};

export const addLike = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, postpk] = queryKey;
  return instance
    .put(`post/${postpk}/like`, null,{
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const deleteLike = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, postpk] = queryKey;
  return instance
    .delete(`post/${postpk}/like`,{
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const isDislike = ({ queryKey }: QueryFunctionContext) => {
  const [_, postpk] = queryKey;
  return instance
    .get(`post/${postpk}/dislike`)
    .then((response) => response.data);
};

export const addDislike = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, postpk] = queryKey;
  return instance
    .put(`post/${postpk}/dislike`, null,{
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const deleteDislike = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, postpk] = queryKey;
  return instance
    .delete(`post/${postpk}/dislike`,{
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const isFavorite = ({ queryKey }: QueryFunctionContext) => {
  const [_, categorypk] = queryKey;
  if (categorypk == undefined) {
    return Promise.resolve(false);
  }
    return instance
    .get(`favorite/${categorypk}/exists`)
    .then((response) => response.data);
};

export const addFavorite = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, categorypk] = queryKey;
  return instance
    .post(`favorite/${categorypk}/toggle`, null,{
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const removeFavorite = async ({ queryKey }: { queryKey: (string | number)[] }) => {
  const [_, categorypk] = queryKey;
  return instance
    .put(`favorite/${categorypk}/toggle`, null, {
      headers: {
        "X-CSRFTOKEN": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
}

export const GetLikeSortPostList  = ({ queryKey }: QueryFunctionContext) => {
  const [_, page] = queryKey;
  return instance
    .get(`post/sort/likes?page=${page}`)
    .then((response) => response.data);
};

export const GetLikeSortCategoryList = ({ queryKey }: QueryFunctionContext) => {
  const [_, categoryId ,page] = queryKey;
  return instance
    .get(`category/${categoryId}/sort/likes?page=${page}`)
    .then((response) => response.data);
  };

  export const getLikesSortPostCount = () =>
  instance.get("post/sort/likes/count").then((responce) => responce.data);

  export const getLikesSortCategoryPostCount = ({ queryKey }: QueryFunctionContext) => {
    const [_, categoryPk] = queryKey;
    return instance
      .get(`category/${categoryPk}/sort/likes/count`)
      .then((response) => response.data);
  };

  export const GetsearchPostList = ({ queryKey }: QueryFunctionContext) => {
    const [_, keyword,srcObject,page] = queryKey;
    return instance
      .get(`post/${keyword}/search?search=${srcObject}&page=${page}`)
      .then((response) => response.data);
  }