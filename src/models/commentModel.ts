import db from "../config/database.js";

interface CommentFilters {
    post?: number;
    commenter?: string;
}

export const getAllComments = async (filters: CommentFilters = {}) => {
    const query = db("comments");

    if (typeof filters.post === "number") {
        query.where("post_id", filters.post);
    }

    if (typeof filters.commenter === "string" && filters.commenter.trim() !== "") {
        query.where("commenter_name", filters.commenter);
    }

    return query.select("id", "post_id", "content", "commenter_name", "created_at");
};

export const createComment = async (data: object) => {
 return db("comments").insert(data ).returning("*");
};

export const updateComment = async (id: number, data: object) => {
    return db("comments").where({ id}).update(data).returning("*");
};

export const deleteComment = async (id: number) => {
    return db("comments").where({ id}).delete().returning("*");
};

export const getCommentById = async (id: number) => {
    return db("comments").where({ id}).first();
};