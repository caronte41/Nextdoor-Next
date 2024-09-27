import Service from "@/nextdoor/services/baseService";
//Helpers

export let createPromise = async (requestParameters) => {
  let service = Service(requestParameters?.context);

  try {
    switch (requestParameters?.type) {
      case "POST":
        return await service.post(
          requestParameters?.url,
          requestParameters?.payload
        );

      case "GET":
        return await service.get(requestParameters?.url);

      case "PUT":
        return await service.put(
          requestParameters?.url,
          requestParameters?.payload
        );

      case "PATCH":
        return await service.patch(
          requestParameters?.url,
          requestParameters?.payload
        );

      case "DELETE":
        return await service.delete(
          requestParameters?.url,
          requestParameters?.payload
        );

      case "UPLOAD":
        return await service.upload(
          requestParameters?.url,
          requestParameters?.payload,
          requestParameters?.onUploadProgress
        );

      default:
        throw new Error("Invalid request type");
    }
  } catch (error) {
    console.error("Axios Request Error:", error);
    throw error; // Rethrow the error after logging it
  }
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
  try {
    const response = await createPromise(requestParameters);
    return handleSuccess(response);
  } catch (error) {
    return handleError(error);
  }
};

const handleSuccess = async (response) => {
  return Promise.resolve(response);
};

const handleError = async (error, requestParameters) => {
  //showErrorMessage(error)
  return Promise.reject({ error });
};
