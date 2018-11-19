
<template>
	<svg>
		<svg ref="graph" class="lines" @mousemove="mouseover" @mouseleave="mouseleave" :viewBox="viewBox" preserveAspectRatio="none" >
			<rect  :width="graphWidth" :height="graphHeight*1.6" fill-opacity="0" stroke-opacity="0" />
			<path :transform="translate" class="linePart" :stroke="first.color" :d="linePart" ref="linePart" vector-effect="non-scaling-stroke" />
			<path :transform="translate" class="areaPart" :fill="'url(#'+first.gradient+')'" :d="areaPart" vector-effect="non-scaling-stroke" />
			<path :transform="translate" class="linePrice" :stroke="second.color" :d="linePrice" ref="linePrice" vector-effect="non-scaling-stroke" />
			<path :transform="translate" class="areaPrice" :fill="'url(#'+second.gradient+')'" :d="areaPrice" vector-effect="non-scaling-stroke" />
			<line v-if="interactive" class="selector" v-bind="verticalLine()"  vector-effect="non-scaling-stroke" />
		</svg>

		<svg v-if=" interactive && points && points.length > 0"  v-bind="legend()">
			<g>
				<circle v-bind="partLegendMarker()" r="6" :fill="first.color" vector-effect="non-scaling-stroke"/>
				<text class="tooltip_label" v-bind="partLegendLabel()" fill="#000" vector-effect="non-scaling-stroke">
					{{ first.label }}
				</text>

				<circle v-bind="priceLegendMarker()" r="6" :fill="second.color" fill-opacity="0.5" vector-effect="non-scaling-stroke"  />
				<text class="tooltip_label" v-bind="priceLegendLabel()" fill="#000" vector-effect="non-scaling-stroke">
					{{ second.label }}
				</text>
			</g>
		</svg>

		<circle v-if="interactive" v-bind="markerPrice()" />
		<circle v-if="interactive" v-bind="markerPart()" />

	</svg>
</template>

<script>
	import * as d3 from 'd3'

	let bisectDate = d3.bisector(function(d) { return d.date; }).right

	const TYPE_DINAMIC_PORTFOLIO 	= 'dinamic_portfolio'
	const TYPE_UNIQ_PORTFOLIO 		= 'uniq_portfolio'
	const TYPE_AVG_PORTFOLIO 		= 'avg_portfolio'

	export default {

		props: {
			symbol: {
				type: String,
				default: 'BTC'
			},
			type: {
				type: String,
				default: 'avg_portfolio'
			},
			interactive: {
				type: Boolean,
				default: false
			},
			first: {
				type: Object,
				default: () => ({color: '#fff', gradient: 'GradientPart', opacity: 0.3, })
			},
			second: {
				type: Object,
				default: () => ({color: '#000', gradient: 'GradientPrice', opacity: 0.2, })
			},
			primaryColor: {
				type: String,
				default: '#fff'
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
				lastHoverIndex: 0,
				verticalLinePosition: {},
				markerPricePosition: {},
				markerPartPosition: {},
				graphWidth: 100,
				graphHeight: 100,

			}
		},

		mounted() {
			this.isDevice = document.getElementById('content').offsetWidth < 769

			if ( this.$parent.$refs.graphWrap ) {
				let offset = this.$parent.$refs.graphWrap.getBoundingClientRect()
				this.graphWidth = offset.width
				this.graphHeight = offset.height
			}

			if( this.getGraph() ) {
				this.init()
			}

			if( this.first.label == undefined ) {
				this.first.label = this.$t('coin.part')
			}

			if( this.second.label == undefined ) {
				this.second.label = this.$t('coin.price')
			}

			window.addEventListener('resize', this.handleResize)
			this.handleResize()
		},

		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},


		computed: {
			viewBox() {
				return `0 0 ${this.graphWidth} ${this.graphHeight * 1.6}`
			},
			translate() {
				return `translate(0, ${this.graphHeight / 2})`
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

				let dateAxis = d3.axisBottom(date).tickFormat(d => this.formatDateTime(d)).ticks(3)
				let priceAxis = d3.axisRight(price).tickFormat(d => "$" + this.formatPrice(d, 0)).ticks(5)
				let partAxis = d3.axisRight(part).tickFormat(d => this.formatPrice(d * 100)+"%").ticks(5)

				date.domain(d3.extent(this.points, el => el.date))
				price.domain(d3.extent(this.points, el => el.price))
				part.domain(d3.extent(this.points, el => el.part))

				let svg = d3.select(".graph")

				svg.selectAll(".axis").remove()

				if( !this.isDevice ) {
					// append bottom axis
					let bottomAxisSvg = svg.append("svg")

					bottomAxisSvg
							.attr("viewBox", `0 0 ${this.graphWidth} 20`)
							.attr("vector-effect", "non-scaling-stroke")
							.attr("class", "axis")
							.attr("preserveAspectRatio", "xMidYMax meet")
							.call(dateAxis)

					bottomAxisSvg.selectAll("line").attr("stroke", "none")
					bottomAxisSvg.selectAll("path").attr("stroke", "none")
					bottomAxisSvg.selectAll(".tick text").attr("x", 4).attr("fill", "#fff")
				}

				// append left axis
				let leftAxisSvg = svg.append("svg")

				leftAxisSvg
						.attr("viewBox", `0 0 20 ${this.graphHeight}`)
				      	.attr("vector-effect", "non-scaling-stroke")
				      	.attr("class", "axis")
				      	.attr("preserveAspectRatio", "xMinYMin meet")
				      	.call(partAxis)

				leftAxisSvg.selectAll("line").attr("stroke", "none")
				leftAxisSvg.selectAll("path").attr("stroke", "none")
				leftAxisSvg.selectAll(".tick text").attr("fill", "#fff").attr("y", "10").attr("transform", "rotate(-90)")


				// append right axis
				let rightAxisSvg = svg.append("svg")

				rightAxisSvg
					.attr("viewBox", `0 0 20 ${this.graphHeight}`)
					.attr("vector-effect", "non-scaling-stroke")
					.attr("class", "axis")
					.attr("preserveAspectRatio", "xMaxYMin meet")
					.call(priceAxis)

				rightAxisSvg.selectAll("line").attr("stroke", "none")
				rightAxisSvg.selectAll("path").attr("stroke", "none")
				rightAxisSvg.selectAll(".tick text").attr("y", "10").attr("fill", "#fff").attr("transform", "rotate(-90)")

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
				let lineData = this.getGraph()
				this.points = []
				if( lineData ) {
					this.points = lineData.map( el => { 
						return { 
							date: 	new Date(el.created_at), 
							price: 	this.type == TYPE_DINAMIC_PORTFOLIO ? el.total_cap : el.price_usdt, 
							part: 	this.type == TYPE_DINAMIC_PORTFOLIO ? el.cap_change : el.part }  
						})
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
									.y0(d => this.graphHeight * 1.6)
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

				if( svg == undefined) {
					return
				}

				let pt = svg.createSVGPoint()
				pt.x = offsetX
				pt.y = offsetY
				const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse())

				let markerPricePosition = this.findYatX(svgPoint.x, this.$refs.linePrice) // svg reper
				let markerPartPosition 	= this.findYatX(svgPoint.x, this.$refs.linePart) // svg reper

				this.markerPricePosition = this.convertCoords(markerPricePosition.x, markerPricePosition.y, this.$refs.linePrice.getScreenCTM())
				this.markerPartPosition 	= this.convertCoords(markerPartPosition.x, markerPartPosition.y, this.$refs.linePart.getScreenCTM())

				if (this.points && this.points.length > 0) {

					let index = bisectDate(this.points, scales.date.invert(svgPoint.x))

					let closestPoint = this.points[index-1]

					if(closestPoint == undefined) {
						return
					}

					this.verticalLinePosition = { 
						x: svgPoint.x, 
						y: svgPoint.y, 
						date: closestPoint.date, 
						price: closestPoint.price,
						part: closestPoint.part,
						offsetX: this.markerPartPosition.x,
						offsetY: (this.markerPartPosition.y + this.markerPricePosition.y) / 2,
					}

					this.$emit('testtest', this.verticalLinePosition )
				}
			},

			mouseleave() {
				this.$emit('hide-tooltip' )
			},

			verticalLine() {
				return {
					'x1': this.verticalLinePosition.x,
					'x2': this.verticalLinePosition.x,
					'y1': 0,
					'y2': this.graphHeight * 1.6,
					'stroke': this.primaryColor,
				}
			},

			circlePoint() {
				return {
					'cx': this.verticalLinePosition.x,
					'cy': this.verticalLinePosition.y,
					'r': 0.4,

				}
			},

			legend() {
				return {
					'x': 24,
					'y': this.isDevice ? 0 : -this.graphHeight / 30,
					'viewBox': `0 0 ${this.graphWidth} 24`,
					'preserveAspectRatio': "xMinYMax meet",

				}
			},

			markerPrice () {
				return {
					'cx': this.markerPricePosition.x,
					'cy': this.markerPricePosition.y,
					'r': 3,
					'stroke': 'none',
					'fill': this.second.color,
					'fill-opacity': 0.5,
				}
			},

			markerPart () {
				return {
					'cx': this.markerPartPosition.x,
					'cy': this.markerPartPosition.y,
					'r': 3,
					'stroke': 'none',
					'fill': this.first.color,
					'fill-opacity': 1,


				}
			},

			partLegendMarker() {
				return {
					'cx': 10,
					'cy': 6,
				}
			},
			partLegendLabel() {
				return {
					'x': 24,
					'y': 11,
					'font-size': 12,
				}

			},
			priceLegendMarker() {
				return {
					'cx': 200,
					'cy': 6,

				}

			},
			priceLegendLabel() {
				return {
					'x': 214,
					'y': 11,
					'font-size': 12,
				}

			},

			formatDateTime( dateString ) {
				let date 	= new Date(dateString)
				let day 	= date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				let hour 	= date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let min 	= date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				return `${day}.${month} ${hour}:${min}`
			},

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},

			findYatX(x, linePath) {
				let beginning = 0,
					pos,
					end = linePath.getTotalLength(),
					target = null

				while (true){
					target = Math.floor((beginning + end) / 2)
					pos = linePath.getPointAtLength(target)

					if ((target === end || target === beginning) && Math.floor(pos.x) !== Math.floor(x)) {
						return pos
					}
					if (Math.floor(pos.x) > Math.floor(x))  {
						end = target
					} else if (Math.floor(pos.x) < Math.floor(x)) { 
						beginning = target
					} else  { //position found
						return pos
					} 
				}

			},

			convertCoords( x, y, matrix ) {
				let offset = this.$refs.graph.getBoundingClientRect()
				return {
					x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
					y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
				}
			},

			getGraph() {
				if( this.type == TYPE_AVG_PORTFOLIO ) {
					return this.$store.state.graphs[ this.symbol ]
				}				
				if( this.type == TYPE_UNIQ_PORTFOLIO ) {
					return this.$store.state.graphsUniq[ this.symbol ]
				}
				if( this.type == TYPE_DINAMIC_PORTFOLIO ) {
					return this.$store.state.graphDinamic
				}
			},
		},

		watch: {
			'$store.state.graphs': {
				handler: function ( newValue ) {
					this.init()
				},
				deep: true
			},

			'$store.state.graphsUniq': {
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
		opacity: 0.2
		stroke-width: 1px

	.linePart
		fill: none
		stroke-width: 1px

	.areaPrice
		opacity: 0.2

	.areaPart
		opacity: 0.3

	.selector
		opacity: 1
		stroke-width: 1px

	.tick 
		opacity: 0
		font-size: 36px
		text
			font-size: 36px
	
</style>

