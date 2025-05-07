import { createContext, useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const IsToastContext = createContext()

const toastLogout = () => {
	toast.success("Logout Successfully", {
		position: "top-right",
		autoClose: 1000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const toastLogin = () => {
	toast.success("Login Successfully", {
		position: "top-right",
		autoClose: 1000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const useRegistrationFailed = () => {
	toast.error("User Registration Failed", {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const userAlreadyRegistered = () => {
	toast.warn("Sorry! You are already registered.", {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const facebookAuthenticationFailed = () => {
	toast.error("Facebook Authentication Failed", {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const googleAuthenticationFailed = () => {
	toast.error("Google Authentication Failed", {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const somethingWentWrong = () => {
	toast.error("Something Went Wrong", {
		position: "top-right",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const updateProfileSuccessfully = () => {
	toast.success("Update Profile Successfully", {
		position: "top-right",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const pleaseLoginFirst = () => {
	toast.warn("Please Login First", {
		position: "top-center",
		autoClose: 1500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "colored",
	})
}

const toastShowLoadingToast = (isSuccess, message) => {
	toast.promise(
		new Promise((resolve, reject) => {
			setTimeout(() => {
				isSuccess ? resolve() : reject()
			}, 1200)
		}),
		{
			pending: "Loading Content...",
			success: `${message}`,
			error: `${message}`,
		},
		{
			autoClose: 2000,
			theme: "colored",
		},
	)
}

const AllToast = {
	toastLogout,
	toastLogin,
	toastShowLoadingToast,
	useRegistrationFailed,
	userAlreadyRegistered,
	facebookAuthenticationFailed,
	googleAuthenticationFailed,
	somethingWentWrong,
	updateProfileSuccessfully,
	pleaseLoginFirst,
}

export const IsToastProvider = (props) => {
	const [isToastMessage, setIsToastMessage] = useState(AllToast)
	return (
		<IsToastContext.Provider value={[isToastMessage, setIsToastMessage]}>
			{props.children}
		</IsToastContext.Provider>
	)
}
