const n = 300000;
const testArray = [...Array(n).keys()];
const targetSum = (n * (n - 1)) / 2;
const iterations = 1000;

const alternatives = {
	'regular-for': (array) => {
		let sum = 0;
		for (let i = 0; i < array.length; i++) {
			sum += array[i];
		}
		return sum;
	},
	'optimized-for': (array) => {
		let sum = 0;
		for (let i = 0, length = array.length; i < length; i++) {
			sum += array[i];
		}
		return sum;
	},
	'reversed-for': (array) => {
		let sum = 0;
		for (let i = array.length - 1; i >= 0; i--) {
			sum += array[i];
		}
		return sum;
	},
	'for-of': (array) => {
		let sum = 0;
		for (let value of array) {
			sum += value;
		}
		return sum;
	},
	'forEach': (array) => {
		let sum = 0;
		array.forEach(value => sum += value);
		return sum;
	}
};

const checkAlternativesValidity = () => {
	const results = [];
	Object.keys(alternatives).forEach(alternativeKey => {
		const sum = alternatives[alternativeKey](testArray);
		results.push({
			alternative: alternativeKey,
			isValid: sum === targetSum
		});
	});
	console.table(results);
};

const checkPerformance = () => {
	const results = [];
	Object.keys(alternatives).forEach(alternativeKey => {
		const alternativeStats = {
			alternative: alternativeKey,
			min: Infinity,
			max: -Infinity,
			sum: 0,
			count: 0
		};
		for (let i = 0; i < iterations; i++) {
			const start = performance.now();
			alternatives[alternativeKey](testArray);
			const time = performance.now() - start;
			if (time > alternativeStats.max) {
				alternativeStats.max = time;
			}
			if (time < alternativeStats.min) {
				alternativeStats.min = time;
			}
			alternativeStats.sum += time;
			alternativeStats.count++;
		}
		alternativeStats.avg = alternativeStats.sum / alternativeStats.count;
		delete alternativeStats.sum;
		delete alternativeStats.count;
		results.push(alternativeStats);
	});

	const processResults = (resultsToProcess, comparisonField) => {
		let parsedResults = resultsToProcess.slice();
		parsedResults.sort((resultA, resultB) => resultA[comparisonField] - resultB[comparisonField]);
		const reference = parsedResults[0][comparisonField];
		parsedResults = parsedResults.map(result => ({
			...result,
			comparison: (result[comparisonField] / reference * 100 - 100)
		}));
		return parsedResults;
	}
	const displayResults = (title, resultsToDisplay) => {
		console.log(title);
		console.table(resultsToDisplay.map(result => ({
			alternative: result.alternative,
			'avg time (ms)': result.avg,
			'min time (ms)': result.min,
			'max time (ms)': result.max,
			'how slow against best': `${result.comparison.toFixed(2)}%`
		})));
		console.log();
	};
	displayResults(
		`Better avg time (array.length=${n}, ${iterations} iterations each)`,
		processResults(results, 'avg')
	);
};

checkAlternativesValidity();
checkPerformance();
