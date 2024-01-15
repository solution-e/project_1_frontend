export interface IPhoto {
    pk:string;
    photo_file:string;
}

export interface IPostList{
        pk: number
        category: string,
        title: string,
        author: string,
        photo: IPhoto[]
        content: string,
        total_likes: number,
        total_dislikes: number,
        created_at: string,
        is_author: boolean
};

export interface IPostDetail{
    pk: number
    category: string,
    title: string,
    author: string,
    photo: IPhoto[]
    content: string,
    total_likes: number,
    total_dislikes: number,
    created_at: string,
    is_author: boolean
};