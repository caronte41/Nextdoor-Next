//Helpers
import { GetCookie } from "@/nextdoor/helpers/cookieHelper";
import axios from "axios";

const Service = (context) => {
  var user =
    context != null
      ? GetCookie(process.env.NEXT_PUBLIC_AUTH, context)
      : GetCookie(process.env.NEXT_PUBLIC_AUTH);
  var token = user ? `Bearer ${JSON.parse(user).jwt}` : null;

  let axiosService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    responseType: "json",

    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  let get = (path) => {
    return axiosService.get(path).then((response) => response.data);
  };

  let patch = (path, payload) => {
    return axiosService
      .request({
        method: "PATCH",
        url: path,
        responseType: "json",
        data: payload,
      })
      .then((response) => response.data);
  };

  let put = (path, payload) => {
    return axiosService
      .request({
        method: "PUT",
        url: path,
        responseType: "json",
        data: payload,
      })
      .then((response) => response.data);
  };

  let post = (path, payload) => {
    return axiosService
      .request({
        method: "POST",
        url: path,
        responseType: "json",
        data: payload,
      })
      .then((response) => response.data);
  };

  let upload = (path, payload, onUploadProgress) => {
    return axiosService
      .request({
        method: "POST",
        url: path,
        responseType: "json",
        data: payload,
        onUploadProgress,
      })
      .then((response) => response.data);
  };

  let del = (path, payload) => {
    return axiosService
      .request({
        method: "DELETE",
        url: path,
        responseType: "json",
        data: payload,
      })
      .then((response) => response.data);
  };

  return {
    upload,
    get,
    post,
    patch,
    put,
    delete: del,
  };
};

export default Service;
