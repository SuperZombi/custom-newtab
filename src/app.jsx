const defaults = {
	search: "google",
	showSeconds: true,
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
			<ClockWidget showSeconds={settings["showSeconds"]}/>
			<SearchWidget engine={settings["search"]} setEngine={e=>updateSetting("search", e)}/>

			<div className="flex gap-4 mx-auto">
				<CategoryWidget
					icon={<i className="fa-solid fa-camera"></i>}
					title={"Search by Image"}
					accent={"#c27aff"}
					elements={[
						{
							icon: <i className="fa-brands fa-google"></i>,
							label: "Google",
							url: "https://images.google.com/?olud"
						},
						{
							icon: <i className="fa-brands fa-yandex"></i>,
							label: "Yandex",
							url: "https://yandex.ru/images/search?rpt=imageview"
						},
					]}
				/>
				<CategoryWidget
					icon={<i className="fa-solid fa-sparkles"></i>}
					title={"Ask AI"}
					accent={"#53eafd"}
					elements={[
						{
							icon: <i className="fa-brands fa-openai"></i>,
							label: "Chat GPT",
							url: "https://chatgpt.com/"
						},
						{
							icon: <i className="fa-solid fa-sparkle"></i>,
							label: "Gemini",
							url: "https://gemini.google.com/"
						},
						{
							icon: <i className="fa-brands fa-claude"></i>,
							label: "Claude",
							url: "https://claude.ai/"
						},
					]}
				/>
			</div>
			
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
