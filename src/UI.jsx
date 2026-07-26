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

const Tooltip = ({children, accent}) => {
	return (
		<Container className="
			absolute left-1/2 -translate-x-1/2
			bottom-0 translate-y-[calc(100%+theme(spacing.2))]
			px-2 py-1 z-10 backdrop-blur-md
			opacity-0 invisible
			group-hover:opacity-100 group-hover:visible
			transition-opacity whitespace-nowrap
		" style={accent ? {
			color: accent,
			background: `color-mix(in srgb, ${accent} 10%, transparent)`,
			"--tw-ring-color": `color-mix(in srgb, ${accent} 30%, transparent)`
		} : undefined}
		>
			{children}
		</Container>
	)
}
