const Container = ({children, className="", ...props}) => {
	return (
		<div className={`ring ring-white/20 rounded-xl bg-white/5 shadow-lg ${className}`} {...props}>
			{children}
		</div>
	)
}

const Button = ({className="", accent, children, forceActive, onClick}) => {
	const [hover, setHover] = React.useState(false)
	const active = hover || forceActive
	return (
		<Container className={`
			p-2 flex items-center justify-center gap-2 select-none whitespace-nowrap
			cursor-pointer transition-colors hover:bg-white/15
			${forceActive ? "bg-white/15" : ""} ${className}
		`}
			onClick={onClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={accent ? {
				color: accent,
				background: `color-mix(in srgb, ${accent} ${active ? 25 : 10}%, transparent)`,
				"--tw-ring-color": `color-mix(in srgb, ${accent} 40%, transparent)`
			} : undefined}
		>
			{children}
		</Container>
	)
}

const Select = ({
	options, selected, setSelected,
	show, className=""
}) => {
	return (
		<Container className={`grid grid-cols-[auto_1fr]
			transition-all backdrop-blur-md z-10
			${show ? "visible scale-100 opacity-100" : "invisible scale-0 opacity-0"}
			${className}
		`}>
			{options.map(e => (
				<div key={e.name} className={`
					grid grid-cols-subgrid col-span-2
					py-2 px-3 cursor-pointer
					first:rounded-t-xl last:rounded-b-xl
					items-center gap-3 select-none
					${selected.name == e.name ? "bg-white/10" : ""}
					hover:bg-white/20 transition-colors
				`} onClick={_=>setSelected(e)}>
					<img className="w-6 h-6 select-none" src={e.icon} draggable={false}/>
					<span>{e.label}</span>
				</div>
			))}
		</Container>
	)
}

const Tooltip = ({children, accent}) => {
	return (
		<Container className="
			absolute left-1/2 -translate-x-1/2
			bottom-0 translate-y-[calc(100%+theme(spacing.2))]
			px-2 py-1 z-10 backdrop-blur-md
			opacity-0 invisible
			group-hover:opacity-100 group-hover:visible
			transition-opacity whitespace-nowrap
			select-none
		" style={accent ? {
			color: accent,
			background: `color-mix(in srgb, ${accent} 10%, transparent)`,
			"--tw-ring-color": `color-mix(in srgb, ${accent} 30%, transparent)`
		} : undefined}
		>
			{children}
		</Container>
	)
}

const Modal = ({ open, title, onClose, afterClose, children, className="" }) => {
	const [rendered, setRendered] = React.useState(open)
	const [visible, setVisible] = React.useState(false)

	React.useEffect(() => {
		let raf1, raf2
		if (open) {
			setRendered(true)
			raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => setVisible(true))
			})
		} else {
			setVisible(false)
			const t = setTimeout(() => {
				setRendered(false)
				afterClose?.()
			}, 200)
			return () => clearTimeout(t)
		}
		return () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
		}
	}, [open, afterClose])

	React.useEffect(() => {
		if (!rendered) return
		const onKey = (e) => { if (e.keyCode == 27) onClose?.() }
		document.addEventListener("keydown", onKey)
		return () => document.removeEventListener("keydown", onKey)
	}, [rendered, onClose])

	if (!rendered) return null

	return (
		<div className={`
				fixed inset-0 z-50 flex items-center justify-center
				transition-colors duration-200
				${visible ? "bg-black/50" : "bg-black/0"}
			`}
			onMouseDown={onClose}
		>
			<Container className={`
					w-full max-w-lg max-h-[85vh] overflow-y-auto
					p-5 flex flex-col gap-4 backdrop-blur-md
					transition-all duration-200 origin-center
					${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}
					${className}
				`}
				onMouseDown={e => e.stopPropagation()}
			>
				<div className="flex items-center justify-center relative">
					<h2 className="text-xl font-medium">{title}</h2>
					<div onClick={onClose} className="
						text-white/50 hover:text-white transition-colors cursor-pointer absolute right-0
					">
						<i className="fa-solid fa-xmark"></i>
					</div>
				</div>
				{children}
			</Container>
		</div>
	)
}
const Sidebar = ({ open, title, onClose, children, className="" }) => {
	const [rendered, setRendered] = React.useState(open)
	const [visible, setVisible] = React.useState(false)

	React.useEffect(() => {
		let raf1, raf2
		if (open) {
			setRendered(true)
			raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => setVisible(true))
			})
		} else {
			setVisible(false)
			const t = setTimeout(() => {setRendered(false)}, 500)
			return () => clearTimeout(t)
		}
		return () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
		}
	}, [open])

	if (!rendered) return null

	return (
		<div className={`
				fixed inset-0 z-50
				transition-colors duration-500
				${visible ? "bg-black/25" : "bg-black/0"}
			`}
			onMouseDown={onClose}
		>
			<div className={`
					ring ring-white/20 bg-white/5 shadow-lg
					absolute top-0 right-0 rounded-l-xl z-20
					w-full max-w-lg h-dvh overflow-y-auto
					p-5 flex flex-col gap-4 backdrop-blur-md
					transition-all duration-500
					${visible ? "translate-x-0" : "translate-x-full"}
					${className}
				`}
				onMouseDown={e => e.stopPropagation()}
			>
				<div className="flex items-center justify-center relative">
					<h2 className="text-xl font-medium">{title}</h2>
					<div onClick={onClose} className="
						text-white/50 hover:text-white transition-colors cursor-pointer absolute right-0
					">
						<i className="fa-solid fa-xmark"></i>
					</div>
				</div>
				{children}
			</div>
		</div>
	)
}

const TextInput = ({ value, onChange, label, onKeyDown, placeholder, colorPicker=false, iconPicker=false }) => {
	return (
		<label className="flex flex-col gap-2 text-sm min-w-0">
			{label && (<span className="text-white/60 select-none">{label}</span>)}
			<div className="flex items-center gap-2">
				{colorPicker && (
					<input
						type="color"
						value={value || "#000000"}
						onInput={e => onChange(e.target.value)}
						className="w-10 h-10 p-1 rounded-lg bg-white/5 ring ring-white/10 cursor-pointer"
					/>
				)}
				{iconPicker && (
					<div className="w-10 h-10 text-lg flex items-center justify-center">
						<i className={value || "fa-regular fa-notdef"}></i>
					</div>
				)}
				<input type="text" value={value} placeholder={placeholder}
					onInput={e => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					className="flex-1 bg-white/5 min-w-0 ring ring-white/10 rounded-lg px-3 py-2 outline-none
						focus:ring-white/30 transition-colors placeholder:text-white/30"
				/>
			</div>
		</label>
	)
}

const Switch = ({ checked, onChange, label, accent, disabled=false, className="" }) => {
	const toggle = () => {
		if (disabled) return
		onChange?.(!checked)
	}
	return (
		<label className={`flex items-center justify-between gap-3 select-none ${disabled ? "opacity-40" : "cursor-pointer"} ${className}`}>
			{label && <span className="text-sm">{label}</span>}
			<div
				onClick={toggle}
				className={`
					relative w-10 h-5 shrink-0 rounded-full
					transition-colors duration-200 ease-out
					${checked ? "bg-blue-500" : "bg-white/10"}
				`}
			>
				<span className={`
					absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md
					transition-transform duration-200 ease-out
					${checked ? "translate-x-5" : "translate-x-0"}
				`}/>
			</div>
		</label>
	)
}

const Slider = ({ label, value, min, max, step=1, onChange, unit="" }) => {
	return (
		<label className="flex flex-col gap-1.5 text-sm">
			<div className="flex items-center justify-between text-white/60 select-none">
				<span>{label}</span>
				<span className="text-white/40">{value}{unit}</span>
			</div>
			<input
				type="range" min={min} max={max} step={step} value={value}
				onInput={e => onChange(Number(e.target.value))}
				className="w-full accent-white/80 h-1.5 cursor-pointer"
			/>
		</label>
	)
}
