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

function fetchViaJsonp(query) {
  return new Promise((resolve, reject) => {
    const callbackName = `__suggestCb_${Date.now()}`;
    const script = document.createElement('script');

    window[callbackName] = (data) => {
      resolve(data[1] || []);
      cleanup();
    };

    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&callback=${callbackName}&q=${encodeURIComponent(query)}`;
    script.onerror = () => { reject(new Error('JSONP failed')); cleanup(); };

    function cleanup() {
      delete window[callbackName];
      script.remove();
    }
    document.head.appendChild(script);
  });
}
async function getSuggestions(query) {
	if (!query.trim()) return [];
	try{
		const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`);
		if (!response.ok) {
			return fetchViaJsonp(query);
		}
		const data = await response.json();
		return data[1] || [];
	} catch (error) {
		return fetchViaJsonp(query);
	}
}

const SearchWidget = React.memo(({engine, showSuggestions, updateNested}) => {
	const selectedEngine = searchEngines.find(e => e.name === engine) || searchEngines[0]
	const [showSelect, setShowSelect] = React.useState(false)
	const [focused, setFocused] = React.useState(false)
	const [query, setQuery] = React.useState("")
	const [suggestions, setSuggestions] = React.useState([])
	const containerRef = React.useRef(null)
	const onSearch = () => {
		const q = query.trim()
		if (q == ""){ return }
		const link = selectedEngine.url(encodeURIComponent(q))
		window.open(link, "_self")
	}
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
	React.useEffect(_=>{
		if (!showSuggestions) {
			setSuggestions([])
			return
		}
		const timer = setTimeout(_=>{
			getSuggestions(query).then(setSuggestions).catch(console.error)
		}, 500)
		return () => clearTimeout(timer)
	}, [query, showSuggestions])
	return (
		<div ref={containerRef} className="w-full max-w-3xl mx-auto relative">
			<Container className={`
				flex transition-shadow duration-300
				w-full backdrop-blur-sm
				${focused ? "!shadow-[0_0_20px] shadow-blue-500/50" : ""}
			`}>
				<div className="
					flex items-center
					px-3 py-2 border-r border-white/20
					hover:bg-white/10 transition-colors
					rounded-l-xl cursor-pointer
				" onClick={_=>setShowSelect(prev=>!prev)}>
					<img src={selectedEngine.icon} className="h-7 w-7 shrink-0 select-none" draggable={false}/>
				</div>

				<input type="text" placeholder="Search..."
					className="outline-none px-4 py-3 w-full text-base"
					autoComplete="off"
					list={showSuggestions ? "search-suggestions" : undefined}
					onClick={_=>setShowSelect(false)}
					value={query} onInput={e=>setQuery(e.target.value)}
					onKeyDown={e=>{
						if (e.key == "Enter"){
							onSearch()
						}
					}}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
				/>

				<div className="
					flex items-center
					px-3.5 py-3 border-l border-white/20
					bg-blue-500/50 hover:bg-blue-500 transition-colors duration-250
					rounded-r-xl cursor-pointer
				" onClick={onSearch}>
					<i className="fa-solid fa-magnifying-glass"></i>
				</div>
			</Container>
			{showSuggestions && (
				<datalist id="search-suggestions">
					{suggestions.map((s, i) => (
						<option key={i} value={s} />
					))}
				</datalist>
			)}
			<Select
				show={showSelect}
				className="absolute bottom-0
					translate-y-[calc(100%+theme(spacing.2))]
					origin-top-left
				"
				options={searchEngines}
				selected={selectedEngine}
				setSelected={e=>{
					updateNested("search", "engine", e.name)
					setShowSelect(false)
				}}
			/>
		</div>
	)
})
