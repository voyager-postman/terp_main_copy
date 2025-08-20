export const DashboarCard = ({ title, value, end, content = <></>, icon }) => {
	return (
		<div className="card  ">
			<div className="card-header p-3 pt-2">
				<div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
					<i className={`material-icons  mdi mdi-${icon}`} />
				</div>
				<div className="text-end pt-1">
					<p className="text-sm mb-0 text-capitalize">{title}</p>
					<h4 className="mb-0">{value}</h4>
				</div>
			</div>
			{!!content && content}
			{!!end && (
				<>
					<hr className="dark horizontal my-0" />
					<div className="card-footer p-3">
						<p className="mb-0">{end}</p>
					</div>
				</>
			)}
		</div>
	)
}
