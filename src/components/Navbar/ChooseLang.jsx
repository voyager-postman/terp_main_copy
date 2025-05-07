import { useState } from "react"

const ChooseLang = () => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleLang = () => {
		setIsOpen(!isOpen)
	}
	return (
		<div className="relative inline-block text-left uppercase">
			<div>
				<button
					className="navSvg"
					onClick={toggleLang}
					type="button"
					style={{ fontSize: "30px", fill: "white" }}
				>
					{/* <GrLanguage/> */}
					<i
						className="mdi mdi-web"
						style={{
							color: "white",
							fontSize: "36px",
							position: "relative",
							top: "-3px",
						}}
					/>
				</button>
			</div>
			{isOpen && (
				<div
					className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
					style={{ backgroundColor: "#203764" }}
				>
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="options-menu"
					>
						<a
							href="#"
							className="block px-2 py-2 text-sm text-white hover-underline-animation-profilemenu"
							role="menuitem"
						>
							English
						</a>
						<a
							href="#"
							className="block px-2 py-2 text-sm text-white hover-underline-animation-profilemenu"
							role="menuitem"
						>
							Thai
						</a>
					</div>
				</div>
			)}
		</div>
	)
}

export default ChooseLang
