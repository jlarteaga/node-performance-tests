import csv from 'csv-parser';
import { createReadStream } from 'fs';
import { dirname, join as joinPath } from 'path';
import { fileURLToPath } from 'url';
import { lineChart } from '../../utils/d3/line-chart.js';
import { d3Output } from '../../utils/d3/output.js';

// https://learnui.design/tools/data-color-picker.html#divergent
const additionalChartConfig = new Map([
	['regular-for', { color: '#7babfa' }],
	['optimized-for', { color: '#dae2ff' }],
	['reversed-for', { color: '#b6b2c9' }],
	['for-of', { color: '#f19fa3' }],
	['forEach', { color: '#e0435c' }]
]);

const generateChartConfigFromFile = (filePath, lowerBoundary = 0, upperBoundary = Infinity) => new Promise((resolve, reject) => {
	const keysSet = new Set();
	const linesMap = new Map();
	createReadStream(filePath)
		.pipe(csv())
		.on('data', ({ test, avg, size }) => {
			const key = Number(size);
			if (key < lowerBoundary || key > upperBoundary) {
				return;
			}
			keysSet.add(key);
			if (!linesMap.has(test)) {
				linesMap.set(test, {
					label: test,
					data: []
				});
			}
			linesMap.get(test).data.push({
				key,
				value: Number(avg)
			});
		})
		.on('end', () => {
			const config = {
				colors: [],
				data: [],
				lineSpecs: []
			};
			config.data.allKeys = Array.from(keysSet.values());
			linesMap.forEach(({ label, data }) => {
				config.colors.push(additionalChartConfig.get(label).color);
				config.data.push(data);
				config.lineSpecs.push({
					label,
					color: additionalChartConfig.get(label).color
				});
			});
			resolve(config);
		})
		.on('error', reject);
});

const statsFile = joinPath(dirname(fileURLToPath(import.meta.url)), 'stats.csv');
const d3OutputPath = joinPath(dirname(fileURLToPath(import.meta.url)));

const outputs = [
	{
		statsFile,
		lowerBoundary: 0,
		upperBoundary: 100
	},
	{
		statsFile,
		lowerBoundary: 100,
		upperBoundary: 5000
	},
	{
		statsFile,
		lowerBoundary: 5000,
		upperBoundary: 100000
	},
	{
		statsFile,
		lowerBoundary: 100000,
		upperBoundary: 1000000
	},
	{
		statsFile,
		lowerBoundary: 0,
		upperBoundary: 1000000
	}
];

Promise.all(outputs.map(
		async ({
				   statsFile,
				   lowerBoundary,
				   upperBoundary
			   }) => {
			generateChartConfigFromFile(statsFile, lowerBoundary, upperBoundary)
				.then((chartConfig) => new Promise((resolve, reject) => {
					d3Output(
						joinPath(d3OutputPath, `stats_${lowerBoundary}-${upperBoundary}`),
						lineChart({
							data: chartConfig.data,
							margin: {
								top: 60,
								bottom: 60,
								left: 90,
								right: 60
							},
							lineColors: chartConfig.colors,
							lineLabels: chartConfig.lineSpecs,
							xScaleLabel: 'Array size',
							yScaleLabel: 'Avg processing time (ns)',
							container: `<div id="container"><h2>Multiline Example</h2><div id="chart"></div></div>`,
							width: 1920,
							height: 1080
						}),
						{},
						(err) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						}
					);
				}));
		}
	))
	.then(() => {
		console.log('Finished');
	})
	.catch(console.error);
