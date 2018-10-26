
<template>
	<svg ref="graph" class="lines" @mousemove="mouseover" @mouseleave="mouseleave" :viewBox="viewBox" preserveAspectRatio="none" >
		<rect  :width="graphWidth" :height="graphHeight*1.6" fill-opacity="0" stroke-opacity="0" />
		<path :transform="translate" class="linePrice" :d="linePrice" vector-effect="non-scaling-stroke" />		
		<path :transform="translate" class="areaPrice" :d="areaPrice" vector-effect="non-scaling-stroke" />
		<path :transform="translate" class="linePart" :d="linePart" vector-effect="non-scaling-stroke" />		
		<path :transform="translate" class="areaPart" :d="areaPart" vector-effect="non-scaling-stroke" />
		<line v-if="interactive" class="selector" v-bind="verticalLine()"  vector-effect="non-scaling-stroke" />
	</svg>
</template>

<script>
	import * as d3 from 'd3'

	let bisectDate = d3.bisector(function(d) { return d.date; }).right

	export default {

		props: {
			symbol: {
				type: String,
				default: 'BTC'
			},
			interactive: {
				type: Boolean,
				default: false
			}

		},

		data() {
			return {
				points: [],
				linePrice: '',
				areaPrice: '',
				linePart: '',
				areaPart: '',
				selector: '',
				areaSelector: '',
				lastHoverDate: {},
				verticalLinePosition: {},
				graphWidth: 100,
				graphHeight: 100,

			}
		},

		mounted() {
			if( this.$parent.$refs.chart ) {
				this.graphWidth = this.$parent.$refs.chart.offsetWidth
				this.graphHeight = this.$parent.$refs.chart.offsetHeight
			}

			if(this.$store.state.graphs[ this.symbol ]) {
				this.init()
			}
			window.addEventListener('resize', this.handleResize)
			this.handleResize();
		},

			destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},


		computed: {
			viewBox() {
				return `0 0 ${this.graphWidth} ${this.graphHeight*1.6}`
			},
			translate() {
				return `translate(0,${this.graphHeight/2})`
			},
		},

		methods: {

			handleResize() {
			},

			init() {
				this.initPoints()
				this.initLines()


				let date = d3.scaleTime().range([0, this.graphWidth])
				let price = d3.scaleLinear().range([this.graphHeight, 0])
				let part = d3.scaleLinear().range([this.graphHeight, 0])

				let dateAxis = d3.axisBottom(date).tickFormat(d => this.formatDateTime(d))
				let priceAxis = d3.axisLeft(price).tickFormat(d => "$" + this.formatPrice(d, 0)).ticks(5)
				let partAxis = d3.axisRight(part).tickFormat(d => this.formatPrice(d * 100)+"%").ticks(5)

				date.domain(d3.extent(this.points, el => el.date))
				price.domain(d3.extent(this.points, el => el.price))
				part.domain(d3.extent(this.points, el => el.part))

				let svg = d3.select(".graph")
				svg.selectAll("g").remove()

				// append bottom axis
				let g = svg.append("g")

				g.attr("transform", "translate(0, " + (this.graphHeight-25) + ")")
				      	.attr("vector-effect", "non-scaling-stroke")
				      	.call(dateAxis)

				g.selectAll("line").attr("stroke", "none")
				g.selectAll("path").attr("stroke", "none")
				g.selectAll(".tick text").attr("x", 4).attr("fill", "#fff")

				// append left axis
				g = svg.append("g")

				g//.attr("transform", "translate(0," + (this.graphHeight-25) + ")")
				      	.attr("vector-effect", "non-scaling-stroke")
				      	.call(partAxis)

				g.selectAll("line").attr("stroke", "none")
				g.selectAll("path").attr("stroke", "none")
				g.selectAll(".tick text").attr("fill", "#fff").attr("y", "10").attr("transform", "rotate(-90)")


				// append right axis
				g = svg.append("g")

				g.attr("transform", "translate(" + (this.graphWidth) + ",0 )")
				      	.attr("vector-effect", "non-scaling-stroke")
				      	.call(priceAxis)

				g.selectAll("line").attr("stroke", "none")
				g.selectAll("path").attr("stroke", "none")
				g.selectAll(".tick text").attr("text-anchor", "end").attr("y", "-10").attr("fill", "#fff").attr("transform", "rotate(-90)")

			},

			getScales() {
				let date = d3.scaleTime().range([0, this.graphWidth])
				let price = d3.scaleLinear().range([this.graphHeight, 0])
				let part = d3.scaleLinear().range([this.graphHeight, 0])

				let dateAxis = d3.axisBottom(date).tickFormat(function(d){ return d.date;});
				let priceAxis = d3.axisLeft(price)
				let partAxis = d3.axisRight(part)

				date.domain(d3.extent(this.points, el => el.date))
				price.domain(d3.extent(this.points, el => el.price))
				part.domain(d3.extent(this.points, el => el.part))

				return { date, price, part }
			},

			initPoints() {
				let lineData = this.$store.state.graphs[ this.symbol ]
				if( lineData ) {
					this.points = lineData.map( el => { return { date: new Date(el.created_at), price: el.price_usdt, part: el.part }  })
				}
			},

			initLines() {

				let scale = this.getScales()

				const pathPrice = d3.line()
									.curve(d3.curveBasis)
									.x(d => scale.date(d.date))
									.y(d => scale.price(d.price))

				const areaPrice = d3.area()
									.curve(d3.curveBasis)
									.x(d => scale.date(d.date))
									.y0(d => this.graphHeight * 2)
									.y1(d => scale.price(d.price))

				this.linePrice = pathPrice( this.points )
				this.areaPrice = areaPrice( this.points )

				const pathPart = pathPrice.y(d => scale.part(d.part))
				const areaPart = areaPrice.y1(d => scale.part(d.part))

				this.linePart = pathPart(this.points)
				this.areaPart = areaPart(this.points)
			},

			mouseover({ offsetX, offsetY }) {

				const scales = this.getScales()
				const svg = this.$refs.graph
				const pt = svg.createSVGPoint()
				pt.x = offsetX
				pt.y = offsetY
				const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse())

				if (this.points && this.points.length > 0) {
					let closestDate = this.getClosestDate(scales.date.invert(svgPoint.x));


					let index = bisectDate(this.points, scales.date.invert(svgPoint.x))

					let closestPoint = this.points[index-1]

					if(closestPoint == undefined) {
						return
					}


					//if (this.lastHoverDate.index !== closestDate.index) {
						//const points = this.points.slice( closestDate.index, closestDate.index + 1 )

						this.verticalLinePosition = { 
							x: svgPoint.x, 
							y: svgPoint.y, 
							date: closestPoint.date, 
							price: closestPoint.price,
							part: closestPoint.part,
							offsetX: offsetX,
							offsetY: offsetY,
						}

						this.$emit('testtest', this.verticalLinePosition )
						
					//	this.lastHoverDate = closestDate;
					//}
				}
			},

			mouseleave() {
				this.$emit('hide-tooltip' )
			},

			getClosestDate(date) {
				return this.points
					.map((point, index) => {

							return { 
								date: point.date,
								diff: Math.abs(point.date - date),
								index,
							}
						})
						.reduce((memo, val) => (memo.diff < val.diff ? memo : val))
			},

			verticalLine() {
				return {
					'x1': this.verticalLinePosition.x,
					'x2': this.verticalLinePosition.x,
					'y1': 0,
					'y2': this.graphHeight*2,
				}
			},

			circlePoint() {
				return {
					'cx': this.verticalLinePosition.x,
					'cy': this.verticalLinePosition.y,
					'r': 0.4,

				}
			},

			formatDateTime( dateString ) {
				let date = new Date(dateString)
				let month = date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				return `${date.getDate()}.${month} ${hour}:${min}`
			},

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},

		},

		watch: {
			'$store.state.graphs': {
				handler: function ( newValue ) {
					this.init()
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



	.areaPrice
		fill: url(#GradientPrice)
		opacity: 0.3

	.areaPart
		fill: url(#GradientPart)
		opacity: 0.2

	.selector
		stroke: #fff
		opacity: 1
		stroke-width: 1px

	.graph_point
		fill: #fff
	
</style>

