const categoryTemplates = [
	{
		icon: "fa-solid fa-camera",
		title: "Search by Image",
		accent: "#c27aff",
		items: [
			{
				label: "Google",
				url: "https://images.google.com/?olud"
			},
			{
				label: "Yandex",
				url: "https://yandex.ru/images/search?rpt=imageview"
			}
		]
	},
	{
		icon: "fa-solid fa-sparkles",
		title: "Ask AI",
		accent: "#53eafd",
		items: [
			{
				label: "Chat GPT",
				url: "https://chatgpt.com/"
			},
			{
				label: "Gemini",
				url: "https://gemini.google.com/"
			},
			{
				label: "Claude",
				url: "https://claude.ai/"
			}
		]
	},
	{
		icon: "fa-solid fa-envelope",
		title: "Email",
		accent: "#7bf1a8",
		items: [
			{
				label: "Gmail",
				url: "https://mail.google.com/"
			},
			{
				label: "Outlook",
				url: "https://outlook.office.com"
			}
		]
	},
	{
		icon: "fa-solid fa-cloud",
		title: "Cloud",
		accent: "#00bcff",
		items: [
			{
				label: "Google Drive",
				url: "https://drive.google.com/"
			},
			{
				label: "Dropbox",
				url: "https://dropbox.com/"
			},
			{
				label: "OneDrive",
				url: "https://onedrive.live.com/"
			}
		]
	},
]

const gradientPresets = [
	"radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.14), transparent 45%), #0a0a12",
	"radial-gradient(70% 50% at 10% 10%, rgba(45,212,191,.16), transparent 80%), radial-gradient(62% 60% at 90% 20%, rgba(139,92,246,.16), transparent 80%), radial-gradient(70% 60% at 40% 90%, rgba(59,130,246,.12), transparent 75%), #0b0f19",
	"radial-gradient(circle at 80% 20%, #ff0055 0%, transparent 50%), radial-gradient(circle at 20% 80%, #00ffff 0%, transparent 50%), #0b0b1a",
	"radial-gradient(circle at 20% 30%, #7C3AED 0%, transparent 35%), radial-gradient(circle at 80% 20%, #06B6D4 0%, transparent 35%), radial-gradient(circle at 50% 80%, #EC4899 0%, transparent 35%), #0F172A",
	"linear-gradient(160deg, rgb(15, 23, 42), rgb(124, 58, 237))",
	"linear-gradient(145deg, rgb(194, 122, 255), rgb(30, 27, 75))",
	"linear-gradient(155deg, rgb(3, 105, 161), rgb(8, 47, 73))",
	"linear-gradient(140deg, rgb(249, 115, 22), rgb(219, 39, 119))",
	"linear-gradient(170deg, rgb(127, 29, 29), rgb(10, 10, 18))",
	"linear-gradient(135deg, #052E16 0%, #166534 55%, #22C55E 100%)",
	"linear-gradient(45deg, #4159d0 0.000%, #c84fc0 50.000%, #ffcd70 100.000%)",
	"linear-gradient(135deg, rgb(99, 102, 241), rgb(236, 72, 153))",
	"linear-gradient(135deg, #d0415e 0.000%, #d0415e 20.000%, #d65767 calc(20.000% + 1px), #d65767 40.000%, #db7971 calc(40.000% + 1px), #db7971 60.000%, #e0a57c calc(60.000% + 1px), #e0a57c 80.000%, #e6d886 calc(80.000% + 1px) 100.000%)",
	"conic-gradient(from 210deg, #c5bbb8 0.000deg, #c5bbb8 24.000deg, #b8b5b8 calc(24.000deg + 0.1deg), #b8b5b8 48.000deg, #a9afb7 calc(48.000deg + 0.1deg), #a9afb7 72.000deg, #9aa8b5 calc(72.000deg + 0.1deg), #9aa8b5 96.000deg, #8ba1b3 calc(96.000deg + 0.1deg), #8ba1b3 120.000deg, #7d98af calc(120.000deg + 0.1deg), #7d98af 144.000deg, #7090ab calc(144.000deg + 0.1deg), #7090ab 168.000deg, #6587a6 calc(168.000deg + 0.1deg), #6587a6 192.000deg, #5c7ea1 calc(192.000deg + 0.1deg), #5c7ea1 216.000deg, #55759b calc(216.000deg + 0.1deg), #55759b 240.000deg, #516c94 calc(240.000deg + 0.1deg), #516c94 264.000deg, #4f638d calc(264.000deg + 0.1deg), #4f638d 288.000deg, #505a85 calc(288.000deg + 0.1deg), #505a85 312.000deg, #54537d calc(312.000deg + 0.1deg), #54537d 336.000deg, #5b4b74 calc(336.000deg + 0.1deg) 360.000deg)",
	"linear-gradient(90deg, #dac574 0.000%, #dac574 7.692%, #d9b656 calc(7.692% + 1px), #d9b656 15.385%, #d5a337 calc(15.385% + 1px), #d5a337 23.077%, #d08f17 calc(23.077% + 1px), #d08f17 30.769%, #c87900 calc(30.769% + 1px), #c87900 38.462%, #be6100 calc(38.462% + 1px), #be6100 46.154%, #b24800 calc(46.154% + 1px), #b24800 53.846%, #a52f00 calc(53.846% + 1px), #a52f00 61.538%, #961600 calc(61.538% + 1px), #961600 69.231%, #860000 calc(69.231% + 1px), #860000 76.923%, #740000 calc(76.923% + 1px), #740000 84.615%, #620000 calc(84.615% + 1px), #620000 92.308%, #500000 calc(92.308% + 1px) 100.000%)",
	"linear-gradient(180deg, #020617 0%, #111827 100%)",
]
const imagePresets = [
	{ thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=60", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=300&q=60", url: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=60", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&q=60", url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=300&q=60", url: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&q=60", url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=300&q=60", url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1491466424936-e304919aada7?w=300&q=60", url: "https://images.unsplash.com/photo-1491466424936-e304919aada7?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w=300&q=60", url: "https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=60", url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=60", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=300&q=60", url: "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=60", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=60", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=60", url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=60", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?w=300&q=60", url: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1500073584060-670c36a703f1?w=300&q=60", url: "https://images.unsplash.com/photo-1500073584060-670c36a703f1?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1475598322381-f1b499717dda?w=300&q=60", url: "https://images.unsplash.com/photo-1475598322381-f1b499717dda?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1479030160180-b1860951d696?w=300&q=60", url: "https://images.unsplash.com/photo-1479030160180-b1860951d696?w={w}&h={h}&q=100" },
	{ thumb: "https://images.unsplash.com/photo-1672009190560-12e7bade8d09?w=300&q=60", url: "https://images.unsplash.com/photo-1672009190560-12e7bade8d09?w={w}&h={h}&q=100" },
]
