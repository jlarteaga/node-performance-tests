import D3Node from 'd3-node';

export const lineChart = (
	{
		data,
		selector: _selector = '#chart',
		container: _container = `<div id="container"><h2>Line Chart</h2><div id="chart"></div></div>`,
		style: _style = '',
		width: _width = 960,
		height: _height = 500,
		margin: _margin = { top: 20, right: 20, bottom: 60, left: 30 },
		lineWidth: _lineWidth = 1.5,
		lineColor: _lineColor = 'steelblue',
		lineColors: _lineColors = ['steelblue'],
		isCurve: _isCurve = true,
		tickSize: _tickSize = 5,
		tickPadding: _tickPadding = 5,
		xScaleLabel: _xScaleLabel = 'X axis',
		yScaleLabel: _yScaleLabel = 'Y axis',
		lineLabels: _lineLabels = []
	} = {}
) => {
	const d3n = new D3Node({
		selector: _selector,
		svgStyles: _style,
		container: _container
	});

	const d3 = d3n.d3;

	const width = _width - _margin.left - _margin.right;
	const height = _height - _margin.top - _margin.bottom;

	let svg = d3n.createSVG(_width, _height);
	svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'floralwhite');
	svg = svg.append('g')
		.attr('transform', `translate(${_margin.left}, ${_margin.top})`);

	_lineLabels.forEach(({ label, color }, index) => {
		svg.append('rect')
			.attr('x', 100)
			.attr('y', 10 + 25 * index)
			.attr('width', 10)
			.attr('height', 10)
			.attr('fill', color);
		svg.append('text')
			.attr('text-anchor', 'start')
			.attr('x', 120)
			.attr('y', 10 + 25 * index)
			.attr('dy', '0.6em')
			.text(label);

	});

	const g = svg.append('g');

	const { allKeys } = data;
	const xScale = d3.scaleLinear()
		.domain(allKeys ? d3.extent(allKeys) : d3.extent(data, d => d.key))
		.rangeRound([0, width]);
	const yScale = d3.scaleLinear()
		.domain(allKeys ? [d3.min(data, d => d3.min(d, v => v.value)), d3.max(data, d => d3.max(d, v => v.value))] : d3.extent(data,
			d => d.value))
		.rangeRound([height, 0]);
	const xAxis = d3.axisBottom(xScale)
		.tickSize(_tickSize)
		.tickPadding(_tickPadding);
	const yAxis = d3.axisLeft(yScale)
		.tickSize(_tickSize)
		.tickPadding(_tickPadding);

	svg.append('text')
		.attr('class', 'x label')
		.attr('text-anchor', 'middle')
		.attr('x', _width / 2)
		.attr('y', _height - 70)
		.attr('fill', 'black')//set the fill here;
		.text(_xScaleLabel);

	svg.append('text')
		.attr('class', 'y label')
		.attr('text-anchor', 'middle')
		.attr('y', 0)
		.attr('dy', '-4.5em')
		.attr('x', -_height / 2 + 100)
		.attr('transform', 'rotate(-90)')
		.text(_yScaleLabel);


	const lineChart = d3.line()
		.x(d => xScale(d.key))
		.y(d => yScale(d.value));

	if (_isCurve) {
		lineChart.curve(d3.curveBasis);
	}

	g.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(xAxis);

	g.append('g').call(yAxis);

	g.append('g')
		.attr('fill', 'none')
		.attr('stroke-width', _lineWidth)
		.selectAll('path')
		.data(allKeys ? data : [data])
		.enter().append('path')
		.attr('stroke', (d, i) => i < _lineColors.length ? _lineColors[i] : _lineColor)
		.attr('d', lineChart);

	return d3n;
};
