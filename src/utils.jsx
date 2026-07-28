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

const storageApi = {
	get: async () => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.get(["newtab-settings"], (result) => {
						resolve({ ...defaults, ...(result?.["newtab-settings"] || {}) })
					})
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				const result = await browser.storage.sync.get("newtab-settings")
				return { ...defaults, ...(result?.["newtab-settings"] || {}) }
			}
			const saved = window.localStorage.getItem("newtab-settings")
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
					chrome.storage.sync.set({ "newtab-settings": value }, resolve)
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				await browser.storage.sync.set({ "newtab-settings": value })
				return;
			}
			window.localStorage.setItem("newtab-settings", JSON.stringify(value))
		} catch (e) {
			console.error("Storage write error:", e)
		}
	}
}
