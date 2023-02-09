export interface PostType {
  _id: string;
  title: string;
  author: string;
  authorName: string;
  description: string;
  src: string;
  likes: string[];
  likesCount: number;
  favorites: string[];
  favoritesCount: number;
  tags: TagType[];
  createdAt: Date;
};

export interface PostPageType {
  totalCnt: number;
  posts: PostType[];
  hasNext: boolean;
};

export interface ProfileType {
  id: string;
  username: string;
  nickname: string;
  email: string;
  profilesrc: string;
  registerdAt: Date;
};

export interface UserType {
  token: string;
  profile: ProfileType;
};

export type UserFormType = Pick<ProfileType, "username" | "nickname" | "email" | "profilesrc"> & { password: string; };

export interface TagType {
  _id?: string;
  title: string;
  description: string;
  createdAt?: Date;
};

export interface CommentType {
  _id: string;
  post: string;
  author: string;
  authorName: string;
  description: string;
  likes: string[];
  likesCount: number;
  replyCount: number;
  parent: string;
  createdAt: string;
};

export interface CommentPageType {
  totalCnt: number;
  comments: CommentType[];
  hasNext: boolean;
};

export type ReplyPageType = Pick<CommentPageType, "totalCnt" | "hasNext"> & { replies: CommentType[] };

export interface PostSearchParamsType {
  page?: number;
  cnt?: number;
  sort?: string;
  ord?: 1 | -1;
  date_gt?: Date;
  date_gte?: Date;
  date_lt?: Date;
  date_lte?: Date;
  id_gt?: string;
  id_gte?: string;
  id_lt?: string;
  id_lte?: string;
  field?: string;
  keyword?: string;
  category?: string;
  tags?: (string | undefined)[];
};