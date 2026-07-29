const ClockWidget = React.memo(({
	showSeconds=true,
	showDate = true,
	hour12 = false,
	showAmPm = true,
}) => {
	const [now, setNow] = React.useState(new Date())
	React.useEffect(() => {
		const tick = () => setNow(new Date())
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])
	const pad = (n) => String(n).padStart(2, "0")

	const date = now.toLocaleDateString(undefined, {
		weekday: "long",
		day: "numeric",
		month: "long",
	})

	return (
		<div className="select-none flex flex-col gap-3 items-center">
			<div className={`${showSeconds ? "text-6xl" : "text-7xl"} relative flex gap-1 items-center justify-center`}>
				<span className="text-shadow-sm">{
					hour12 ? (now.getHours() % 12 || 12) : pad(now.getHours())
				}</span>
				<span className="text-white/70 text-5xl text-shadow-xs">:</span>
				<span className="text-shadow-sm">{pad(now.getMinutes())}</span>
				{showSeconds && (
					<>
						<span className="text-white/70 text-5xl text-shadow-xs">:</span>
						<span className="text-shadow-sm">{pad(now.getSeconds())}</span>
					</>
				)}
				{(hour12 && showAmPm) && (
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
