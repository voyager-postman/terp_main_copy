import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
	debug: true,
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	// language resources
	resources: {
		en: {
			translation: {
				Setting: "Setting",
				Setup: "Setup",
				Produce: "Produce",
				UnitCount: "Unit Count",
				Boxes: "Boxes",
				Packaging: "Packaging",
				Ean: "Ean",
				Itf: "Itf",
				AirportManagement: "Airport Management",
				ClearanceManagement: "Clearance Management",
			},
		},
		th: {
			translation: {
				Setting: "ตั้งค่า",
				Setup: "การจัดการ",
				Produce: "สินค้า",
				UnitCount: "จำนวน",
				Boxes: "กล่อง",
				Packaging: "บรรจุภัณฑ์",
				Ean: "",
				Itf: "",
				AirportManagement: "การจัดการสนามบิน",
				ClearanceManagement: "การจัดการการกวาดล้าง",
			},
		},
	},
})

export default i18n
