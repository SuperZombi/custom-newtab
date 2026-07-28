const ClockWidget = ({
	showSeconds=true,
	showDate = true,
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

	const date = now.toLocaleDateString(undefined, {
		weekday: "long",
		day: "numeric",
		month: "long",
	})

	return (
		<div className="select-none flex flex-col gap-3 items-center">
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
			{showDate && (
				<div className="text-lg text-white/70 capitalize">
					{date}
				</div>
			)}
		</div>
	)
}
