const defaults = {
	search: "google",
	showSeconds: true,
	widgets: [
		"clock",
		"search",
		"categories",
	],
	categories: [
		{
			title: "Search by Image",
			icon: "fa-solid fa-camera",
			accent: "#c27aff",
			items: [
				{
					label: "Google",
					url: "https://images.google.com/?olud"
				},
				{
					label: "Yandex",
					url: "https://yandex.ru/images/search?rpt=imageview"
				},
			]
		},
		{
			title: "Ask AI",
			icon: "fa-solid fa-sparkles",
			accent: "#53eafd",
			items: [
				{
					label: "Chat GPT",
					url: "https://chatgpt.com/"
				},
				{
					label: "Gemini",
					url: "https://gemini.google.com/"
				},
				{
					label: "Claude",
					url: "https://claude.ai/"
				},
			]
		}
	]
}

const App = () => {
	const [settings, setSettings] = React.useState(defaults)
	const [isLoaded, setIsLoaded] = React.useState(false)

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
								<div className="flex gap-4 flex-wrap justify-center mx-auto max-w-3xl">
									{settings["categories"].map((item, i)=>(
										<CategoryWidget
											key={i}
											icon={item?.icon}
											title={item?.title}
											accent={item?.accent}
											elements={item?.items}
										/>
									))}
								</div>
								<div className="text-sm">
									<CategoryButton className="
										whitespace-nowrap flex items-center gap-1 select-none
									" onClick={console.log}>
										<i className="fa-solid fa-plus"></i>
										<span>Add Category</span>
									</CategoryButton>
								</div>
							</div>
						)
					}
				})}
				</>
			) : null}
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
