const searchEngines = [
	{
		name: "google", label: "Google",
		url: (q) => `https://www.google.com/search?q=${q}`,
		icon: "images/google.svg"
	},
	{
		name: "bing", label: "Bing",
		url: (q) => `https://www.bing.com/search?q=${q}`,
		icon: "images/bing.svg"
	},
	{
		name: "duckduckgo", label: "DuckDuckGo",
		url: (q) => `https://duckduckgo.com/?q=${q}`,
		icon: "images/duckduckgo.svg"
	},
	{
		name: "yandex", label: "Yandex",
		url: (q) => `https://yandex.ru/search/?text=${q}`,
		icon: "images/yandex.svg"
	}
]

const SUGGEST_ENDPOINT = 'https://suggestqueries.google.com/complete/search';
function buildSuggestUrl(query, callback=null) {
	const url = new URL(SUGGEST_ENDPOINT)
	url.searchParams.set('q', query)
	url.searchParams.set('client', 'firefox')
	if (callback) {
		url.searchParams.set('callback', callback)
	}
	return url.toString()
}
function fetchViaJsonp(query) {
	return new Promise((resolve, reject) => {
		const callbackName = `__suggestCb_${Date.now()}`;
		const script = document.createElement('script');
		window[callbackName] = (data) => {
			resolve(data[1] || []);
			cleanup();
		};
		script.src = buildSuggestUrl(query, callbackName);
		script.onerror = () => {
			reject(new Error('JSONP failed'));
			cleanup();
		};
		function cleanup() {
			delete window[callbackName];
			script.remove();
		}
		document.head.appendChild(script);
	})
}
async function fetchViaCors(query) {
	const response = await fetch(buildSuggestUrl(query))
	if (!response.ok) throw new Error('Bad response')
	const data = await response.json()
	return data[1] || [];
}
async function getSuggestions(query) {
	if (!query.trim()) return [];
	try {
		return await fetchViaCors(query)
	} catch {
		return fetchViaJsonp(query).catch(() => [])
	}
}

const SearchWidget = React.memo(({engine, showSuggestions, updateNested}) => {
	const selectedEngine = searchEngines.find(e => e.name === engine) || searchEngines[0]
	const [showSelect, setShowSelect] = React.useState(false)
	const [query, setQuery] = React.useState("")
	const [suggestions, setSuggestions] = React.useState([])
	const containerRef = React.useRef(null)
	
	const onSearch = React.useCallback((custom_query="") => {
		const q = custom_query || query.trim()
		if (q == ""){ return }
		const link = selectedEngine.url(encodeURIComponent(q))
		window.open(link, "_self")
	}, [query, selectedEngine])

	React.useEffect(() => {
		if (!showSelect) return
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setShowSelect(false)
			}
		}
		document.addEventListener("click", handleClickOutside)
		return () => document.removeEventListener("click", handleClickOutside)
	}, [showSelect])

	const setSelectedEngine = React.useCallback((engine) => {
		updateNested("search", "engine", engine.name)
		setShowSelect(false)
	}, [updateNested])

	React.useEffect(_=>{
		if (!showSuggestions) {
			setSuggestions([])
			return
		}
		const timer = setTimeout(_=>{
			getSuggestions(query).then(setSuggestions).catch(console.error)
		}, 250)
		return () => clearTimeout(timer)
	}, [query, showSuggestions])

	return (
		<div ref={containerRef} className="w-full max-w-3xl mx-auto relative">
			<Container className={`
				flex transition-shadow duration-300
				w-full backdrop-blur-sm
				focus-within:shadow-[0_0_20px] focus-within:shadow-blue-500/50
			`}>
				<div className="
					flex items-center
					px-3 py-2 border-r border-white/20
					hover:bg-white/10 transition-colors
					rounded-l-xl cursor-pointer
				" onClick={_=>setShowSelect(prev=>!prev)}>
					<img src={selectedEngine.icon} className="h-7 w-7 shrink-0 select-none" draggable={false}/>
				</div>

				<input type="search" placeholder="Search..."
					className="outline-none px-4 py-3 w-full text-base"
					autoComplete="off"
					onClick={_=>setShowSelect(false)}
					value={query} onInput={e=>setQuery(e.target.value)}
					onKeyDown={e=>{
						if (e.key == "Enter"){
							onSearch()
						}
					}}
				/>

				<div className="
					flex items-center
					px-3.5 py-3 border-l border-white/20
					bg-blue-500/50 hover:bg-blue-500 active:bg-blue-500
					transition-colors duration-250
					rounded-r-xl cursor-pointer
				" onClick={onSearch}>
					<i className="fa-solid fa-magnifying-glass"></i>
				</div>
			</Container>
			{showSuggestions && (
				<Suggestions suggestions={suggestions} onSearch={onSearch} />
			)}
			<Select
				show={showSelect}
				className="absolute bottom-0
					translate-y-[calc(100%+theme(spacing.2))]
					origin-top-left
				"
				options={searchEngines}
				selected={selectedEngine}
				setSelected={setSelectedEngine}
			/>
		</div>
	)
})
const Suggestions = React.memo(({suggestions, onSearch})=>{
	return (
		<Container className={`grid grid-cols-[auto_1fr]
			transition-all backdrop-blur-sm z-10 will-change-transform
			absolute bottom-0 left-0 right-0 text-sm origin-top
			translate-y-[calc(100%+theme(spacing.2))]
			${suggestions.length > 0 ?
				"visible opacity-100 scale-100 scale-y-100" :
				"invisible opacity-0 scale-95 scale-y-0"
			}
		`}>
			{suggestions.map((s, i) => (
				<div key={i} className={`
					grid grid-cols-subgrid col-span-2
					py-2 px-3 cursor-pointer
					first:rounded-t-xl last:rounded-b-xl
					items-center gap-3 select-none
					hover:bg-white/20 transition-colors
					focus:bg-white/20 focus:outline-none
					active:bg-white/20
				`}
					onClick={_=>onSearch(s)}
					onKeyDown={e=>{
						if (e.key == "Enter"){
							onSearch(s)
						}
					}}
					tabIndex={0}
				>
					<span>{s}</span>
				</div>
			))}
		</Container>
	)
})
