import { prisma } from "../config/database.js";



export const  getAllComments = async (post: number, commenter: string) => {

let whereClause:any = {};
if(post){
  whereClause.post_id = post;
}
if(commenter){
  whereClause.user = {name : commenter};
}
  return prisma.comment.findMany({
    where: whereClause,
    select: { id: true, content: true, user: { select: { name: true } } }
  });

};


export const createComment = async (data: { post_id: number; content: string }, userId: number) => {
  return prisma.comment.create({
    data: {
      ...data,
      user_id: userId
    }
  });
}

export const updateComment = async(id: number, data: object) => {
  return  prisma.comment.update({where: {id}, data: data as any});
}

export const deleteComment = async(id: number) => {
  return prisma.comment.delete({where: {id}});
}

export const getCommentById = async(id: number) => {
  return prisma.comment.findUnique({where: {id}});

}