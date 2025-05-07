import { useTranslation } from "react-i18next"

const lngs = [
	{ code: "en", native: "English" },
	{ code: "th", native: "Thai" },
]

const Language = () => {
	const { t, i18n } = useTranslation()

	const handleTrans = (code) => {
		i18n.changeLanguage(code)
	}

	return (
		<div>
			<h1>{t("Setting")}</h1>
			<h1>{t("Setup")}</h1>
			<h1>{t("Produce")}</h1>
			<h1>{t("UnitCount")}</h1>
			<h1>{t("Boxes")}</h1>
			<h1>{t("Packaging")}</h1>
			{lngs.map((lng, i) => {
				const { code, native } = lng
				return (
					<button
						type="button"
						className="border-2 border-blue-500 mx-4 text-white bg-blue-500 p-2 mt-4"
						onClick={() => handleTrans(code)}
					>
						{native}
					</button>
				)
			})}
		</div>
	)
}

export default Language
