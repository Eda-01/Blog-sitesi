import db from "../config/database.js";

type CategoryShowDeletedFilter = "true" | "false" | "onlyDeleted" | undefined;

export const getAllCategories = async (showDeleted?: CategoryShowDeletedFilter) => {
    const query = db("categories");

    if (showDeleted === "onlyDeleted") {
        query.whereNotNull("deleted_at");
    } else if (showDeleted === "true") {
        // hiçbir şey ekleme, hepsini getir
    } else {
        query.whereNull("deleted_at");
    }

    return query.select("id", "name", "created_at", "deleted_at");
};

export const createCategory = async (name: string) => {
 return db("categories").insert({ name }).returning(["id", "name"]);
};

export const updateCategory = async (id: number, data: object) => {
    return db("categories").where({ id, deleted_at: null }).update(data).returning("*");
};

export const deleteCategory = async (id: number) => {
    return db("categories").where({ id, deleted_at: null }).update({ deleted_at: new Date() }).returning("*");
};

export const getCategoryById = async (id: number) => {
    return db("categories").where({ id, deleted_at: null }).first();
};