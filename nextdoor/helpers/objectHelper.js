export const _isNullorUndefined = (object) => {
  return object === null || object === undefined;
};

export const _isEmpty = (obj1) => {
  if (obj1 === null || obj1 === undefined) return true;

  if (Array.isArray(obj1) || typeof obj1 === "string") {
    return obj1.length === 0;
  }

  if (typeof obj1 === "object") {
    return Object.keys(obj1).length === 0;
  }

  return false;
};

export const _firstOrDefault = (data) => {
  return data && data.length > 0 ? data[0] : undefined;
};
