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
  total_likes: number;
  total_dislikes: number;
  views: number;
}

export interface IPostInfo {
  count: number;
  result: IPostList;
  categoryname: string;
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
  mainimage: string;
}

export interface ISortPostList {
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
  parent_category;
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
  file: FileList;
  created_at: string;
  content: string;
  likes: number;
  dislikes: number;
  is_author: boolean;
  updated_at: string;
  views: number;
  total_likes: number;
  total_dislikes: number;
}

interface IAuthor {
  id: string;
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
  isLoggedIn: boolean;
}

export interface IReviewInfo {
  count: number;
  result: IReview[];
}

export interface IReview {
  id: number;
  user: IUser;
  review_content: string;
  created_at: string;
  is_author: boolean;
  parent_review: number;
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

interface IPostCount {
  totalitems: number;
}

interface ILikeSortPostCount {
  sortTotalitems: number;
}

interface IfavoriteStatus {
  isFavorite: boolean;
}

interface IIsLike {
  islike: boolean;
}

interface IIsDislike {
  isdislikes: boolean;
}

interface IFavoriteCategory {
  id: number;
  category: ICategory[];
}

export interface INotification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  user: number;
}

export interface INotificationsList {
  count: number;
  result: INotification[];
}
