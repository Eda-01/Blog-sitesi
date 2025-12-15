import db from "../config/database.js";

type PostStatusFilter = "published" | "draft" | "all" | undefined;
type PostShowDeletedFilter = "true" | "false" | "onlyDeleted" | undefined;

interface PostFilters {
    category?: number;
    status?: PostStatusFilter;
    showDeleted?: PostShowDeletedFilter;
}

export const getAllPosts = async (filters: PostFilters = {}) => {
    const query = db("posts");

 
    if (filters.showDeleted === "onlyDeleted") {
        query.whereNotNull("deleted_at");
    } else if (filters.showDeleted === "true") {
      
    } else {
     
        query.whereNull("deleted_at");
    }

   
    if (filters.status === "published") {
        query.whereNotNull("published_at");
    } else if (filters.status === "draft") {
        query.whereNull("published_at");
    } else {
        // "all" veya undefined -> published_at'a bakma
    }

  
    if (typeof filters.category === "number") {
        query.where("category_id", filters.category);
    }

    return query.select("id", "title", "category_id", "content", "created_at", "published_at", "deleted_at");
};

export const createPost = async (data: object) => {
 return db("posts").insert(data).returning("*");
};

export const updatePost = async (id: number, data: object) => {
    return db("posts").where({ id, deleted_at: null }).update(data).returning("*");
};

export const deletePost = async (id: number) => {
    return db("posts").where({ id, deleted_at: null }).update({ deleted_at: new Date()}).returning("*");
};

export const getPostById = async (id: number) => {
    return db("posts").where({ id, deleted_at: null }).first();
};