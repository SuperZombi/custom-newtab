const defaults = {
	search: "google",
	showSeconds: true,
	widgets: [
		"clock",
		"search",
		"categories",
	],
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
		storageApi.set(settings)
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
		<div className="w-full min-h-dvh p-10 relative overflow-hidden text-white flex flex-col gap-10 text-base"
			style={{
				background: "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.14), transparent 45%), #0a0a12",
			}}
		>
			{isLoaded ? (
				<>
				{settings["widgets"].map((widget, index)=>{
					if (widget == "clock"){
						return (
							<ClockWidget key={index} showSeconds={settings["showSeconds"]}/>
						)
					}
					if (widget == "search"){
						return (
							<SearchWidget key={index} engine={settings["search"]} setEngine={e=>updateSetting("search", e)}/>
						)
					}
					if (widget == "categories"){
						return (
							<div className="flex flex-col items-center gap-4" key={index}>
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
						)
					}
				})}
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
				/>
				<div className="
					fixed right-4 bottom-4 p-4 aspect-square rounded-full cursor-pointer
					text-gray-400/50 hover:bg-white/10 hover:text-gray-300
					flex items-center justify-center
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
