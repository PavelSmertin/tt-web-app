
<template>
  <svg v-bind:style="styleObject">


    <g
		v-for="(node, index) in nodes"
		v-if="node.children == undefined">
		<rect v-on:click = "onNodeClick(node)" v-bind="position( node ) " ></rect>

		<text 

			v-bind="textPosition( node )"> 
			<tspan v-bind="pricePosition( node )" fill="#000">
				{{ node.data.name}}
			</tspan>
			<tspan v-bind="pricePosition( node )" fill="#000">
				{{ formatPrice( node.data.part * 100) }}%
			</tspan>
		</text>

		<text v-bind="deltaPosition( node )"  fill="#fff"> 
			<tspan>
				{{ formatPrice( node.data.delta * 100 ) }}%
			</tspan>
		</text>

    </g>


  </svg>

</template>

<script>
	import * as d3 from 'd3'
	import Jsona from 'jsona'

	const REQUEST_PORTFOLIO = `/api/portfolio/free-coin-info?fields[portfolio-balance]=id,symbol,coin_name,change24h,part,amount_total_usdt,amount_total_btc,amount_total`


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
			position: function( node ) {

				let xPosition = (node.x0 * 100 / this.treewidth) + '%'
				let width = ((node.x1 - node.x0) * 100 / this.treewidth) + '%'
				let yPosition =  (node.y0 * 100 / this.treeheight) + '%'
				let height = ((node.y1 - node.y0) * 100 / this.treeheight) + '%'
				let fill = node.data.delta > 0 ? '#7DB312' : '#D95757'

				let delta = node.data.delta > 0 ? node.data.delta : -node.data.delta
				let fillOpacity = 1
				// if( delta > 0 && delta < 0.1) { 
				// 	fillOpacity = 0.65 + delta / 0.4
				// }
			 // 	if(delta >= 0.1 && delta < 1) {
			 // 		fillOpacity = 0.9 + delta / 10
			 // 	}

			 	if( delta < 1 ) {
			 		fillOpacity = 0.75 + delta / 4
			 	}

				if( this.portrait === true ) {
					return {
						'x': xPosition, 
						'width': width,
						'y': yPosition, 
						'height': height, 
						'fill': fill,
						'fill-opacity': fillOpacity,
					}
				} else {
					return {
						'x': yPosition, 
						'width': height,
						'y': xPosition, 
						'height': width, 
						'fill': fill,
						'fill-opacity': fillOpacity,
					}
				}
			},

			textPosition: function( node ) {

				if( this.portrait === true ) {
					return {
						'x': node.x0  + '%', 
						'y': node.y0  + '%', 
					}
				} else {
					return {
						'x': node.y0  + '%', 
						'y': node.x0  + '%', 
					}
				}
			},

			deltaPosition: function( node ) {

				let xPosition = node.x0
				let width = node.x1
				let yPosition = node.y0
				let height = node.y1

				if( this.portrait === true ) {
					return {
						'x': node.x0  + '%', 
						'y': node.y1  + '%',
						'dx': '-6', 

						'dy': 350 * node.data.part, 
						'font-size': 20 * node.data.part + 'em',

						'text-anchor': 'end',
					}
				} else {
					return {
						'x': node.y1  + '%', 
						'y': node.x0  + '%',
						'dx': '-6', 

						'dy': 350 * node.data.part,
						'font-size': 20 * node.data.part + 'em',

						'text-anchor': 'end',
					}
				}
			},

			pricePosition: function( node ) {

				if( this.portrait === true ) {
					return {
						'x': node.x0  + '%', 
						'dx': '6', 
						'dy': 350 * node.data.part, 
						'font-size': 20 * node.data.part + 'em',

					}
				} else {
					return {
						'x': node.y0  + '%',
						'dx': '6', 
						'dy': 350 * node.data.part, 
						'font-size': 20 * node.data.part + 'em',
					}
				}
			},

			async calculateTree() {

				try {
					const data = await this.$axios.get( requestPortfolio(this.$store.state.filters) )
					let dataObj = simpleNodes(dataFormatter.deserialize( data.data ))

					let root = d3.hierarchy({"name": "A", "children": dataObj })
									.sum(function(d) {
										return d.value
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
			onNodeClick: function(node) {
			  this.$emit('node_click', node, this)
			},

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},
		}
	}


	function requestPortfolio( filters ) {
		let filterQuery = ''
			// (filters.type ? '&filters[news-translated][type]=' + filters.type : '') + 
			// (filters.symbol ? '&filters[portfolio-coins][symbol]=' + upSymbol(filters.symbol) : '')

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
		return nodes.map( d => {return {'name': d.symbol, 'part': d.part, 'delta': d.change24h, 'value': d.amount_total_btc }; })
	}


</script>
<style>
    rect {
        stroke: #fff;
        stroke-width: 2px;
    }
</style>
