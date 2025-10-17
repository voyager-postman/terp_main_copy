module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#2563eb",
				btnColor: "#1565c0",
			},
			backgroundImage: {
				Hero: "url('assets/shipping-img.jpg')",
			},
		},
	},
	plugins: [],
}
