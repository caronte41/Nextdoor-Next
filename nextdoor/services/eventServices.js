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

export const createEvent = async (data) => {
  return await makePostRequest(process.env.NEXT_PUBLIC_CREATEEVENT, data);
};

export const getUsersEvents = async (profileId, context) => {
  return await makeGetRequest(
    process.env.NEXT_PUBLIC_GETUSERSEVENTS + "?ProfileId=" + profileId,
    context
  );
};

export const addParticipantToEvent = async (data) => {
  return await makePostRequest(
    process.env.NEXT_PUBLIC_ADDPARTICIPANTTOEVENT,
    data
  );
};
