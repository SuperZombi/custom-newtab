const defaults = {
	clocks: {
		enabled: true,
		showSeconds: true,
		showDate: true,
		timeFormat: "24",
		showAmPm: true,
	},
	weather: {
		enabled: false,
	},
	search: {
		enabled: true,
		engine: "google",
		suggestions: true,
	},
	background: {
		type: "gradient",
		gradient: gradientPresets[0],
	},
	categories: structuredClone(categoryTemplates)
}

const GetExtension = React.memo(()=>{
	const { rendered, visible } = usePresence(true, { duration: 500, delay: 1000 })
	if (!rendered) return null
	const browser = getBrowser()
	const extensionUrl =
		browser === "firefox"
			? "https://addons.mozilla.org/firefox/addon/new-tab-x/"
			: "https://chromewebstore.google.com/detail/flmndcndpcchdfnhdbghcjdohacafioc"

	return (
		<div className={`fixed top-4 left-4 z-10 max-sm:hidden
			transition-opacity duration-500 text-sm
			${visible ? "opacity-50 hover:opacity-100 visible" : "opacity-0 invisible"}
		`}>
			<Button className="px-3 backdrop-blur-sm"
				href={extensionUrl} tabIndex={-1}
			>
				<i className="fa-solid fa-puzzle-piece"></i>
				<span>Get Extension</span>
			</Button>
		</div>
	)
})

const App = () => {
	const [settings, setSettings] = React.useState(defaults)
	const settingsRef = React.useRef(settings)
	React.useEffect(() => { settingsRef.current = settings }, [settings])
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
        setSettings(prev => ({
            ...prev, [key]: typeof val === "function" ? val(prev[key]) : val
        }))
    }, [])
	const updateNested = React.useCallback((root, key, value) => {
        updateSetting(root, (prevRoot) => ({ ...prevRoot, [key]: value }))
    }, [updateSetting])

	React.useEffect(() => {
		if (!isLoaded) return;
		if (isFirstLoad.current) {
			isFirstLoad.current = false;
			return;
		}
		const id = setTimeout(() => {
			storageApi.set(settings)
		}, 250)
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
		setCurrentCategoryData(settingsRef.current.categories[index])
		setShowCategoryModal(true)
		setCategoryModalAction("edit")
		setCurrentCategoryIndex(index)
	}, [])

	const clearCategoryEditor = React.useCallback(() => {
		setCategoryModalAction("new")
		setCurrentCategoryData({})
		setCurrentCategoryIndex(null)
	}, [])

	return (
		<div className="w-full min-h-dvh p-10 relative overflow-hidden text-white flex flex-col gap-10 text-base">
			<Background background={settings.background}/>
			{isLoaded && (
				<>
				{window.IS_WEBSITE && <GetExtension/>}
				{settings?.clocks?.enabled && (
					<ClockWidget
						showSeconds={settings?.clocks?.showSeconds}
						showDate={settings?.clocks?.showDate}
						timeFormat={settings?.clocks?.timeFormat}
						showAmPm={settings?.clocks?.showAmPm}
					/>
				)}
				{settings?.weather?.enabled && (
					<WeatherWidget/>
				)}
				{settings?.search?.enabled && (
					<SearchWidget
						engine={settings?.search?.engine}
						showSuggestions={settings?.search?.suggestions}
						updateNested={updateNested}
					/>
				)}
				<Settings
					clocks={settings?.clocks}
					weather={settings?.weather}
					search={settings?.search}
					background={settings?.background}
					updateNested={updateNested}
				/>

				<div className="flex flex-col items-center gap-4">
					{settings?.categories?.length > 0 && (
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
					<div className="text-xs flex gap-3">
						<Button className="backdrop-blur-sm transition-opacity opacity-60 hover:opacity-100" onClick={_=>{
							setShowCategoryManager(true)
						}}>
							<i className="fa-solid fa-pen"></i>
							<span>Manage</span>
						</Button>
						<Button className="backdrop-blur-sm transition-opacity opacity-60 hover:opacity-100" onClick={_=>{
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
					categories={settings?.categories}
					onEdit={openCategoryEditor}
					addCategory={addCategory}
					deleteCategory={deleteCategory}
					reorderCategories={reorderCategories}
				/>
				<CategoryEditor
					categoryIndex={currentCategoryIndex}
					showPopup={showCategoryModal}
					setShowPopup={setShowCategoryModal}
					addCategory={addCategory}
					deleteCategory={deleteCategory}
					action={categoryModalAction}
					data={currentCategoryData}
					editCategory={editCategory}
					afterClose={clearCategoryEditor}
				/>
				</>
			)}
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
