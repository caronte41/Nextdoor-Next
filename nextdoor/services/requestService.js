import Service from "@services/baseService";
//Helpers
import { Toast } from "@helpers/toastHelper";

export let createPromise = async (requestParameters) => {
  let promise = new Promise(() => {});

  let service = Service(requestParameters?.context);

  switch (requestParameters?.type) {
    case "POST":
      promise = await service.post(
        requestParameters?.url,
        requestParameters?.payload
      );

      break;

    case "GET":
      promise = await service.get(requestParameters?.url);

      break;

    case "PUT":
      promise = service.put(requestParameters?.url, requestParameters?.payload);

      break;

    case "PATCH":
      promise = service.patch(
        requestParameters?.url,
        requestParameters?.payload
      );

      break;

    case "DELETE":
      promise = service.delete(
        requestParameters?.url,
        requestParameters?.payload
      );

      break;

    case "UPLOAD":
      promise = service.upload(
        requestParameters?.url,
        requestParameters?.payload,
        requestParameters?.onUploadProgress
      );

      break;

    default:
      break;
  }

  return promise;
};

export const makeGetRequest = async (
  url,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "GET",
    url,
    showNotifications,
    context,
  };
  return await makeRequest(requestParameters);
};
export const makeGetRequestAsync = async (
  url,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "GET",
    url,
    showNotifications,
    context,
  };
  return makeRequest(requestParameters);
};

export const makeGetBlobRequest = async (url, context = null) => {
  const requestParameters = {
    type: "GETBLOB",
    url,
    context,
  };
  return await makeRequest(requestParameters);
};

export const makePostRequest = async (
  url,
  payload,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "POST",

    url,

    payload,

    showNotifications,

    context,
  };

  return await makeRequest(requestParameters);
};

export const makePutRequest = async (
  url,
  payload,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "PUT",

    url,

    payload,

    showNotifications,

    context,
  };

  return await makeRequest(requestParameters);
};

export const makePatchRequest = async (
  url,
  payload,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "PATCH",

    url,

    payload,

    showNotifications,

    context,
  };

  return await makeRequest(requestParameters);
};

export const makeDeleteRequest = async (
  url,
  payload,
  context = null,
  showNotifications = true
) => {
  const requestParameters = {
    type: "DELETE",

    url,
    payload,
    showNotifications,

    context,
  };

  return await makeRequest(requestParameters);
};

export const makeUploadRequest = async (
  url,

  payload,

  context = null,

  showNotifications = true,

  onUploadProgress = null
) => {
  const requestParameters = {
    type: "UPLOAD",

    url,

    payload,

    onUploadProgress,

    showNotifications,

    context,
  };

  return await makeRequest(requestParameters);
};

const makeRequest = async (requestParameters) => {
  return createPromise(requestParameters)
    .then((response) => {
      return handleSuccess(response);
    })

    .catch((error) => {
      return handleError(error);
    });
};

const handleSuccess = async (response) => {
  return Promise.resolve(response);
};

const handleError = async (error, requestParameters) => {
  //showErrorMessage(error)
  return Promise.reject({ error });
};
