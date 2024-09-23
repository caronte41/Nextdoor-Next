// ** React Imports
import React, { createContext } from "react";

// ** Defaults
const defaultProvider = {};
const AppContext = createContext(defaultProvider);
const AppProvider = ({ children }) => {
  // ** Hooks
  const values = {};
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
export { AppContext, AppProvider };
