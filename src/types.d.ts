export interface IPhoto {
    pk:string;
    photo_file:string;
}

interface IPost{
    pk: number;
    imageUrl:string;
    title:string;
    category:number;
    created_at:string;
    imageUrl:string;
};

export interface IPostList{
        pk: number;
        category: number;
        title: string;
        author: string;
        photo: IPhoto[];
        created_at: string;
        content: string;
        total_likes: number;
        total_dislikes: number;
        is_author: boolean;
};

export interface ICategory{
    pk: number;
    name: string;
};

export interface IPostCreatedAt{
    pk: number;
    created_at: string;
};

export interface IPostDetail{
    pk: number;
    category: string;
    title: string;
    author: string;
    photo: IPhoto[];
    content: string;
    total_likes: number;
    total_dislikes: number;
    created_at: string;
    is_author: boolean;
};