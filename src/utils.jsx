const storageApi = {
	get: async () => {
		try {
			if (typeof chrome !== "undefined" && chrome.storage?.sync) {
				return new Promise((resolve) => {
					chrome.storage.sync.get(["settings"], (result) => {
						resolve({ ...defaults, ...(result.settings || {}) })
					})
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				const result = await browser.storage.sync.get("settings")
				return { ...defaults, ...(result.settings || {}) };
			}
			const saved = window.localStorage.getItem("settings");
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
					chrome.storage.sync.set({ settings: value }, resolve)
				})
			}
			if (typeof browser !== "undefined" && browser.storage?.sync) {
				await browser.storage.sync.set({ settings: value })
				return;
			}
			window.localStorage.setItem("settings", JSON.stringify(value))
		} catch (e) {
			console.error("Storage write error:", e)
		}
	}
}
