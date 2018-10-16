
<template>

	<svg class="tt_portfolio_field" v-bind:style="styleObject">

		<svg 
			v-for="(node, index) in nodes"
			v-if="node.children == undefined"
			v-bind="rectPosition( node ) "
			v-on:click = "onNodeClick($event, node)"
			:id="node.data.name+'_svg'"
			>

			<rect :id="node.data.name+'_rect'" v-bind="rectStyle( node ) "></rect>

			<animate 
				:id="'width_animation_'+node.data.name"
				attributeName="width"
				dur="200ms" 
				to="100%"
				fill="freeze"
				restart="never"
				begin="click"
				:onend="onend"
			/>
			<animate 
				attributeName="height"
				dur="200ms" 
				to="100%"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				attributeName="x"
				dur="200ms" 
				to="0"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				attributeName="y"
				dur="200ms" 
				to="0"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				:xlink:href="'#'+node.data.name+'_rect'"
				attributeName="fill-opacity"
				dur="200ms" 
				to="1"
				fill="freeze"
				restart="never"
				begin="click"
				:id="'opacity_animation_'+node.data.name"
			/>

			<text class="coin_name" v-bind="coinTextFirst( node )">
				{{ node.data.coin_name}}
				<animate 
					attributeName="font-size"
					dur="200ms" 
					to="14"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dy"
					dur="200ms" 
					to="30"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>
			<text class="symbol" v-bind="coinTextSecond( node )">
				{{ node.data.name}}
				<animate 
					attributeName="font-size"
					dur="200ms" 
					to="48"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dy"
					dur="200ms" 
					to="74"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>
			<text class="part" v-bind="coinTextThird( node )">
				{{ formatPrice( node.data.part * 100) }}%
				<animate 
					attributeName="font-size"
					dur="200ms" 
					to="24"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"

				/>
				<animate 
					attributeName="dy"
					dur="200ms" 
					to="104"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>

			<text x="100%"> 
				<tspan class="delta" v-bind="coinTextDelta( node )" text-anchor="end">
					{{ formatPrice( node.data.delta * 100 ) }}%
					<animate 
						attributeName="font-size"
						dur="200ms" 
						to="0"
						fill="freeze"
						restart="never"
						:begin="'opacity_animation_'+node.data.name+'.begin'"
					/>
				</tspan>
			</text>
		</svg>

		<use id="useRect" ref="useRect" :xlink:href="'#_rect'" />
		<use id="useText" ref="useText" :xlink:href="'#_text'" />

	</svg>

</template>

<script>
	import * as d3 from 'd3'
	import Jsona from 'jsona'
	import _ from 'lodash'

	const REQUEST_PORTFOLIO = `/api/portfolio/free-coin-info?fields[portfolio-balance]=id,symbol,coin_name,part_change,part,amount_total_usdt,amount_total_btc,amount_total`

	const dataFormatter = new Jsona()

	export default {

		data() {
			return { 
				portrait: false,
				nodes: [],
			}
		},
		mounted() {
			this.portrait = document.getElementById('content').offsetWidth < document.getElementById('content').offsetHeight
			this.retrieveNodes
		},
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
			}
		},
		computed: {
			styleObject: function() {
			  return {width: '100%'}
			},
			async treemap() { return await this.calculateTree() },
			async retrieveNodes () {
			  var color = this.color;
			  var nodes = []

			  let treemap = await this.treemap
			  treemap.each(function(d) {
			    nodes.push(d);
			  })

			  this.nodes = nodes
			},

		},

		methods: {

			rectPosition: function( node ) {

				let xPosition = node.x0 + '%'
				let width = (node.x1 - node.x0) + '%'
				let yPosition =  node.y0 + '%'
				let height = (node.y1 - node.y0) + '%'

				if( this.portrait === true ) {
					return {
						'x': xPosition, 
						'width': width,
						'y': yPosition, 
						'height': height, 
					}
				} else {
					return {
						'x': yPosition, 
						'width': height,
						'y': xPosition, 
						'height': width, 
					}
				}
			},

			rectStyle: function( node ) {

				let fill = node.data.delta > 0 ? '#7DB312' : '#D95757'
				let delta = node.data.delta > 0 ? node.data.delta : -node.data.delta
				let fillOpacity = 1

			 	if( delta < 1 ) {
			 		fillOpacity = 0.75 + delta / 4
			 	}

				if( this.portrait === true ) {
					return {
						'x': 0, 
						'width': '100%',
						'y': 0, 
						'height': '100%', 
						'fill': fill,
						'fill-opacity': fillOpacity,
					}
				} else {
					return {
						'x': 0, 
						'width': '100%',
						'y': 0, 
						'height': '100%', 
						'fill': fill,
						'fill-opacity': fillOpacity,
					}
				}
			},

			coinTextFirst: function( node ) {

				const part = this.part( node.data.part )
				const marginTop = 16
				const fontSize = 14
				const marginLeft = 16

				return {
					'dx': marginLeft, 
					'dy': marginTop + fontSize * part, 
					'font-size': fontSize * part,
				}
			},

			coinTextSecond: function( node ) {

				const marginTop = -4
				const fontSize = 48
				const marginLeft = 16

				return {
					'dx': marginLeft, 
					'dy': this.coinTextFirst(node).dy + (marginTop + fontSize) * this.part( node.data.part ), 
					'font-size': fontSize * this.part( node.data.part ),
				}

			},

			coinTextThird: function( node ) {

				const part = this.part( node.data.part )
				const marginTop = 12
				const fontSize = 24
				const marginLeft = 16

				return {
					'dx': marginLeft, 
					'dy': this.coinTextSecond(node).dy + (marginTop + fontSize - 6) * part, 
					'font-size': fontSize * part,
				}
			},

			coinTextDelta: function( node ) {

				const part = this.part( node.data.part )
				const marginTop = 12
				const fontSize = 64
				const marginLeft = -16

				return {
					'dx': marginLeft, 
					'dy': marginTop + (fontSize - 2) * part, 
					'font-size': fontSize * part,
					'visibility': this.hidden( node.data.part ),
				}
			},

			part( value ) {
				let part = value * 15
				if ( part > 1 ) {
					part = 1
				}

				return part
			},

			hidden( value ) {
				let part = value * 15
				return part < 0.5 ? 'hidden' : 'visibility'
			},

			async calculateTree() {
				try {
					const data = await this.$axios.get( requestPortfolio(this.$store.state.filters) )

					// let dd = dataFormatter.deserialize( data.data )
					// dd = dd.map(el => el.part)
					// var sum = dd.reduce(add, 0);
					// console.log(sum)

					let dataObj = simpleNodes(dataFormatter.deserialize( data.data ))

					let root = d3.hierarchy({"name": "A", "children": dataObj })
									.sum(function(d) {
										return d.value * 100
									})

					return d3.treemap()
						.size( [this.treewidth, this.treeheight] )
						.tile(d3.treemapBinary)
						.round(true)
						.padding(0)( root )

				} catch(error) {
					console.error(error)
				}
			},

			onNodeClick: function(event, node ) {

				document.getElementById('useRect').setAttribute("xlink:href", "#" + node.data.name + "_svg")
				document.getElementById('useText').setAttribute("xlink:href", "#" + node.data.name + "_text")

				//event.path[0].firstChild.beginElement()

				//this.$router.push('/ru/'+ node.data.name)
				this.$emit('node_click', node, this)
			},

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},

			onend() {
				console.log('event1')
			}
		},

		watch: {
			'$store.state.filters': {
				handler: _.debounce( function ( newValue ) {
					this.calculateTree()
				}, 100 ),
				deep: true
			}
		},

	}

	function add(a, b) {
	    return a + b
	}

	function requestPortfolio( filters ) {
		let filterQuery = 
			( filters.cap ? '&cap=' + filters.cap : '' ) + 
			( filters.period ? '&period=' + filters.period : '' ) +
			( filters.profit ? '&profit=' + filters.profit : '' )

		return REQUEST_PORTFOLIO + filterQuery
	}

	function hierarchyNodes( nodes ) {


		if( nodes.length == 0 ) {
			return {}
		}

		let node = nodes.shift()

		if(node.part < 0.01) {
			return hierarchyNodes( nodes )
		}

		if( nodes.length == 1 ) {
			return {'name': node.symbol, 'value': node.amount_total_btc }
		}

		return {'name': '', 'children': [
										{'name': node.symbol, 'value': node.amount_total_btc }, 
										hierarchyNodes( nodes )]
			 	} 
	}

	function simpleNodes( nodes ) {
		return nodes.map( d => {return {'coin_name': d.coin_name, 'name': d.symbol, 'part': d.part, 'delta': d.part_change, 'value': d.part }; })
	}


</script>

<style>
	rect {
		stroke: #fff;
		stroke-width: 2px;
		cursor: pointer;
	}

	.coin_name, .symbol, .part {
		fill: #000;
		font-weight: 100;
	}
	.part {
		opacity: 0.4;
	}
	.delta {
		fill: #fff;
		font-weight: 100;
	}
</style>
