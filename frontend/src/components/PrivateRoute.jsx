import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

function PrivateRoute({ noAuth }) {
  const { user } = useUser();

  if ((!noAuth && !user) || (noAuth && user)) return <Navigate to='/' />
  return <Outlet />;
}

export default PrivateRoute;
