import { BiGroup, BiPurchaseTag } from "react-icons/bi"
import { FaSlack, FaUserTie } from "react-icons/fa"
import { IoCart } from "react-icons/io5"
import { MdInventory } from "react-icons/md"

export default function DashboardStatsGrid() {
	return (
		<div className="flex gap-4 grid grid-cols-3">
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
					<FaUserTie className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">Vendor</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							$54232
						</strong>
						<span className="text-sm text-green-500 pl-2">+343</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
					<BiGroup className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">Clients</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							$3423
						</strong>
						<span className="text-sm text-green-500 pl-2">-343</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
					<BiPurchaseTag className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">
						Purchase Order
					</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							12313
						</strong>
						<span className="text-sm text-red-500 pl-2">-30</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<IoCart className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">
						Total Orders
					</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							16432
						</strong>
						<span className="text-sm text-red-500 pl-2">-43</span>
					</div>
				</div>
			</BoxWrapper>

			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<FaSlack className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">ASL</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							16432
						</strong>
						<span className="text-sm text-red-500 pl-2">-43</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
					<MdInventory className="text-2xl text-white" />
				</div>
				<div className="pl-4">
					<span className="text-sm text-gray-500 font-medium">Inventory</span>
					<div className="flex items-center">
						<strong className="text-xl text-gray-700 font-semibold">
							16432
						</strong>
						<span className="text-sm text-red-500 pl-2">-43</span>
					</div>
				</div>
			</BoxWrapper>
		</div>
	)
}

function BoxWrapper({ children }) {
	return (
		<div className="bg-white rounded-sm p-4 h-32 flex-1 border border-gray-200 flex items-center">
			{children}
		</div>
	)
}
