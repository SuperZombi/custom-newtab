const App = () => {
	return (
		<div className="w-full min-h-dvh p-8 relative overflow-hidden text-white"
			style={{
				background: "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.14), transparent 45%), #0a0a12",
			}}
		>
			<SearchWidget/>
		</div>
	)
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
