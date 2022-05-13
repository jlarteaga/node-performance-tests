import { writeFile, createWriteStream } from 'fs';

export const d3Output = (dest, d3n = {}) => {
	const d3 = d3n.d3;

	if (d3n.options.canvas) {
		const canvas = d3n.options.canvas;
		canvas.pngStream().pipe(createWriteStream(`${dest}.png`));
		console.log(`>> Exported canvas to ${dest}.png`);
		return;
	}

	function eachGeoQuantize() {
		const coords = d3.select(this).attr('d') || '';
		const rounded = coords.replace(/[0-9]*\.[0-9]*/g, (x) => (+x).toFixed(4));
		d3.select(this).attr('d', rounded);
	}

	// reduce filesize of svg
	d3n.d3Element.selectAll('path').each(eachGeoQuantize);

	const html = d3n.html();
	const svgString = d3n.svgString();
	writeFile(`${dest}.html`, html, function() {
		console.log(`>> Exported "${dest}.html", open in a web browser`);
	});

	writeFile(`${dest}.svg`, svgString, function() {
		console.log(`>> Exported "${dest}.svg"`);
	});
};
