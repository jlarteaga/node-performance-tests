export const testPerformance = ({ iterations, testName, fn, testArray }) => {
	const alternativeStats = {
		test: testName,
		sum: BigInt(0),
		count: 0
	};
	for (let i = 0; i < iterations; i++) {
		const start = process.hrtime.bigint();
		fn(testArray);
		const time = process.hrtime.bigint() - start;
		alternativeStats.sum += time;
		alternativeStats.count++;
	}
	alternativeStats.avg = alternativeStats.sum / BigInt(alternativeStats.count);
	delete alternativeStats.sum;
	delete alternativeStats.count;
	return alternativeStats;
};
