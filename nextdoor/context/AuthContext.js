// ** React Imports
import React, { createContext, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";
// ** Axios
//services
//** Helper */
import { DeleteCookie, GetCookie } from "@/nextdoor/helpers/cookieHelper";
import Routes from "@/nextdoor/helpers/constants/route";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    GetCookie(process.env.NEXT_PUBLIC_AUTH) ?? defaultProvider?.user
  );
  const [loading, setLoading] = useState(defaultProvider?.loading);
  // ** Hooks
  const router = useRouter();
  const handleLogout = () => {
    setUser(null);
    DeleteCookie(process.env.NEXT_PUBLIC_AUTH);
    router.push(Routes?.anasayfa);
  };
  const values = {
    user,
    setUser,
    loading,
    setLoading,
    logout: handleLogout,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export { AuthContext, AuthProvider };
