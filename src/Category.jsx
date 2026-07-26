const CategoryButton = ({className="", accent, children, href, onClick}) => {
	const [hover, setHover] = React.useState(false)
	return (
		<a href={href}>
			<Container className={`
				p-2 flex items-center justify-center
				cursor-pointer transition-colors hover:bg-white/15
				${className}
			`}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={onClick}
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
	const getIcon = (url) => {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
	}
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
				{icon && (<i className={icon}></i>)}
				{title && (<span>{title}</span>)}
			</div>
			<div className="grid grid-cols-4 gap-2">
				{elements.map(e=>(
					<div key={e.url} className="relative group">
						<CategoryButton className="aspect-square" href={e.url} accent={accent}>
							<img src={e.icon || getIcon(e.url)} draggable={false} className="h-6 w-6 select-none"/>
						</CategoryButton>
						{e.label && (<Tooltip accent={accent}>{e.label}</Tooltip>)}
					</div>
				))}
				<CategoryButton className="aspect-square text-white/50 hover:text-white p-3"
					accent={accent}
				>
					<i className="fa-solid fa-plus"></i>
				</CategoryButton>
			</div>
		</Container>
	)
}
