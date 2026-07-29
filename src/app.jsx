const defaults = {
	clocks: {
		enabled: true,
		showSeconds: true,
		showDate: true,
		hour12: false,
		showAmPm: true,
	},
	weather: {
		enabled: false,
	},
	search: "google",
	background: {
		type: "gradient",
		gradient: gradientPresets[0],
	},
	categories: categoryTemplates
}

const App = () => {
	const [settings, setSettings] = React.useState(defaults)
	const [isLoaded, setIsLoaded] = React.useState(false)
	const isFirstLoad = React.useRef(true)
	
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

	const updateSetting = React.useCallback((key, val) => {
		setSettings(prev => ({...prev, [key]: val}))
	}, [])
	React.useEffect(() => {
		if (!isLoaded) return;
		if (isFirstLoad.current) {
			isFirstLoad.current = false;
			return;
		}
		const id = setTimeout(() => {
			storageApi.set(settings)
		}, 200)
		return () => clearTimeout(id)
	}, [settings, isLoaded])

	const addCategory = React.useCallback(({title, icon, accent, items}) => {
		setSettings(prev => ({...prev, categories: [...prev.categories, {title, icon, accent, items: items || []}]}))
	}, [])
	const editCategory = React.useCallback((patch) => {
		setSettings(prev => ({...prev, categories: prev.categories.map((category, index) =>
			index === currentCategoryIndex ? {...category, ...patch} : category)
		}))
	}, [currentCategoryIndex])
	const deleteCategory = React.useCallback((ind) => {
		setSettings(prev => ({...prev, categories: prev.categories.filter((_, index) => index !== ind)}))
	}, [])
	const reorderCategories = React.useCallback((newitem) => {
		setSettings(prev => ({...prev, categories: newitem}))
	}, [])

	const openCategoryEditor = React.useCallback((index) => {
		setCurrentCategoryData(settings.categories[index])
		setShowCategoryModal(true)
		setCategoryModalAction("edit")
		setCurrentCategoryIndex(index)
	}, [settings?.categories])
	const clearCategoryEditor = React.useCallback(() => {
		setCategoryModalAction("new")
		setCurrentCategoryData({})
		setCurrentCategoryIndex(null)
	}, [])

	return (
		<div className="w-full min-h-dvh p-10 relative overflow-hidden text-white flex flex-col gap-10 text-base">
			<Background background={settings.background}/>
			{isLoaded ? (
				<>
				{settings?.clocks?.enabled && (
					<ClockWidget
						showSeconds={settings?.clocks?.showSeconds}
						showDate={settings?.clocks?.showDate}
						hour12={settings?.clocks?.hour12}
						showAmPm={settings?.clocks?.showAmPm}
					/>
				)}
				{settings?.weather?.enabled && (
					<WeatherWidget/>
				)}
				<SearchWidget engine={settings["search"]} updateSetting={updateSetting}/>
				<Settings settings={settings} updateSetting={updateSetting}/>

				<div className="flex flex-col items-center gap-4">
					{settings["categories"].length > 0 && (
						<div className="flex gap-4 flex-wrap justify-center mx-auto max-w-3xl">
							{settings?.categories?.map((item, i)=>(
								<CategoryWidget
									key={i}
									icon={item?.icon}
									title={item?.title}
									accent={item?.accent}
									elements={item?.items}
									index={i}
									onEdit={openCategoryEditor}
								/>
							))}
						</div>
					)}
					<div className="text-sm flex gap-3">
						<Button className="backdrop-blur-sm" onClick={_=>{
							setShowCategoryManager(true)
						}}>
							<i className="fa-solid fa-pen"></i>
							<span>Manage</span>
						</Button>
						<Button className="backdrop-blur-sm" onClick={_=>{
							clearCategoryEditor()
							setShowCategoryModal(true)
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
					onEdit={openCategoryEditor}
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
					afterClose={clearCategoryEditor}
				/>
				</>
			) : null}
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
