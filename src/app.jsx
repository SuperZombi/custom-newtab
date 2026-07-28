const defaults = {
	search: "google",
	showSeconds: true,
	background: {
		type: "gradient",
		gradient: gradientPresets[0],
	},
	categories: categoryTemplates
}

const App = () => {
	const [settings, setSettings] = React.useState(defaults)
	const [isLoaded, setIsLoaded] = React.useState(false)
	const [showSettings, setShowSettings] = React.useState(false)
	const [showCategoryModal, setShowCategoryModal] = React.useState(false)
	const [showCategoryManager, setShowCategoryManager] = React.useState(false)
	const [currentCategoryIndex, setCurrentCategoryIndex] = React.useState(null)
	const [currentCategoryData, setCurrentCategoryData] = React.useState({})
	const [categoryModalAction, setCategoryModalAction] = React.useState("new")

	React.useEffect(() => {
		storageApi.get().then((data) => {
			setSettings(data)
			setIsLoaded(true)
		})
	}, [])

	const updateSetting = (key, val) => {
		setSettings((prev) => ({...prev, [key]: val}))
	}
	React.useEffect(() => {
		if (!isLoaded) return;
		const id = setTimeout(() => {
			storageApi.set(settings)
		}, 200)
		return () => clearTimeout(id)
	}, [settings, isLoaded])

	const addCategory = ({title, icon, accent, items}) => {
		updateSetting("categories", [...settings.categories, {
			title, icon, accent, items: items || []
		}])
	}
	const editCategory = ({title, icon, accent, items}) => {
		updateSetting("categories", settings.categories.map((category, index) =>
			index === currentCategoryIndex ? {
				...category, title, icon, accent, items
			} : category)
		)
	}
	const deleteCategory = (ind) => {
		updateSetting("categories", settings.categories.filter(
			(_, index) => index !== ind
		))
	}
	const reorderCategories = (newitem) => {
		updateSetting("categories", newitem)
	}

	return (
		<div className="w-full min-h-dvh p-10 relative overflow-hidden text-white flex flex-col gap-10 text-base">
			<Background background={settings.background}/>
			{isLoaded ? (
				<>
				<ClockWidget showSeconds={settings["showSeconds"]}/>
				<SearchWidget engine={settings["search"]} setEngine={e=>updateSetting("search", e)}/>
				<div className="flex flex-col items-center gap-4">
					{settings["categories"].length > 0 && (
						<div className="flex gap-4 flex-wrap justify-center mx-auto max-w-3xl">
							{settings["categories"].map((item, i)=>(
								<CategoryWidget
									key={i}
									icon={item?.icon}
									title={item?.title}
									accent={item?.accent}
									elements={item?.items}
									editCategory={_=>{
										setCurrentCategoryData(item)
										setShowCategoryModal(true)
										setCategoryModalAction("edit")
										setCurrentCategoryIndex(i)
									}}
								/>
							))}
						</div>
					)}
					<div className="text-sm flex gap-3">
						<Button onClick={_=>{
							setShowCategoryManager(true)
						}}>
							<i className="fa-solid fa-pen"></i>
							<span>Manage</span>
						</Button>
						<Button onClick={_=>{
							setCategoryModalAction("new")
							setCurrentCategoryData({})
							setShowCategoryModal(true)
							setCurrentCategoryIndex(null)
						}}>
							<i className="fa-solid fa-plus"></i>
							<span>Add Category</span>
						</Button>
					</div>
				</div>
				<CategoryManager
					showPopup={showCategoryManager}
					setShowPopup={setShowCategoryManager}
					categories={settings["categories"]}
					editCategory={index=>{
						setCurrentCategoryData(settings["categories"][index])
						setShowCategoryModal(true)
						setCategoryModalAction("edit")
						setCurrentCategoryIndex(index)
					}}
					addCategory={addCategory}
					deleteCategory={deleteCategory}
					reorderCategories={reorderCategories}
				/>
				<CategoryEditor
					showPopup={showCategoryModal}
					setShowPopup={setShowCategoryModal}
					addCategory={addCategory}
					action={categoryModalAction}
					data={currentCategoryData}
					editCategory={editCategory}
					afterClose={_=>{
						setCategoryModalAction("new")
						setCurrentCategoryData({})
						setCurrentCategoryIndex(null)
					}}
				/>
				<Settings
					show={showSettings}
					onClose={_=>setShowSettings(false)}
					settings={settings}
					updateSetting={updateSetting}
				/>
				<div className="
					fixed right-4 bottom-4 p-4 aspect-square rounded-full cursor-pointer
					text-white/50 hover:bg-black/20 hover:text-white
					hover:shadow-lg flex items-center justify-center
					transition-colors
				" onClick={_=>setShowSettings(true)}>
					<i className="fa-solid fa-gear"></i>
				</div>
				</>
			) : null}
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
