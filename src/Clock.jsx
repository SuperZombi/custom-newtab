const ClockWidget = React.memo(({
	showSeconds=true,
	showDate = true,
	timeFormat = "24",
	showAmPm = true,
}) => {
	const [now, setNow] = React.useState(new Date())

	React.useEffect(() => {
		const tick = () => setNow(new Date())
		tick()

		if (showSeconds) {
			const id = setInterval(tick, 1000)
			return () => clearInterval(id)
		}

		let intervalId
		const msToNextMinute = (60 - new Date().getSeconds()) * 1000
		const timeoutId = setTimeout(() => {
			tick()
			intervalId = setInterval(tick, 60 * 1000)
		}, msToNextMinute)

		return () => {
			clearTimeout(timeoutId)
			clearInterval(intervalId)
		}
	}, [showSeconds])

	const pad = (n) => String(n).padStart(2, "0")

	const date = React.useMemo(() => {
		if (!showDate) return ""
		return now.toLocaleDateString(undefined, {
			weekday: "long",
			day: "numeric",
			month: "long",
		})
	}, [now.toDateString(), showDate])

	return (
		<div className="select-none flex flex-col gap-3 items-center">
			<div className={`${showSeconds ? "text-6xl" : "text-7xl"} relative flex gap-1 items-center justify-center`}>
				<span className="text-shadow-sm">{
					timeFormat == "12" ? (now.getHours() % 12 || 12) : pad(now.getHours())
				}</span>
				<span className="text-white/70 text-5xl text-shadow-xs">:</span>
				<span className="text-shadow-sm">{pad(now.getMinutes())}</span>
				{showSeconds && (
					<>
						<span className="text-white/70 text-5xl text-shadow-xs">:</span>
						<span className="text-shadow-sm">{pad(now.getSeconds())}</span>
					</>
				)}
				{(timeFormat == "12" && showAmPm) && (
					<span className="text-xl text-white/70 self-end text-shadow-xs absolute -right-1 translate-x-full">
						{now.getHours() >= 12 ? "PM" : "AM"}
					</span>
				)}
			</div>
			{showDate && (
				<div className="text-lg text-white/80 capitalize text-shadow-sm">
					{date}
				</div>
			)}
		</div>
	)
})
