const CategoryButton = ({accent, children, href}) => {
	return (
		<a href={href}>
			<Button className="aspect-square" accent={accent}>{children}</Button>
		</a>
	)
}

const CategoryWidget = ({
	icon, title, elements, accent, editCategory
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
				<Button accent={accent} className="aspect-square text-white/50 hover:text-white p-3"
					onClick={editCategory}
				>
					<i className="fa-solid fa-plus"></i>
				</Button>
			</div>
		</Container>
	)
}

const CategoryEditor = ({
	action, data, showPopup, setShowPopup, addCategory, editCategory, deleteCategory
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
			{action == "edit" && (
				<Button onClick={_=>{
					deleteCategory()
					setShowPopup(false)
				}}>Delete</Button>
			)}
		</Modal>
	)
}
