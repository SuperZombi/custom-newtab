const Container = ({children, className="", ...props}) => {
	return (
		<div className={`ring ring-white/20 rounded-xl bg-white/5 shadow-lg ${className}`} {...props}>
			{children}
		</div>
	)
}

const Select = ({
	options, selected, setSelected,
	show, className=""
}) => {
	return (
		<Container className={`grid grid-cols-[auto_1fr]
			transition-all
			${show ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"}
			${className}
		`}>
			{options.map(e => (
				<div key={e.name} className={`
					grid grid-cols-subgrid col-span-2
					py-2 px-3 cursor-pointer
					first:rounded-t-xl last:rounded-b-xl
					items-center gap-3 select-none
					${selected.name == e.name ? "bg-white/10" : ""}
					hover:bg-white/20 transition-colors
				`} onClick={_=>setSelected(e)}>
					{e.icon}
					<span>{e.label}</span>
				</div>
			))}
		</Container>
	)
}

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
const Tooltip = ({children, accent}) => {
	return (
		<Container className={`
			absolute left-1/2 -translate-x-1/2
			bottom-0 translate-y-[calc(100%+theme(spacing.2))]
			px-2 py-1 z-10 backdrop-blur-md
			opacity-0 invisible
			group-hover:opacity-100 group-hover:visible
			transition-opacity whitespace-nowrap
			${accent ? `!bg-[${accent}]/10 !ring-[${accent}]/20 text-[${accent}]` : ""}
		`}>
			{children}
		</Container>
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
