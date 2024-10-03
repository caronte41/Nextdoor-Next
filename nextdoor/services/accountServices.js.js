import {
  makeGetRequest,
  makePostRequest,
} from "@/nextdoor/services/requestService";

export const loginUser = async (data) => {
  return await makePostRequest(process.env.NEXT_PUBLIC_SIGNIN_API, data);
};

export const CreateAccount = async (data) => {
  return await makePostRequest(process.env.NEXT_PUBLIC_CREATEACCOUNT_API, data);
};

export const verifyAccount = async (token, context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_VERIFYACCOUNT_API + "?token=" + token,
    context
  );
};
