
import { prisma } from "../config/database";
import { POST_STATUS, SHOW_DELETED } from "../utils/constants";

const createWhereClause = (id: number) => {
  return { id };
};

export const  getAllPosts = async (showDeleted:string, category:number, status:string , tagIds:number[]) => {

let whereClause:any = {};

if(showDeleted === SHOW_DELETED.TRUE){ }
else if (showDeleted === SHOW_DELETED.ONLY_DELETED){
  whereClause.deleted_at = { not: null };
} else {
  whereClause.deleted_at = null;   
}
if(category){
  whereClause.category_id = category;
}
if(status === POST_STATUS.PUBLISHED){
  whereClause.published_at = { not: null };
}
else if (status === POST_STATUS.DRAFT) {
  whereClause.published_at = null;
}
if (tagIds && tagIds.length > 0) {
  whereClause.postTags = {
    some: {
      tag_id: {
        in: tagIds
      },
    },
  };
  }

 return prisma.post.findMany({
  where: whereClause, select: {id: true,title: true},
});
};


export const createPost = async (data: object, userId: number) => {
  return prisma.post.create({data:{...data, user_id: userId}  as any});
};

export const updatePost = async (id: number, data: object) => {
  return  prisma.post.update({where: createWhereClause(id), data: data as any});
};

export const deletePost = async (id: number) => {
  return prisma.post.update({where: createWhereClause(id), data: {deleted_at: new Date()}});
};  

export const getPostById = async (id: number) => {
  return prisma.post.findUnique({where: {id}});
};

