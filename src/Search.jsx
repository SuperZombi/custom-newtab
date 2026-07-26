const SearchWidget = () => {
	const engines = [
		{
			name: "google", label: "Google",
			url: (q) => `https://www.google.com/search?q=${q}`,
			icon: <i className="fa-brands fa-google"></i>
		},
		{
			name: "bing", label: "Bing",
			url: (q) => `https://www.bing.com/search?q=${q}`,
			icon: <i className="fa-brands fa-edge"></i>
		},
		{
			name: "duckduckgo", label: "DuckDuckGo",
			url: (q) => `https://duckduckgo.com/?q=${q}`,
			icon: <i className="fa-solid fa-duck"></i>
		},
		{
			name: "yandex", label: "Яндекс",
			url: (q) => `https://yandex.ru/search/?text=${q}`,
			icon: <i className="fa-brands fa-yandex"></i>
		}
	]
	const [selectedEngine, setSelectedEngine] = React.useState(engines[0])
	const [showSelect, setShowSelect] = React.useState(false)
	const [focused, setFocused] = React.useState(false)
	const [query, setQuery] = React.useState("")
	const onSearch = () => {
		const q = query.trim()
		if (q == ""){ return }
		const link = selectedEngine.url(encodeURIComponent(q))
		window.open(link, "_self")
	}

	return (
		<Container className={`
			flex items-center relative
			transition-shadow duration-300
			${focused ? "!shadow-[0_0_20px] shadow-blue-500/50" : ""}
		`}>
			<div className="
				px-3.5 py-3 border-r border-white/20
				hover:bg-white/10 transition-colors
				rounded-l-xl cursor-pointer
			" onClick={_=>setShowSelect(prev=>!prev)}>
				{selectedEngine.icon}
			</div>

			<input type="text" placeholder="Search..."
				className="outline-none px-4 py-3 w-full"
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
				options={engines}
				selected={selectedEngine}
				setSelected={e=>{setSelectedEngine(e);setShowSelect(false);}}
			/>
		</Container>
	)
}
