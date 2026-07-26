const fs = require('fs');
const glob = require('glob');
const esbuild = require('esbuild');

const files = glob.sync('src/*.jsx');
const tempEntry = 'temp_combined.jsx';
const combinedCode = files
	.map(file => fs.readFileSync(file, 'utf8'))
	.join('\n\n');
fs.writeFileSync(tempEntry, combinedCode);

esbuild.build({
	entryPoints: [tempEntry],
	bundle: true,
	outfile: 'dist/main.js',
	loader: { '.jsx': 'jsx' },
	platform: 'browser',
	format: 'iife',
	globalName: 'AppBundle',
	minify: true
}).then(() => {
	fs.unlinkSync(tempEntry);
	console.log('✅ React Build Done');
}).catch((err) => {
	console.error('❌ Build Error:', err.message);
	process.exit(1);
});

fs.cpSync('./images', './dist/images', {
	recursive: true
});
fs.cpSync('./fontawesome', './dist/fontawesome', {
	recursive: true
});
