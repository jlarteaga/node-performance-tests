import alternatives from '../alternatives.js';
import { testPerformance } from '../../utils.js';

const n = 300000;
const testArray = [...Array(n).keys()];
const targetSum = (n * (n - 1)) / 2;
const iterations = 1000;

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
		results.push(testPerformance({
			iterations,
			testName: alternativeKey,
			fn:alternatives[alternativeKey],
			testArray
		}));
	});

	const processResults = (resultsToProcess, comparisonField) => {
		let parsedResults = resultsToProcess.slice();
		parsedResults.sort((resultA, resultB) => {
			if (resultA[comparisonField] > resultB[comparisonField]) {
				return 1;
			} else if (resultA[comparisonField] < resultB[comparisonField]) {
				return -1;
			} else {
				return 0;
			}
		});
		const reference = parsedResults[0][comparisonField];
		parsedResults = parsedResults.map(result => ({
			...result,
			comparison: (parseInt(result[comparisonField] * 10000n / reference) / 100 - 100)
		}));
		return parsedResults;
	};
	const displayResults = (title, resultsToDisplay) => {
		console.log(title);
		console.table(resultsToDisplay.map(result => ({
			test: result.test,
			'avg time (ms)': result.avg,
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
