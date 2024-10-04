import {
  makeGetRequest,
  makePostRequest,
} from "@/nextdoor/services/requestService";

export const getAllEventsByProfileId = async (profileId, context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_GETALLEVENTSBYPROFILEID + "?ProfileId=" + profileId,
    context
  );
};
