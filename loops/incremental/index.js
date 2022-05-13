import { testPerformance } from '../../utils.js';
import alternatives from '../alternatives.js';
import { ArrayCsvWriterStream } from '../../utils/streams/array-csv-writer.stream.js';
import { dirname, join as joinPath } from 'path';
import { fileURLToPath } from 'url';

const testForArraySize = (size, iterations) => {
	const results = [];
	const testArray = [...Array(size).keys()];
	Object.keys(alternatives).forEach(alternativeKey => {
		results.push(
			testPerformance({
				iterations,
				testArray,
				testName: alternativeKey,
				fn: alternatives[alternativeKey]
			})
		);
	});
	return results;
};

const testForIncrementalArraySize = async (initialSize, finalSize, logFn) => {
	let increment;
	let currentSize = initialSize < 1 ? 1 : initialSize;
	try {
		while (currentSize <= finalSize) {
			// https://mycurvefit.com/
			const iterations = Math.round(100000 * Math.pow(currentSize, -0.4519164));

			console.log(currentSize, iterations);

			const results = testForArraySize(currentSize, iterations);
			logFn && await logFn(currentSize, iterations, results);

			if (currentSize < 10) {
				increment = 1;
			} else {
				increment = Math.pow(10, Math.floor(Math.log10(currentSize)) - 1);
			}
			currentSize +=increment;
		}
	} catch (e) {}
};

const arrayCsvWriter = new ArrayCsvWriterStream({
	highWaterMark: 1000,
	fields: ['test', 'avg', 'size', 'iterations'],
	filePath: joinPath(dirname(fileURLToPath(import.meta.url)), 'stats.csv')
});

testForIncrementalArraySize(0, 1000000, async (currentSize, iterations, results) => {
	return Promise.all(
		results.map(result => new Promise((resolve, reject) => {
			arrayCsvWriter.write({
				...result,
				size: currentSize,
				iterations
			}, error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		}))
	);
}).then(() => {
	console.log('Finished');
});
