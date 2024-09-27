import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const GetCookie = (key, context = null) => {
  return getCookie(key, context);
};

export const SetCookie = (key, value, option, context = null) => {
  var options = {
    ...context,
    ...option,
  };
  return setCookie(key, value, options);
};

export const DeleteCookie = (key, context = null) => {
  return deleteCookie(key, context);
};
