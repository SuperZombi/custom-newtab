const WEATHER_REFRESH_MS = 15 * 60 * 1000;
 
const fetchWeather = (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}` +
        `&longitude=${lon}` +
        `&hourly=precipitation_probability` +
        `&forecast_days=1` +
        `&current=` + [
            "temperature_2m",
            "relative_humidity_2m",
            "weather_code",
            "wind_speed_10m",
        ].join(",");
    return fetch(url).then(r => {
        if (!r.ok) { throw new Error(`HTTP ${r.status}: ${r.statusText}`) }
        return r.json()
    }).then(weather=>{
        const current = weather.current;
        const currentHour = current.time.slice(0, current.time.lastIndexOf(":")) + ":00";
        const index = weather.hourly.time.indexOf(currentHour);
        if (index < 0) console.warn("Failed to get rain chance")
        const remainingProbabilities =
            index >= 0
                ? weather.hourly.precipitation_probability.slice(index)
                : weather.hourly.precipitation_probability;
        const rainChance = Math.max(...remainingProbabilities, 0);
        return {
            temperature: `${Math.round(weather.current.temperature_2m)}${weather.current_units.temperature_2m}`,
            humidity: `${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`,
            wind: `${Math.round(weather.current.wind_speed_10m)}${weather.current_units.wind_speed_10m}`,
            rainChance: `${rainChance}%`,
            weatherCode: weather.current.weather_code
        }
    })
}

const WeatherWidget = React.memo(() => {
    const [coordinates, setCoordinates] = React.useState({})
    const [weatherData, setWeatherData] = React.useState({})
    const [error, setError] = React.useState(null)
    
    const fetchCoordinates = React.useCallback(() => {
        if (!navigator.geolocation) {
            setError("gps")
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ latitude, longitude })
                setError(null)
            },
            (err) => {
                setError("gps")
                console.error(err)
            }
        )
    }, [])

    React.useEffect(() => {
        fetchCoordinates()
    }, [fetchCoordinates])

    const loadWeather = React.useCallback((latitude, longitude) => {
        fetchWeather(latitude, longitude).then(data=>{
            setWeatherData(data)
            setError(null)
        }).catch(err=>{
            console.error(err)
            setError("fetch")
        })
    }, [])
    
    React.useEffect(_=>{
        if (!(coordinates?.latitude && coordinates?.longitude)) return

        loadWeather(coordinates.latitude, coordinates.longitude)
        const id = setInterval(() => {
            loadWeather(coordinates.latitude, coordinates.longitude)
        }, WEATHER_REFRESH_MS)
        return () => {
            clearInterval(id)
        }
    }, [coordinates])

    const handleRetry = React.useCallback(() => {
        if (error == "gps") {
            fetchCoordinates()
        } else if (error == "fetch" && coordinates?.latitude && coordinates?.longitude) {
            loadWeather(coordinates.latitude, coordinates.longitude)
        }
    }, [error, coordinates, fetchCoordinates, loadWeather])

    const { rendered, visible } = usePresence(
        ((coordinates?.latitude && coordinates?.longitude) && Object.keys(weatherData).length > 0) || error
    , { duration: 500 })
	if (!rendered) return null
    return (
        <Container className={`fixed left-4 bottom-4 z-10 backdrop-blur-md
            bg-gradient-to-br from-sky-500/20 via-white/10 to-indigo-600/20
            group !ring-sky-400/20 transition-opacity duration-500 select-none
            ${visible ? "opacity-100" : "opacity-0"}
            ${error ? "animate-pulse cursor-pointer hover:!opacity-100" : ""}
        `} onClick={error ? handleRetry : undefined}>
            {error ? (
                <div className="p-4">
                    {error == "gps" ? (
                        <i className="fa-solid fa-location-arrow-slash"></i>
                    ) : (
                        <i className="fa-solid fa-cloud-slash"></i>
                    )}
                </div>
            ) : (
            <div className="flex">
                <div className="flex items-center gap-4 p-4">
                    {weatherDescriptions[weatherData.weatherCode] && (
                        <i className={`
                            ${weatherDescriptions[weatherData.weatherCode]?.icon}
                            ${weatherDescriptions[weatherData.weatherCode]?.color}
                            text-5xl
                        `}></i>
                    )}
                    <div className="flex flex-col gap-1">
                        <div className="text-4xl font-bold text-white">
                            {weatherData.temperature}
                        </div>
                        {weatherDescriptions[weatherData.weatherCode] && (
                            <div className="text-white/90">
                                {weatherDescriptions[weatherData.weatherCode]?.text}
                            </div>
                        )}
                    </div>
                </div>

                <div className="transition-all duration-500
                    grid grid-cols-[0fr] group-hover:grid-cols-[1fr]
                    group-active:grid-cols-[1fr]
                ">
                    <div className="overflow-hidden">
                        <div className="p-4 pl-0.5 grid grid-cols-3 gap-3 min-w-max h-full">
                            <WeatherSubCard
                                icon="fa-solid fa-umbrella"
                                label="Rain"
                                value={weatherData.rainChance}
                            />
                            <WeatherSubCard
                                icon="fa-solid fa-droplet"
                                label="Humidity"
                                value={weatherData.humidity}
                            />
                            <WeatherSubCard
                                icon="fa-solid fa-wind"
                                label="Wind"
                                value={weatherData.wind}
                            />
                        </div>
                    </div>
                </div>
            </div>
            )}
        </Container>
    )
})

const WeatherSubCard = ({icon, label, value}) => {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/20 p-3 flex items-center justify-center gap-2">
            <div className="">
                <i className={icon}></i>
            </div>
            <div className="flex flex-col">
                <div className="font-semibold text-white">
                    {value}
                </div>
                <div className="text-xs text-white/60">
                    {label}
                </div>
            </div>
        </div>
    )
}

const weatherDescriptions = {
    0: {
        text: "Sunny",
        icon: "fa-solid fa-sun",
        color: "text-yellow-300",
    },
    1: {
        text: "Mainly Sunny",
        icon: "fa-solid fa-cloud-sun",
        color: "text-yellow-200",
    },
    2: {
        text: "Partly Cloudy",
        icon: "fa-solid fa-cloud-sun",
        color: "text-yellow-200",
    },
    3: {
        text: "Cloudy",
        icon: "fa-solid fa-cloud",
        color: "text-gray-300",
    },
    45: {
        text: "Foggy",
        icon: "fa-solid fa-smog",
        color: "text-gray-400",
    },
    48: {
        text: "Rime Fog",
        icon: "fa-solid fa-smog",
        color: "text-cyan-200",
    },
    51: {
        text: "Light Drizzle",
        icon: "fa-solid fa-cloud-rain",
        color: "text-blue-300",
    },
    53: {
        text: "Drizzle",
        icon: "fa-solid fa-cloud-rain",
        color: "text-blue-400",
    },
    55: {
        text: "Heavy Drizzle",
        icon: "fa-solid fa-cloud-showers-heavy",
        color: "text-blue-500",
    },
    56: {
        text: "Light Freezing Drizzle",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-200",
    },
    57: {
        text: "Freezing Drizzle",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-300",
    },
    61: {
        text: "Light Rain",
        icon: "fa-solid fa-cloud-rain",
        color: "text-sky-300",
    },
    63: {
        text: "Rain",
        icon: "fa-solid fa-cloud-rain",
        color: "text-sky-400",
    },
    65: {
        text: "Heavy Rain",
        icon: "fa-solid fa-cloud-showers-heavy",
        color: "text-blue-500",
    },
    66: {
        text: "Light Freezing Rain",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-200",
    },
    67: {
        text: "Freezing Rain",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-300",
    },
    71: {
        text: "Light Snow",
        icon: "fa-solid fa-snowflake",
        color: "text-white",
    },
    73: {
        text: "Snow",
        icon: "fa-solid fa-snowflake",
        color: "text-slate-100",
    },
    75: {
        text: "Heavy Snow",
        icon: "fa-solid fa-snowflake",
        color: "text-blue-100",
    },
    77: {
        text: "Snow Grains",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-100",
    },
    80: {
        text: "Light Showers",
        icon: "fa-solid fa-cloud-sun-rain",
        color: "text-sky-300",
    },
    81: {
        text: "Showers",
        icon: "fa-solid fa-cloud-rain",
        color: "text-blue-400",
    },
    82: {
        text: "Heavy Showers",
        icon: "fa-solid fa-cloud-showers-heavy",
        color: "text-blue-500",
    },
    85: {
        text: "Light Snow Showers",
        icon: "fa-solid fa-snowflake",
        color: "text-cyan-100",
    },
    86: {
        text: "Snow Showers",
        icon: "fa-solid fa-snowflake",
        color: "text-blue-100",
    },
    95: {
        text: "Thunderstorm",
        icon: "fa-solid fa-cloud-bolt",
        color: "text-purple-400",
    },
    96: {
        text: "Light Thunderstorms With Hail",
        icon: "fa-solid fa-cloud-bolt",
        color: "text-purple-300",
    },
    99: {
        text: "Thunderstorm With Hail",
        icon: "fa-solid fa-cloud-bolt",
        color: "text-purple-500",
    },
}
