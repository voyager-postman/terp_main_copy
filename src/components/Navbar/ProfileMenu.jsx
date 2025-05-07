import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IsLoginAuthenticateContext } from "../../Contexts/LoginContext"
import { IsToastContext } from "../../Contexts/ToastContext"
import profile from "../../assets/defaultwhoshotpic.png"
import { removeUserDetail } from "../userDetailToken"
// import {toast} from 'react-toastify';

const ProfileMenu = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isToastMessage] = useContext(IsToastContext)
	const [isAutehnticate, setIsAuthenticate] = useContext(
		IsLoginAuthenticateContext,
	)
	const navigate = useNavigate()

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	const handleLogout = () => {
		// setState(prevState => ({ ...prevState, isOpen: false, isOpenSecond: false, isOpenThird: false, isOpenFour: false }));
		// setIsToggle(null)
		setIsAuthenticate(null)
		isToastMessage.toastLogout()
		navigate("/login")
		localStorage.removeItem("isAutehnticate")
		removeUserDetail()
	}

	return (
		<div className="relative inline-block text-left uppercase">
			<div>
				<button
					onClick={toggleMenu}
					type="button"
					className="text-gray-600 hover:text-gray-900 focus:outline-none"
				>
					<img
						className="w-8 h-8 rounded-full"
						src={profile}
						alt="User Profile"
					/>
				</button>
			</div>
			{isOpen && (
				<div
					className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
					style={{ backgroundColor: "#203764" }}
				>
					<div
						className="py-1 pr-6"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<a
							href="#"
							className="block px-2 py-2 text-sm text-white hover-underline-animation-profilemenu"
							role="menuitem"
						>
							Profile
						</a>
						<a
							href="#"
							className="block px-2 py-2 text-sm text-white hover-underline-animation-profilemenu"
							role="menuitem"
						>
							Settings
						</a>
						<button
							type="button"
							className="block px-2 py-2 text-sm text-white hover-underline-animation-profilemenu"
							role="menuitem"
							onClick={handleLogout}
						>
							Sign out
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProfileMenu
