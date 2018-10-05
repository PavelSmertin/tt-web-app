
<template>



  <svg v-bind:style="styleObject">


    <g 
		v-for="(node, index) in nodes"
		v-if="node.children == undefined">


		<rect v-on:click = "onNodeClick($event, node)" v-bind="rectPosition( node ) " >


			<animate 
				attributeName="width"
				dur="440ms" 
				repeatCount="1"
				keyTimes="0;
							1"
				calcMode="spline" 
				keySplines="0,0,1,1;"
				values="100px;
						1000px;"
			/>

			<animate 
				attributeName="height"
				dur="440ms" 
				repeatCount="1"
				keyTimes="0;
							1"
				calcMode="spline" 
				keySplines="0,0,1,1;"
				values="100px;
						1000px;"
			/>
		</rect>

		<text > 
			<tspan class="coin_name" v-bind="coinText( node, 220, 8 )">
				{{ node.data.coin_name}}
			</tspan>
			<tspan class="symbol" v-bind="coinText( node, 590, 25 )">
				{{ node.data.name}}
			</tspan>
			<tspan class="part" v-bind="coinText( node, 830, 13 )">
				{{ formatPrice( node.data.part * 100) }}%
			</tspan>
		</text>

		<text > 
			<tspan class="delta"  v-bind="coinText( node, 350, 20, true, -12 )">
				{{ formatPrice( node.data.delta * 100 ) }}%
			</tspan>
		</text>

    </g>


  </svg>

</template>

<script>
	import * as d3 from 'd3'
	import Jsona from 'jsona'

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

				let xPosition = (node.x0 * 100 / this.treewidth) + '%'
				let width = ((node.x1 - node.x0) * 100 / this.treewidth) + '%'
				let yPosition =  (node.y0 * 100 / this.treeheight) + '%'
				let height = ((node.y1 - node.y0) * 100 / this.treeheight) + '%'
				let fill = node.data.delta > 0 ? '#7DB312' : '#D95757'

				let delta = node.data.delta > 0 ? node.data.delta : -node.data.delta
				let fillOpacity = 1

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

			coinText: function( node, marginTop, fontSize, rightAlign = false, marginLeft = 6 ) {

				if( this.portrait === true ) {
					return {
						'x': node.x0  + '%',
						'y': rightAlign ? node.y1  + '%' : node.y0  + '%',
						'dx': marginLeft, 
						'dy': marginTop * node.data.part * 1.5, 
						'font-size': fontSize * node.data.part * 1.5 + 'em',
						'text-anchor': rightAlign ? 'end' : 'start',
					}
				} else {
					return {
						'x': rightAlign ? node.y1  + '%' : node.y0  + '%',
						'y': node.x0  + '%', 
						'dx': marginLeft, 
						'dy': marginTop * node.data.part * 1.5, 
						'font-size': fontSize * node.data.part * 1.5 + 'em',
						'text-anchor': rightAlign ? 'end' : 'start',
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

			onNodeClick: function(event, node ) {

				//event.path[0].firstChild.beginElement()

				this.$router.push('/ru/'+ node.data.name)
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
		return nodes.map( d => {return {'coin_name': d.coin_name, 'name': d.symbol, 'part': d.part, 'delta': d.part_change, 'value': d.amount_total_btc }; })
	}


</script>
<style>
    rect {
        stroke: #fff;
        stroke-width: 2px;
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
