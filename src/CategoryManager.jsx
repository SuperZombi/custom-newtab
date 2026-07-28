const CategoryEditor = ({
	action, data, showPopup, setShowPopup, addCategory, editCategory, afterClose
}) => {
	const [currentName, setCurrentName] = React.useState("")
	const [currentIcon, setCurrentIcon] = React.useState("")
	const [currentAccent, setCurrentAccent] = React.useState("")
	const [currentLinks, setCurrentLinks] = React.useState([])
	React.useEffect(_=>{
		setCurrentName(data?.title || "")
		setCurrentIcon(data?.icon || "")
		setCurrentAccent(data?.accent || "")
		setCurrentLinks(data?.items || [])
	}, [data])
	const applyForm = () => {
		const actionFunction = action == "edit" ? editCategory : addCategory;
		actionFunction({
			title: currentName.trim(),
			icon: currentIcon.trim(),
			accent: currentAccent.trim(),
			items: currentLinks.filter(
				item => item.url.trim() !== ""
			)
		})
		setShowPopup(false)
	}
	const onKeyDownInputs = (e) => {
		if (e.key == "Enter") {
			applyForm()
		}
	}
	const updateLink = (index, key, value) => {
		setCurrentLinks(prev =>
			prev.map((item, i) =>
				i === index
					? { ...item, [key]: value }
					: item
			)
		)
	}
	const addLink = () => {
		setCurrentLinks(prev =>
			[...prev, {label: "", url: ""}]
		)
	}
	const deleteLink = (ind) => {
		setCurrentLinks(prev =>
			prev.filter((_, index) => index !== ind)
		)
	}
	const onDragEnd = (result)=>{
		if(!result.destination) { return }
		const itemsnew = reorder(
			currentLinks, 
			result.source.index, 
			result.destination.index
		)
		setCurrentLinks(itemsnew)
	}
	return (
		<Modal
			title={action == "edit" ? "Edit Category" : "Add Category"}
			open={showPopup}
			onClose={_=>{setShowPopup(false)}}
			afterClose={afterClose}
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
				iconPicker={true}
			/>
			<TextInput
				label={"Accent color"}
				placeholder={"Optional"}
				value={currentAccent}
				onChange={setCurrentAccent}
				onKeyDown={onKeyDownInputs}
				colorPicker={true}
			/>
			{currentLinks.length > 0 && (
				<ReactBeautifulDnd.DragDropContext
					onDragEnd={onDragEnd}
				>
					<ReactBeautifulDnd.Droppable droppableId="droppable"
						renderClone={(provided, snapshot, rubric) => (
							<div className="text-white grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
							>
								<div><i className="fa-solid fa-grip-vertical"></i></div>
								<TextInput placeholder={"Label"} value={currentLinks[rubric.source.index].label}/>
								<TextInput placeholder={"Link"} value={currentLinks[rubric.source.index].url}/>
								<Button className="text-xs aspect-square" accent="red">
									<i className="fa-solid fa-trash"></i>
								</Button>
							</div>
						)}
					>
					{(provided, snapshot) => (
						<div className="flex flex-col gap-2"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
						{currentLinks.map((item, index)=>(
							<ReactBeautifulDnd.Draggable
								key={index}
								draggableId={String(index)}
								index={index}
							>
							{(provided, snapshot) => (
								<div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
									ref={provided.innerRef}
									{...provided.draggableProps}
								>
									<div {...provided.dragHandleProps}>
										<i className="fa-solid fa-grip-vertical"></i>
									</div>
									<TextInput placeholder={"Label"} value={item.label}
										onChange={v => updateLink(index, "label", v)}
										onKeyDown={onKeyDownInputs}
									/>
									<TextInput placeholder={"Link"} value={item.url}
										onChange={v => updateLink(index, "url", v)}
										onKeyDown={onKeyDownInputs}
									/>
									<Button className="text-xs aspect-square" accent="red"
										onClick={_=>deleteLink(index)}
									>
										<i className="fa-solid fa-trash"></i>
									</Button>
								</div>
							)}
							</ReactBeautifulDnd.Draggable>
						))}
						{provided.placeholder}
						</div>
					)}
					</ReactBeautifulDnd.Droppable>
				</ReactBeautifulDnd.DragDropContext>
			)}
			<Button onClick={addLink}>Add link</Button>
			<Button onClick={applyForm}>OK</Button>
		</Modal>
	)
}

const CategoryManager = ({
	showPopup, setShowPopup, categories, editCategory, deleteCategory, addCategory, reorderCategories
}) => {
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
			{categories.length > 0 && (
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
			)}
			<h2 className="flex gap-2 items-center justify-center text-lg">
				<i className="fa-solid fa-database"></i>
				<span>Templates</span>
			</h2>
			<div className="flex gap-2 flex-wrap">
				{categoryTemplates.map((item, i)=>(
					<Button key={i} className="py-1 text-sm" accent={item.accent} onClick={_=>{
						addCategory(item)
					}}>
						<i className={`text-xs ${item.icon}`}></i>
						<span>{item.title}</span>
					</Button>
				))}
			</div>
		</Modal>
	)
}
