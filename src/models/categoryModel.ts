import {prisma} from "../config/database.js";
import { SHOW_DELETED } from "../utils/constants.js";


const createWhereClause = (id: number, deleted_at: Date | null) => {
  return{
    id, deleted_at: deleted_at
  }
}


export const  getAllCategories = async (showDeleted:string) => {

  let whereClause:any = {};
  if(showDeleted === SHOW_DELETED.TRUE){ }
  else if (showDeleted === SHOW_DELETED.ONLY_DELETED){
    whereClause.deleted_at = { not: null };
  } else {
    whereClause.deleted_at = null;  
  }
  
   return prisma.category.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
    },
  });
  };



export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: {
      name,
    },});
};



export const updateCategory = async (id: number, data: object) => {
  
  return prisma.category.update({ where: createWhereClause(id, null),data});
  }

export const deleteCategory = async (id: number) => {

    const data = {deleted_at: new Date()}
  return prisma.category.update({where: createWhereClause(id, null),data})
};  

export const getCategoryById = async (id: number) => {

  return prisma.category.findUnique({
    where: createWhereClause(id,null)})
    
};

