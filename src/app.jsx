const defaults = {
	search: "google"
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
		<div className="w-full min-h-dvh p-8 relative overflow-hidden text-white"
			style={{
				background: "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.14), transparent 45%), #0a0a12",
			}}
		>
			<SearchWidget engine={settings["search"]} setEngine={e=>updateSetting("search", e)}/>
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)

const storageApi = {
	get: async () => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.get(["settings"], (result) => {
						resolve(result.settings || defaults)
					})
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				const result = await browser.storage.sync.get("settings")
				return result.settings || defaults;
			}
			const saved = window.localStorage.getItem("settings")
			return saved ? JSON.parse(saved) : defaults;
		} catch (e) {
			console.error("Storage read error:", e);
			return defaults;
		}
	},
	set: async (value) => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.set({ settings: value }, resolve)
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				await browser.storage.sync.set({ settings: value })
				return;
			}
			window.localStorage.setItem("settings", JSON.stringify(value))
		} catch (e) {
			console.error("Storage write error:", e)
		}
	}
}
