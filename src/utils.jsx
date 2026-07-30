const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list)
	const [removed] = result.splice(startIndex, 1)
	result.splice(endIndex, 0, removed)
	return result
}
const getIcon = (url) => {
	try {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
	} catch (e) {
		return ""
	}
}
const accentStyle = (accent, { bg, ring, hoverBg } = {}) => {
	if (!accent) return undefined
	const style = {color: accent}
	if (bg != null) style.background = `color-mix(in srgb, ${accent} ${bg}%, transparent)`
	if (ring != null) style["--tw-ring-color"] = `color-mix(in srgb, ${accent} ${ring}%, transparent)`
	if (hoverBg != null) style["--btn-accent-hover"] = `color-mix(in srgb, ${accent} ${hoverBg}%, transparent)`
	return style
}

const STORAGE_KEY = "newtab-settings";
const storageApi = {
	get: async () => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.get([STORAGE_KEY], (result) => {
						resolve({ ...defaults, ...(result?.[STORAGE_KEY] || {}) })
					})
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				const result = await browser.storage.sync.get(STORAGE_KEY)
				return { ...defaults, ...(result?.[STORAGE_KEY] || {}) }
			}
			const saved = window.localStorage.getItem(STORAGE_KEY)
			const parsed = saved ? JSON.parse(saved) : {};
			return { ...defaults, ...parsed };
		} catch (e) {
			console.error("Storage read error:", e);
			return defaults;
		}
	},
	set: async (value) => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.set({ STORAGE_KEY: value }, resolve)
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				await browser.storage.sync.set({ STORAGE_KEY: value })
				return;
			}
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
		} catch (e) {
			console.error("Storage write error:", e)
		}
	}
}
