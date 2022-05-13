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

export default alternatives;
