import { makeGetRequest } from "@/nextdoor/services/requestService";

export const getAllGenders = async (context) => {
  return await makeGetRequest(process.env.NEXT_PUBLIC_GETALLGENDERS, context);
};

export const getAllBusinessCategories = async (context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_GETALLBUSINESSCATEGORIES,
    context
  );
};
