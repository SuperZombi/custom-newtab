const CategoryButton = ({className="", accent, children, href}) => {
	const [hover, setHover] = React.useState(false)
	return (
		<a href={href}>
			<Container className={`
				p-3 aspect-square flex items-center justify-center
				cursor-pointer transition-colors hover:bg-white/15
				${className}
			`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={accent ? {
				color: accent,
				background: `color-mix(in srgb, ${accent} ${hover ? 25 : 10}%, transparent)`,
				"--tw-ring-color": `color-mix(in srgb, ${accent} 40%, transparent)`
			} : undefined}>
				{children}
			</Container>
		</a>
	)
}

const CategoryWidget = ({
	icon, title, elements, accent
}) => {
	return (
		<Container className="p-4 flex flex-col gap-3"
			style={accent ? {
				background: `color-mix(in srgb, ${accent} 20%, transparent)`,
				"--tw-ring-color": `color-mix(in srgb, ${accent} 50%, transparent)`
			} : undefined}
		>
			<div className="flex gap-2 items-center"
				style={accent ? {
					color: accent
				} : undefined}
			>
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
				<CategoryButton className="text-white/50 hover:text-white"
					accent={accent}
				>
					<i className="fa-solid fa-plus"></i>
				</CategoryButton>
			</div>
		</Container>
	)
}
