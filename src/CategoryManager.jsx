const CategoryEditor = React.memo(({
	categoryIndex, action, data, showPopup, setShowPopup, addCategory, deleteCategory, editCategory, afterClose
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
	const onDeleteCat = () => {
		if (confirm(`Delete category?`)){
			deleteCategory(categoryIndex)
			setShowPopup(false)
		}
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
	const updateIcon = (value) => {
		const matches = [
			...value
				.replace(/\/\*[\s\S]*?\*\//g, "")
				.matchAll(/<i\b[^>]*class\s*=\s*["']([^"']+)["'][^>]*><\/i>/gis)
		]
		const icon = matches.length
			? matches[matches.length - 1][1].trim()
			: value;
		setCurrentIcon(icon)
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
				onChange={updateIcon}
				onKeyDown={onKeyDownInputs}
				iconPicker={true}
			>
				<Button className="p-2.5 aspect-square" href="https://fontawesome.com/search">
					<i className="fa-solid fa-arrow-up-right-from-square"></i>
				</Button>
			</TextInput>
			<TextInput
				label={"Accent color"}
				placeholder={"Optional"}
				value={currentAccent}
				onChange={setCurrentAccent}
				onKeyDown={onKeyDownInputs}
				colorPicker={true}
			/>
			<DraggableList
				items={currentLinks}
				onReorder={setCurrentLinks}
				renderItem={(item, index, { dragHandleProps, isClone }) => (
					<div className={`grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center ${isClone ? "text-white" : ""}`}>
						<div {...(dragHandleProps || {})}>
							<i className="fa-solid fa-grip-vertical"></i>
						</div>
						<TextInput placeholder={"Label"} value={item.label}
							{...(!isClone && {
								onChange: v => updateLink(index, "label", v),
								onKeyDown: onKeyDownInputs,
							})}
						/>
						<TextInput placeholder={"Link"} value={item.url}
							{...(!isClone && {
								onChange: v => updateLink(index, "url", v),
								onKeyDown: onKeyDownInputs,
							})}
						/>
						<Button className="text-xs aspect-square" accent="red"
							{...(!isClone && { onClick: _=>deleteLink(index) })}
						>
							<i className="fa-solid fa-trash"></i>
						</Button>
					</div>
				)}
			/>
			<Button 
				className="text-sm opacity-70 hover:opacity-100"
				onClick={addLink}
			>
				<i className="fa-solid fa-plus"></i>
				<span>Add link</span>
			</Button>
			<div className="flex items-center justify-between gap-4">
				{action == "edit" && (
					<Button accent="red" onClick={onDeleteCat}>
						<i className="fa-solid fa-trash"></i>
						<span>Delete category</span>
					</Button>
				)}
				<Button className={
					`w-full ${action == "edit" ? "max-w-48" : ""}`
				} onClick={applyForm}>OK</Button>
			</div>
		</Modal>
	)
})

const CategoryManager = React.memo(({
	showPopup, setShowPopup, categories, onEdit, deleteCategory, addCategory, reorderCategories
}) => {
	return (
		<Modal
			title="Manager"
			open={showPopup}
			onClose={_=>{setShowPopup(false)}}
		>
			<DraggableList
				items={categories}
				onReorder={reorderCategories}
				renderItem={(item, index, { dragHandleProps, isClone }) => (
					<Container className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 p-2 select-none ${isClone ? "text-white" : ""}`}>
						<div {...(dragHandleProps || {})}>
							<i className="fa-solid fa-grip-vertical"></i>
						</div>
						<span>{item.title || `Category ${index}`}</span>
						<Button className="text-xs aspect-square" {...(!isClone && { onClick: _=>onEdit(index) })}>
							<i className="fa-solid fa-pen"></i>
						</Button>
						<Button className="text-xs aspect-square" accent="red"
							{...(!isClone && {
								onClick: _=>{
									if (confirm(`Delete category?`)){
										deleteCategory(index)
									}
								},
							})}
						>
							<i className="fa-solid fa-trash"></i>
						</Button>
					</Container>
				)}
			/>
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
})
