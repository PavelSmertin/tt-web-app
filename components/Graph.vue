
<template>

		<svg viewBox="0 -40 100 150" preserveAspectRatio="none" >
				<defs>
				<linearGradient id="GradientPrice" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="#fff"/>
					<stop offset="20%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
				<linearGradient id="GradientPart" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="#000"/>
					<stop offset="15%" stop-color="#000" stop-opacity="0"/>
				</linearGradient>
			</defs>


			<path class="linePrice" :d="linePrice" vector-effect="non-scaling-stroke" />		
 			<path class="areaPrice" :d="areaPrice"  vector-effect="non-scaling-stroke"/>


			<path class="linePart" :d="linePart" vector-effect="non-scaling-stroke" />		
 			<path class="areaPart" :d="areaPart"  vector-effect="non-scaling-stroke"/>

		</svg>


</template>

<script>
	import * as d3 from 'd3'

	export default {

		props: {
			sizefield: {
			  type: String,
			  default: 'size'
			},
			treewidth: {
			  type: Number,
			  default: 100
			},
			treeheight: {
			  type: Number,
			  default: 100
			},
			tile: {
			  type: Function,
			  default: d3.treemapSquarify
			},
			depth: {
			  type: Number,
			  default: 2
			},
			color: {
			  type: Function,
			    default: d3.scaleOrdinal(d3.schemeCategory10)
			},
			symbol: {
			  type: String,
			  default: 'BTC'
			},
		},

		data() {
			return {
				data: [99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92, 99, 171, 78, 25, 36, 92],
				linePrice: '',
				areaPrice: '',
				linePart: '',
				areaPart: '',
			}
		},

		methods: {


			getScales(data) {

				const x = d3.scaleTime().range([0, 100])
				const y = d3.scaleLinear().range([100, 0])


				d3.axisLeft().scale(x)
				d3.axisBottom().scale(y)

				x.domain(d3.extent(data, (d, i) => i))
				y.domain([d3.min(data, d => d), d3.max(data, d => d)])
				return { x, y }
			},
			calculate(data) {
				const scale = this.getScales(data)
				const path = d3.line()
									.curve(d3.curveCardinal)
									.x((d, i) => scale.x(i))
									.y(d => scale.y(d))

				const area = d3.area()
									.curve(d3.curveCardinal)
									.x((d, i) => scale.x(i))
									.y0(d => 1000)
									.y1(d => scale.y(d))


				return { path: path(data), area: area(data) }
			},
		},

		watch: {
			'$store.state.graphs': {
				handler: function ( newValue ) {
					let lineData = this.$store.state.graphs[this.symbol]
					if(lineData == undefined) {
						return
					}
					this.lineArray = lineData.map(el => el.price_usdt)
					this.partArray = lineData.map(el => el.part)
					let chartPrice = this.calculate(this.lineArray)
					let chartPart = this.calculate(this.partArray)
					this.linePrice = chartPrice.path
					this.areaPrice = chartPrice.area
					this.linePart = chartPart.path
					this.areaPart = chartPart.area	
				},
				deep: true
			}
		},
	}

</script>


<style lang="sass" scoped>

	.linePrice 
		fill: none
		stroke: #fff
		stroke-width: 1px

	.linePart
		fill: none
		stroke: #000
		opacity: 0.2
		stroke-width: 1px


	rect:hover, rect:active
		outline: 1px solid red;

	.areaPrice
		fill: url(#GradientPrice)
		opacity: 0.2

	.areaPart
		fill: url(#GradientPart)
		opacity: 0.2

	
</style>

