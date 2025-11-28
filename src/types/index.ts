export interface Category {
  id: number;
  name: string;
  created_at: Date;
  deleted_at: Date | null;
}

export interface Post {
  id: number;
  category_id: number;
  title: string;
  content: string;
  created_at: Date;
  published_at: Date | null;
  deleted_at: Date | null;
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  commenter_name: string;
  created_at: Date;
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name?: string;
}

export interface CreatePostDto {
  category_id: number;
  title: string;
  content: string;
  published_at?: Date | null;
}

export interface UpdatePostDto {
  category_id?: number;
  title?: string;
  content?: string;
  published_at?: Date | null;
}

export interface CreateCommentDto {
  post_id: number;
  content: string;
  commenter_name: string;
}

export interface UpdateCommentDto {
  content?: string;
  commenter_name?: string;
}

