import {
  makeGetRequest,
  makePostRequest,
} from "@/nextdoor/services/requestService";

export const updateIndividualProfile = async (data) => {
  return await makePostRequest(
    process.env.NEXT_PUBLIC_UPDATEINDIVIDUALPROFILE,
    data
  );
};

export const getIndividualProfileByAccountId = async (accountId, context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_GETINDIVIDUALPROFILEBYACCOUNTID +
      "?accountId=" +
      accountId,
    context
  );
};

export const upsertBusinessProfile = async (data) => {
  return await makePostRequest(
    process.env.NEXT_PUBLIC_UPSERTBUSINESSPROFILE,
    data
  );
};

export const getBusinessProfileByAccountId = async (accountId, context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_GETBUSINESSPROFILEBYACCOUNTID +
      "?accountId=" +
      accountId,
    context
  );
};
