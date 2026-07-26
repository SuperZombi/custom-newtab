const CategoryButton = ({className="", accent, children, href, ...props}) => {
	return (
		<a href={href}>
			<Container className={`
				p-3 aspect-square flex items-center justify-center
				cursor-pointer transition-colors
				${accent ? `!bg-[${accent}]/5 !ring-[${accent}]/20
					hover:!bg-[${accent}]/15 text-[${accent}]` :
					"hover:bg-white/15"
				}
				${className}
			`} {...props}>
				{children}
			</Container>
		</a>
	)
}

const CategoryWidget = ({
	icon, title, elements, accent
}) => {
	const clickHandler = (url) => {
		window.open(url, "_self")
	}
	return (
		<Container className={`p-4 flex flex-col gap-3
			${accent ? `!bg-[${accent}]/10 !ring-[${accent}]/20` : ""}
		`}>
			<div className={`flex gap-2 items-center ${accent ? `text-[${accent}]` : ""}`}>
				{icon}
				<span>{title}</span>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{elements.map(e=>(
					<div key={e.url} className="relative group">
						<CategoryButton href={e.url} accent={accent}>
							{e.icon}
						</CategoryButton>
						{e.label && (<Tooltip accent={accent}>{e.label}</Tooltip>)}
					</div>
				))}
				<CategoryButton className={`
					
					ring-0 outline outline-dashed
					${accent ? `
						text-[${accent}]/50 hover:text-[${accent}]
						hover:outline-[${accent}]/50
						` : `
						text-white/50 hover:text-white
						hover:!bg-white/10 outline-white/20
						hover:outline-white/30
					`}
				`} accent={accent}>
					<i className="fa-solid fa-plus"></i>
				</CategoryButton>
			</div>
		</Container>
	)
}
