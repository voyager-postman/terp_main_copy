import { createContext, useState } from "react"

export const IsLoginAuthenticateContext = createContext()

const checkIsAuthenticate = () => {
	const isAuth = localStorage.getItem("isAuthenticate")
	return isAuth
}

export const IsLoginAuthenticateProvider = (props) => {
	console.log(props);
	const [isAuthenticate, setIsAuthenticate] = useState(checkIsAuthenticate())
	return (
		<IsLoginAuthenticateContext.Provider
			value={[isAuthenticate, setIsAuthenticate]}
		>
			{props.children}
		</IsLoginAuthenticateContext.Provider>
	)
}
