const Settings = ({show, onClose, settings, updateSetting}) => {
    return (
        <Sidebar className="" title="Settings" open={show} onClose={onClose}>
            <Container className="flex flex-col gap-4 p-4">
                <Switch
                    label="Clocks"
                    className="font-bold"
                    checked={settings?.clocks?.enabled}
                    onChange={v => updateSetting("clocks", {
                        ...settings?.clocks, enabled: v
                    })}
                />
                <Switch
                    label="Show seconds"
                    checked={settings?.clocks?.showSeconds}
                    onChange={v => updateSetting("clocks", {
                        ...settings?.clocks, showSeconds: v
                    })}
                />
                <Switch
                    label="Show date"
                    checked={settings?.clocks?.showDate}
                    onChange={v => updateSetting("clocks", {
                        ...settings?.clocks, showDate: v
                    })}
                />
            </Container>
            <Container className="flex flex-col gap-4 p-4">
                <Switch
                    label="Weather"
                    className="font-bold"
                    checked={settings?.weather?.enabled}
                    onChange={v => updateSetting("weather", {
                        ...settings?.weather, enabled: v
                    })}
                />
            </Container>

            <BackgroundSettings
                background={settings.background}
                updateBackground={bg => updateSetting("background", bg)}
            />
        </Sidebar>
    )
}

const BackgroundSettings = ({ background, updateBackground }) => {
    const tab = background?.type || "gradient"
	return (
		<div className="flex flex-col gap-4">
            <BackgroundPreview background={background}/>
            <div className="flex flex-col gap-4 py-2">
                <Slider label="Dim overlay" value={Math.round((background?.overlay ?? 0) * 100)} min={0} max={50} unit="%"
                    onChange={v => updateBackground({ ...background, overlay: v / 100 })}
                />
                <Slider label="Vignette" value={Math.round((background?.vignette ?? 0) / 2)} min={0} max={100} unit="%"
                    onChange={v => updateBackground({ ...background, vignette: v * 2 })}
                />
                <Slider label="Blur" value={background?.blur ?? 0} min={0} max={20} unit="px"
                    onChange={v => updateBackground({ ...background, blur: v })}
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
						onClick={_=>{
                            updateBackground({ ...background, type: t.id })
                        }}
					>
						<i className={t.icon}></i>
						<span>{t.label}</span>
					</Button>
				))}
			</div>
            {tab == "gradient" && <GradientPicker background={background} updateBackground={updateBackground}/>}
            {tab == "image" && <ImagePicker background={background} updateBackground={updateBackground}/>}
		</div>
	)
}

const buildBackgroundCss = (bg) => {
    if (bg?.type == "gradient" && bg?.gradient){
        return { background: bg.gradient }
    }
    if (bg?.type == "image" && bg?.image){
       	return {
			backgroundImage: `url("${bg.image}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
		}
    }
	return { background: "#0a0a12" }
}
const Background = React.memo(({background}) => {
    return <>
        <div className="fixed inset-0 -z-10" style={buildBackgroundCss(background)}/>
        {background?.overlay > 0 && (
            <div className="fixed inset-0 -z-10 bg-black" style={{opacity: background.overlay}}/>
        )}
        {background?.blur > 0 && (
            <div className="fixed inset-0 -z-10"
                style={{backdropFilter: `blur(${background.blur}px)`}}
            />
        )}
        {background?.vignette > 0 && (
            <div className="fixed inset-0 -z-10"
                style={{boxShadow: `inset 0 0 ${background.vignette}px rgba(0, 0, 0)`}}
            />
        )}
    </>
})
const BackgroundPreview = React.memo(({background}) => {
	return (
		<Container className="relative overflow-hidden aspect-video">
			<div className="absolute inset-0" style={buildBackgroundCss(background)}/>
			{background?.overlay > 0 && (
				<div className="absolute inset-0 bg-black" style={{opacity: background.overlay}}/>
			)}
			{background?.blur > 0 && (
				<div className="absolute inset-0" style={{backdropFilter: `blur(${background.blur}px)`}}/>
			)}
            {background?.vignette > 0 && (
                <div className="absolute inset-0"
                    style={{boxShadow: `inset 0 0 ${background.vignette}px rgba(0, 0, 0, 0.6)`}}
                />
            )}
		</Container>
	)
})

const GradientPicker = ({ background, updateBackground }) => {
	return (
        <>
            <TextInput value={background?.gradient || ""}
                onChange={v => updateBackground({ ...background, type: "gradient", gradient: v })}
            />
            <Container className="grid grid-cols-4 gap-3 p-4">
                {gradientPresets.map((gradient, i) => (
                    <div key={i} className={`
                        w-full aspect-square rounded-lg ring-2 cursor-pointer transition-all
                        ${background.gradient == gradient ? "ring-white scale-105" : "ring-white/10 group-hover:ring-white/40"}
                    `} style={{ background: gradient }}
                        onClick={_=>{
                            updateBackground({...background, type: "gradient", gradient: gradient})
                        }}
                    />
                ))}
            </Container>
        </>
	)
}

const ImagePicker = ({ background, updateBackground }) => {
	return (
        <>
            <TextInput value={background?.image || ""}
                onChange={v => updateBackground({ ...background, type: "image", image: v })}
            />
            <Container className="grid grid-cols-3 gap-3 p-4">
                {imagePresets.map((image, i) => (
                    <div className={`
                        aspect-video rounded-lg overflow-hidden ring-2 cursor-pointer transition-all
                        ${background.type == "image" && background.image == image.url ? "ring-white scale-105" : "ring-white/10 group-hover:ring-white/40"}
                    `} key={i} onClick={_=>{
                        updateBackground({ ...background, type: "image", image: image.url })
                    }}>
                        <img src={image.thumb || image.src} className="w-full h-full object-cover" draggable={false}/>
                    </div>
                ))}
            </Container>
        </>
	)
}
