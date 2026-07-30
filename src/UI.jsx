const Container = ({children, className="", href, target="_blank", ...props}) => {
	const Component = href ? "a" : "div";
	return (
		<Component href={href} target={href ? target : undefined} className={
			`ring ring-white/20 rounded-xl bg-white/5 shadow-lg outline-none ${className}`
		} {...props}>
			{children}
		</Component>
	)
}

const Button = ({className="", accent, children, forceActive, onClick, href, target="_blank", ...props}) => {
	return (
		<Container className={`
			p-2 flex items-center justify-center gap-2 select-none whitespace-nowrap cursor-pointer transition-colors
			${accent
				? "hover:![background:var(--btn-accent-hover)] focus:![background:var(--btn-accent-hover)]"
				: "hover:bg-white/15 focus:bg-white/15"}
			${forceActive ? "bg-white/15" : ""} ${className}
		`}
			href={href} target={target}
			onClick={onClick}
			style={accentStyle(accent, { bg: forceActive ? 25 : 10, ring: 40, hoverBg: 25 })}
			{...props}
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
			transition-all backdrop-blur-sm z-10 will-change-transform
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

const Tooltip = ({children, accent, anchorRef}) => {
	const [coords, setCoords] = React.useState(null)
	const [mounted, setMounted] = React.useState(false)
	const [visible, setVisible] = React.useState(false)

	React.useEffect(() => {
		const el = anchorRef.current
		if (!el) return
		let raf1, raf2
		const onEnter = () => {
			const rect = el.getBoundingClientRect()
			setCoords({
				left: rect.left + rect.width / 2,
				top: rect.bottom + 8,
			})
			setMounted(true)
			raf1 = requestAnimationFrame(() => {
				raf2 = requestAnimationFrame(() => setVisible(true))
			})
		}
		const onLeave = () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
			setVisible(false)
		}
		el.addEventListener("mouseenter", onEnter)
		el.addEventListener("mouseleave", onLeave)
		return () => {
			el.removeEventListener("mouseenter", onEnter)
			el.removeEventListener("mouseleave", onLeave)
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
		}
	}, [anchorRef])

	if (!mounted || !coords) return null

	return ReactDOM.createPortal(
		<div
			className="
				fixed z-50 -translate-x-1/2 whitespace-nowrap select-none pointer-events-none
			"
			style={{ left: coords.left, top: coords.top }}
		>
			<Container className={`px-2 py-1 backdrop-blur-sm
				transition-opacity duration-150 text-shadow-xs
				${visible ? "opacity-100" : "opacity-0"}
			`}
				style={accentStyle(accent, { bg: 10, ring: 30 })}
			>
				{children}
			</Container>
		</div>,
		document.body
	)
}

const ModalHeader = ({title, onClose}) => {
	return (
		<div className="flex items-center justify-center relative">
			<h2 className="text-xl font-medium">{title}</h2>
			<div onClick={onClose} className="
				text-white/50 hover:text-white transition-colors cursor-pointer absolute right-0
			">
				<i className="fa-solid fa-xmark"></i>
			</div>
		</div>
	)
}
const Modal = ({ open, title, onClose, afterClose, children, className="" }) => {
	const { rendered, visible } = usePresence(open, {duration: 200, afterClose: afterClose})
	useEscape(onClose, rendered)
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
					transition-all duration-200 origin-center scheme-dark
					will-change-transform
					${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"}
					${className}
				`}
				onMouseDown={e => e.stopPropagation()}
			>
				<ModalHeader title={title} onClose={onClose}/>
				{children}
			</Container>
		</div>
	)
}
const Sidebar = ({ open, title, onClose, children, className="" }) => {
	const { rendered, visible } = usePresence(open, {duration: 500})
	useEscape(onClose, rendered)
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
					transition-all duration-500 scheme-dark
					will-change-transform
					${visible ? "translate-x-0" : "translate-x-full"}
					${className}
				`}
				onMouseDown={e => e.stopPropagation()}
			>
				<ModalHeader title={title} onClose={onClose}/>
				{children}
			</div>
		</div>
	)
}

const DraggableList = ({
	items, onReorder, renderItem, keyExtractor,
	className="flex flex-col gap-2"
}) => {
	const getKey = keyExtractor || ((item, index) => index)
	const onDragEnd = (result) => {
		if (!result.destination) return
		onReorder(reorder(items, result.source.index, result.destination.index))
	}
	if (items.length === 0) return null
	return (
		<ReactBeautifulDnd.DragDropContext onDragEnd={onDragEnd}>
			<ReactBeautifulDnd.Droppable droppableId="droppable"
				renderClone={(provided, snapshot, rubric) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						{renderItem(items[rubric.source.index], rubric.source.index, { isClone: true })}
					</div>
				)}
			>
			{(provided, snapshot) => (
				<div className={className}
					ref={provided.innerRef}
					{...provided.droppableProps}
				>
				{items.map((item, index) => (
					<ReactBeautifulDnd.Draggable
						key={getKey(item, index)}
						draggableId={String(getKey(item, index))}
						index={index}
					>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.draggableProps}
						>
							{renderItem(item, index, { dragHandleProps: provided.dragHandleProps })}
						</div>
					)}
					</ReactBeautifulDnd.Draggable>
				))}
				{provided.placeholder}
				</div>
			)}
			</ReactBeautifulDnd.Droppable>
		</ReactBeautifulDnd.DragDropContext>
	)
}

const usePresence = (open, { duration = 200, delay = 0, afterClose } = {}) => {
	const [rendered, setRendered] = React.useState(open)
	const [visible, setVisible] = React.useState(false)
	React.useEffect(() => {
		let raf1, raf2, timeout, delayTimeout
		if (open) {
			setRendered(true)
			delayTimeout = setTimeout(() => {
				raf1 = requestAnimationFrame(() => {
					raf2 = requestAnimationFrame(() => {
						setVisible(true)
					})
				})
			}, delay)
		} else {
			setVisible(false)
			timeout = setTimeout(() => {
				setRendered(false)
				afterClose?.()
			}, duration)
		}
		return () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
			clearTimeout(timeout)
			clearTimeout(delayTimeout)
		}
	}, [open, duration, delay, afterClose])
	return { rendered, visible }
}
const useEscape = (callback, enabled = true) => {
	React.useEffect(() => {
		if (!enabled) return
		const onKeyDown = (e) => {
			if (e.key === "Escape") {
				callback?.()
			}
		}
		document.addEventListener("keydown", onKeyDown)
		return () => {
			document.removeEventListener("keydown", onKeyDown)
		}
	}, [callback, enabled])
}

const TextInput = ({ value, onChange, label, onKeyDown, placeholder, colorPicker=false, iconPicker=false, children }) => {
	return (
		<div className="flex flex-col gap-2 text-sm min-w-0">
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
				{children}
			</div>
		</div>
	)
}

const Switch = ({ checked, onChange, label, label_className="text-sm", icon, accent, disabled=false, className="" }) => {
	const toggle = () => {
		if (disabled) return
		onChange?.(!checked)
	}
	return (
		<div className={`flex items-center justify-between gap-3 select-none ${className}`}>
			{(icon || label) && (
				<div className={`flex items-center gap-1.5 ${label_className}`}>
					{icon && <i className={icon}></i> }
					{label && <span>{label}</span>}
				</div>
			)}
			<div
				onClick={toggle}
				className={`
					relative w-10 h-5 shrink-0 rounded-full
					transition-colors duration-200 ease-out
					${checked ? "bg-blue-500" : "bg-white/10"}
					${disabled ? "opacity-40" : "cursor-pointer"} 
				`}
			>
				<span className={`
					absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md
					transition-transform duration-200 ease-out
					${checked ? "translate-x-5" : "translate-x-0"}
				`}/>
			</div>
		</div>
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
