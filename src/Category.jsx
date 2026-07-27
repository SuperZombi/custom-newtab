const CategoryButton = ({accent, children, href}) => {
	return (
		<a href={href}>
			<Button className="aspect-square" accent={accent}>{children}</Button>
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
				<Button accent={accent} className="aspect-square text-white/50 hover:text-white p-3">
					<i className="fa-solid fa-plus"></i>
				</Button>
			</div>
		</Container>
	)
}

const CategoryEditor = ({
	action, data, showPopup, setShowPopup, addCategory, editCategory
}) => {
	const [currentName, setCurrentName] = React.useState("")
	const [currentIcon, setCurrentIcon] = React.useState("")
	const [currentAccent, setCurrentAccent] = React.useState("")
	React.useEffect(_=>{
		setCurrentName(data?.title || "")
		setCurrentIcon(data?.icon || "")
		setCurrentAccent(data?.accent || "")
	}, [data])
	const applyForm = () => {
		const actionFunction = action == "edit" ? editCategory : addCategory;
		actionFunction({
			title: currentName.trim(),
			icon: currentIcon.trim(),
			accent: currentAccent.trim(),
		})
		setShowPopup(false)
	}
	const onKeyDownInputs = (e) => {
		if (e.keyCode == 13) {
			applyForm()
		}
	}
	return (
		<Modal
			title={action == "edit" ? "Edit Category" : "Add Category"}
			open={showPopup}
			onClose={_=>{setShowPopup(false)}}
		>
			<TextInput
				label={"Category name"}
				placeholder={"Optional"}
				value={currentName}
				onChange={setCurrentName}
				onKeyDown={onKeyDownInputs}
			/>
			<TextInput
				label={"Category icon"}
				placeholder={"Optional"}
				value={currentIcon}
				onChange={setCurrentIcon}
				onKeyDown={onKeyDownInputs}
			/>
			<TextInput
				label={"Accent color"}
				placeholder={"Optional"}
				value={currentAccent}
				onChange={setCurrentAccent}
				onKeyDown={onKeyDownInputs}
			/>
			<Button onClick={applyForm}>OK</Button>
			{/* {action == "edit" && (
				<Button onClick={_=>{
					deleteCategory()
					setShowPopup(false)
				}}>Delete</Button>
			)} */}
		</Modal>
	)
}

const CategoryManager = ({
	showPopup, setShowPopup, categories, editCategory, deleteCategory, reorderCategories
}) => {
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
		return result
	}
	const onDragEnd = (result)=>{
		if(!result.destination) { return }
		const itemsnew = reorder(
			categories, 
			result.source.index, 
			result.destination.index
		)
		reorderCategories(itemsnew)
	}
	return (
		<Modal
			title="Manager"
			open={showPopup}
			onClose={_=>{setShowPopup(false)}}
		>
			<ReactBeautifulDnd.DragDropContext
				onDragEnd={onDragEnd}
			>
				<ReactBeautifulDnd.Droppable droppableId="droppable"
					renderClone={(provided, snapshot, rubric) => (
						<div
							ref={provided.innerRef}
							{...provided.draggableProps}
							{...provided.dragHandleProps}
						>
						<Container className="text-white grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-2 select-none">
							<div><i className="fa-solid fa-grip-vertical"></i></div>
							<span>{categories[rubric.source.index].title || `Category ${rubric.source.index}`}</span>
							<Button className="text-xs aspect-square">
								<i className="fa-solid fa-pen"></i>
							</Button>
							<Button className="text-xs aspect-square" accent="red">
								<i className="fa-solid fa-trash"></i>
							</Button>
						</Container>
						</div>
					)}
				>
				{(provided, snapshot) => (
					<div className="flex flex-col gap-2"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
					{categories.map((item, index)=>(
						<ReactBeautifulDnd.Draggable
							key={index}
							draggableId={String(index)}
							index={index}
						>
						{(provided, snapshot) => (
							<div
								ref={provided.innerRef}
								{...provided.draggableProps}
							>
							<Container className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-2 select-none">
								<div {...provided.dragHandleProps}>
									<i className="fa-solid fa-grip-vertical"></i>
								</div>
								<span>{item.title || `Category ${index}`}</span>
								<Button className="text-xs aspect-square" onClick={_=>editCategory(index)}>
									<i className="fa-solid fa-pen"></i>
								</Button>
								<Button className="text-xs aspect-square" accent="red"
									onClick={_=>{
										if (confirm(`Delete category?`)){
											deleteCategory(index)
										}
									}}
								>
									<i className="fa-solid fa-trash"></i>
								</Button>
							</Container>
							</div>
						)}
						</ReactBeautifulDnd.Draggable>
					))}
					{provided.placeholder}
					</div>
				)}
				</ReactBeautifulDnd.Droppable>
			</ReactBeautifulDnd.DragDropContext>
		</Modal>
	)
}
