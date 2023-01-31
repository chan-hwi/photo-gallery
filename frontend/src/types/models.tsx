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
  tags: string[];
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