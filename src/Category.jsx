const CategoryWidget = React.memo(({
	icon, title, elements, accent, index, onEdit
}) => {
	return (
		<Container className="p-4 flex flex-col gap-3"
			style={accentStyle(accent, { bg: 20, ring: 50 })}
		>
			{(title || icon) && (
				<div className="flex gap-2 items-center">
					{icon && (<i className={icon}></i>)}
					{title && (<span>{title}</span>)}
				</div>
			)}
			<div className="grid grid-cols-4 gap-2">
				{elements.map(e=>(
					<div key={e.url} className="relative group">
						<CategoryButton href={e.url} accent={accent}>
							<img src={e.icon || getIcon(e.url)} draggable={false} className="h-6 w-6 select-none"/>
						</CategoryButton>
						{e.label && (<Tooltip accent={accent}>{e.label}</Tooltip>)}
					</div>
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
