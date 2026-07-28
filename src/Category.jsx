const CategoryWidget = ({
	icon, title, elements, accent, editCategory
}) => {
	return (
		<Container className="p-4 flex flex-col gap-3"
			style={accent ? {
				background: `color-mix(in srgb, ${accent} 20%, transparent)`,
				"--tw-ring-color": `color-mix(in srgb, ${accent} 50%, transparent)`
			} : undefined}
		>
			{(title || icon) && (
				<div className="flex gap-2 items-center"
					style={accent ? {
						color: accent
					} : undefined}
				>
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
					onClick={editCategory}
				>
					<i className="fa-solid fa-plus"></i>
				</Button>
			</div>
		</Container>
	)
}
