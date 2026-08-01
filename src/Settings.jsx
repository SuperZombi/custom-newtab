const Settings = React.memo(({
    clocks, weather, background, search,
    updateNested
}) => {
    const [showSettings, setShowSettings] = React.useState(false)
    return (
        <>
        <div className="
            fixed right-4 bottom-4 p-4 aspect-square rounded-full cursor-pointer
            text-white/50 hover:bg-black/20 hover:text-white
            hover:shadow-lg flex items-center justify-center
            transition-colors
        " onClick={_=>setShowSettings(true)}>
            <i className="fa-solid fa-gear"></i>
        </div>
        
        <Sidebar title="Settings" open={showSettings} onClose={_=>setShowSettings(false)}>
            <Container className="flex flex-col gap-4 p-4">
                <Switch
                    icon="fa-solid fa-clock"
                    label="Clocks"
                    label_className="font-bold text-base"
                    checked={clocks?.enabled}
                    onChange={v => updateNested("clocks", "enabled", v)}
                />
                <Switch
                    label="Show seconds"
                    checked={clocks?.showSeconds}
                    onChange={v => updateNested("clocks", "showSeconds", v)}
                />
                <Switch
                    label="12 Hour Format"
                    checked={clocks?.hour12}
                    onChange={v => updateNested("clocks", "hour12", v)}
                />
                <Switch
                    label="Show AM/PM"
                    checked={clocks?.showAmPm}
                    onChange={v => updateNested("clocks", "showAmPm", v)}
                />
                <Switch
                    label="Show date"
                    checked={clocks?.showDate}
                    onChange={v => updateNested("clocks", "showDate", v)}
                />
            </Container>
            <Container className="flex flex-col gap-4 p-4">
                <Switch
                    icon="fa-solid fa-magnifying-glass"
                    label="Search"
                    label_className="font-bold text-base"
                    checked={search?.enabled}
                    onChange={v => updateNested("search", "enabled", v)}
                />
                <Switch
                    label="Show suggestions"
                    checked={search?.suggestions}
                    onChange={v => updateNested("search", "suggestions", v)}
                />
            </Container>
            <Container className="flex flex-col gap-4 p-4">
                <Switch
                    icon="fa-solid fa-cloud"
                    label="Weather"
                    label_className="font-bold text-base"
                    checked={weather?.enabled}
                    onChange={v => updateNested("weather", "enabled", v)}
                />
            </Container>

            <BackgroundSettings
                background={background}
                updateNested={updateNested}
            />
        </Sidebar>
        </>
    )
})

const BackgroundSettings = React.memo(({ background, updateNested }) => {
    const tab = background?.type || "gradient"
	return (
		<div className="flex flex-col gap-4">
            <BackgroundPreview background={background}/>
            <div className="flex flex-col gap-4 py-2">
                <Slider label="Brightness"
                    value={background?.brightness ?? 100}
                    min={50} max={100} unit="%"
                    onChange={v => updateNested("background", "brightness", v)}
                />
                <Slider label="Vignette"
                    value={background?.vignette ?? 0}
                    min={0} max={100} unit="%"
                    onChange={v => updateNested("background", "vignette", v)}
                />
                <Slider label="Blur"
                    value={background?.blur ?? 0}
                    min={0} max={20} unit="px"
                    onChange={v => updateNested("background", "blur", v)}
                />
            </div>
			<div className="grid grid-cols-2 gap-2">
				{[
                    { id: "gradient", label: "Gradient", icon: "fa-solid fa-droplet" },
                    { id: "image", label: "Image", icon: "fa-solid fa-image" },
                ].map(t => (
					<Button
						key={t.id}
						className="text-sm py-2"
						forceActive={tab == t.id}
						onClick={_=>updateNested("background", "type", t.id)}
					>
						<i className={t.icon}></i>
						<span>{t.label}</span>
					</Button>
				))}
			</div>
            {tab == "gradient" && <GradientPicker background={background} updateNested={updateNested}/>}
            {tab == "image" && <ImagePicker background={background} updateNested={updateNested}/>}
		</div>
	)
})

const GradientPicker = ({ background, updateNested }) => {
    const updateGradient = (value) => {
        const matches = [
            ...value
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .matchAll(/background\s*:\s*([^;]+);?/gis)
        ]
        const gradient = matches.length
            ? matches[matches.length - 1][1].trim()
            : value;
        updateNested("background", "gradient", gradient);
    }
	return (
        <>
            <TextInput value={background?.gradient || ""}
                onChange={updateGradient}
            >
                <Button className="p-2.5 aspect-square" href="https://cssgradient.io/">
					<i className="fa-solid fa-arrow-up-right-from-square"></i>
				</Button>
            </TextInput>
            <Container className="grid grid-cols-4 gap-3 p-4">
                {gradientPresets.map((gradient, i) => (
                    <div key={i} className={`
                        w-full aspect-square rounded-lg ring-2 cursor-pointer transition-all
                        ${background.gradient == gradient ? "ring-white scale-105" : "ring-white/10 group-hover:ring-white/40"}
                    `} style={{ background: gradient }}
                        onClick={_=>updateNested("background", "gradient", gradient)}
                    />
                ))}
            </Container>
        </>
	)
}
const ImagePicker = ({ background, updateNested }) => {
	return (
        <>
            <TextInput value={background?.image || ""}
                onChange={v => updateNested("background", "image", v)}
            />
            <Container className="grid grid-cols-3 gap-3 p-4 select-none">
                {imagePresets.map((image, i) => (
                    <div className={`
                        aspect-video rounded-lg overflow-hidden ring-2 cursor-pointer transition-all
                        ${background.type == "image" && background.image == image.url ? "ring-white scale-105" : "ring-white/10 group-hover:ring-white/40"}
                    `} key={i} onClick={_=>updateNested("background", "image", image.url)}>
                        <img src={image.thumb || image.src} className="w-full h-full object-cover" draggable={false}/>
                    </div>
                ))}
            </Container>
        </>
	)
}

const buildBackgroundCss = (bg) => {
    if (bg?.type == "gradient" && bg?.gradient){
        return { background: bg.gradient }
    }
    if (bg?.type == "image" && bg?.image){
        const width = Math.round(window.screen.width * (window.devicePixelRatio || 1))
        const height = Math.round(window.screen.height * (window.devicePixelRatio || 1))
        
        const url = width > height ?
            bg.image.replace("{w}", width).replace("{h}", "") :
            bg.image.replace("{h}", height).replace("{w}", "")

       	return {
			backgroundImage: `url("${url}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
		}
    }
	return { background: "#0a0a12" }
}
const BackgroundLayers = ({ background, layerClassName }) => {
    return <>
        <div className={layerClassName} style={buildBackgroundCss(background)}/>
        {(background?.brightness ?? 100) < 100 && (
            <div className={`${layerClassName} bg-black`}
                style={{
                    opacity: (100 - (background?.brightness ?? 100)) / 100
                }}
            />
        )}
        {background?.blur > 0 && (
            <div className={layerClassName}
                style={{
                    backdropFilter: `blur(${background.blur}px)`
                }}
            />
        )}
        {background?.vignette > 0 && (
            <div className={layerClassName}
                style={{
                    boxShadow: `inset 0 0 ${background.vignette * 2}px rgba(0, 0, 0, 0.6)`
                }}
            />
        )}
    </>
}
const Background = React.memo(({background}) => {
    return <BackgroundLayers background={background} layerClassName="fixed inset-0 -z-10"/>
})
const BackgroundPreview = React.memo(({background}) => {
    return (
        <Container className="relative overflow-hidden aspect-video">
            <BackgroundLayers background={background} layerClassName="absolute inset-0 rounded-xl"/>
        </Container>
    )
})
