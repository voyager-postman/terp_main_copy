const CardHeader = ({ title, endElement }) => {
	return (
		<div className="grayBgColor px-4 py-3 rounded-t">
			<div className="flex justify-between items-center exportPopupBtn">
				<h6 className="font-weight-bolder mb-0">{title}</h6>
				{endElement}
			</div>
		</div>
	)
}

export const Card = ({ title, children, endElement = "" }) => {
	return (
		<div className="bg-white rounded border">
			<CardHeader title={title} endElement={endElement} />
			<div className="px-2 md:px-4">{children}</div>
		</div>
	)
}
