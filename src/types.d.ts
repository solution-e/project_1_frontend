export interface IPhoto {
  pk: string;
  photo_file: string;
}

interface IPost {
  id: number;
  imageUrl: string;
  title: string;
  review_count: number;
  category: string;
  created_at: string;
  imageUrl: string;
}

export interface IPostList {
  id: number;
  category: ICategory;
  title: string;
  author: string;
  photo: IPhoto[];
  created_at: string;
  content: string;
  total_likes: number;
  total_dislikes: number;
  is_author: boolean;
  review_count: number;
}

export interface ICategory {
  id: number;
  name: string;
  parent_category
}

export interface IPostCreatedAt {
  pk: number;
  created_at: string;
}

export interface IPostDetail {
  id: number;
  category: ICategory;
  title: string;
  author: IAuthor;
  photo: IPhoto[];
  created_at: string;
  content: string;
  total_likes: number;
  total_dislikes: number;
  is_author: boolean;
}

interface IAuthor {
  id : string;
  name: string;
}

export interface IUser {
  id: number;
  last_login: string;
  username: string;
  email: string;
  date_joined: string;
  name: string;
  is_staff: boolean;
  user_flag: string;
}

export interface IReview {
  user: IUser;
  review_content: string;
  created_at: string;
}

interface ISignUpVariables {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface ISignUpSuccess {
  success: string;
}

interface ISignUpError {
  fail: string;
}

interface IOtherInfo {
  id: number;
  name: string;
  date_joined: string;
}
