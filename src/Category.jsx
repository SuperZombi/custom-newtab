const CategoryButton = ({accent, children, href}) => {
	return (
		<a href={href} className="outline-none group">
			<Button className="aspect-square" accent={accent}>{children}</Button>
		</a>
	)
}
const CategoryItem = ({e, accent}) => {
	const anchorRef = React.useRef(null)
	return (
		<div className="relative">
			<div ref={anchorRef}>
				<CategoryButton href={e.url} accent={accent}>
					<img src={e.icon || getIcon(e.url)} draggable={false} className="h-6 w-6 select-none"/>
				</CategoryButton>
			</div>
			{e.label && (<Tooltip accent={accent} anchorRef={anchorRef}>{e.label}</Tooltip>)}
		</div>
	)
}
const CategoryWidget = React.memo(({
	icon, title, elements, accent, index, onEdit
}) => {
	return (
		<Container className="p-4 flex flex-col gap-3 backdrop-blur-sm"
			style={accentStyle(accent, { bg: 20, ring: 50 })}
		>
			{(title || icon) && (
				<div className="flex gap-2 items-center">
					{icon && (<i className={icon}></i>)}
					{title && (<span className="text-shadow-xs">{title}</span>)}
				</div>
			)}
			<div className="grid grid-cols-4 gap-2">
				{elements.map((e,i)=>(
					<CategoryItem key={i} e={e} accent={accent}/>
				))}
				<Button accent={accent} className="aspect-square text-white/50 hover:text-white p-3"
					onClick={_=>onEdit(index)}
				>
					<i className="fa-solid fa-plus"></i>
				</Button>
			</div>
		</Container>
	)
})
