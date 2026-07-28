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

const SearchWidget = ({engine, setEngine}) => {
	React.useEffect(_=>{
		const target = searchEngines.find(e=>e.name == engine)
		if (target){setSelectedEngine(target)}
	}, [engine])
	const [selectedEngine, setSelectedEngine] = React.useState(searchEngines[0])
	const [showSelect, setShowSelect] = React.useState(false)
	const [focused, setFocused] = React.useState(false)
	const [query, setQuery] = React.useState("")
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

	const containerRef = React.useRef(null)

	return (
		<div ref={containerRef}>
			<Container className={`
				flex relative
				transition-shadow duration-300
				max-w-3xl mx-auto w-full
				${focused ? "!shadow-[0_0_20px] shadow-blue-500/50" : ""}
			`}>
				<div className="
					flex items-center
					px-3 py-2 border-r border-white/20
					hover:bg-white/10 transition-colors
					rounded-l-xl cursor-pointer
				" onClick={_=>setShowSelect(prev=>!prev)}>
					<img src={selectedEngine.icon} className="h-8 w-8 select-none" draggable={false}/>
				</div>

				<input type="text" placeholder="Search..."
					className="outline-none px-4 py-3 w-full text-base"
					onClick={_=>setShowSelect(false)}
					value={query} onInput={e=>setQuery(e.target.value)}
					onKeyDown={e=>{
						if (e.keyCode == 13){
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

				<Select
					show={showSelect}
					className="absolute bottom-0
						translate-y-[calc(100%+theme(spacing.2))]
						origin-top-left
					"
					options={searchEngines}
					selected={selectedEngine}
					setSelected={e=>{
						setSelectedEngine(e);
						setEngine(e.name)
						setShowSelect(false);
					}}
				/>
			</Container>
		</div>
	)
}
