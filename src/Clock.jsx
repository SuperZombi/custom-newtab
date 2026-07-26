const ClockWidget = ({
	showSeconds=true,
}) => {
	const [now, setNow] = React.useState(new Date())
	React.useEffect(() => {
		const tick = () => setNow(new Date())
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])
	const pad = (n) => String(n).padStart(2, "0")
	const hours = pad(now.getHours())
	const minutes = pad(now.getMinutes())
	const seconds = pad(now.getSeconds())

	return (
		<div className="select-none">
			<div className={`${showSeconds ? "text-6xl" : "text-7xl"} flex gap-1 items-center justify-center`}>
				<span className="">{hours}</span>
				<span className="text-white/50 text-5xl">:</span>
				<span className="">{minutes}</span>
				{showSeconds && (
					<>
						<span className="text-white/50 text-5xl">:</span>
						<span className="">{seconds}</span>
					</>
				)}
			</div>
		</div>
	)
}
