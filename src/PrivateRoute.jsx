import React from "react"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = ({ isAuthenticate, children }) => {
	if (!isAuthenticate) {
		return <Navigate to={"/login"} />
	}
	return children ? children : <Outlet />
}

export default PrivateRoute
