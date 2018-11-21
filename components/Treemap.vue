
<template>

	<svg class="tt_treemap" width="100%">

		<text class="symbol" y="50%" x="50%" v-bind="noDataVisible">
			{{ $t('coin.no_data') }}
		</text>

		<svg 
			v-for="(node, index) in nodes"
			v-if="node.children == undefined"
			v-bind="rectPosition( node ) "
			v-on:click = "onNodeClick($event, node)"
			:id="node.data.name+'_svg'"
			>

			<defs>
				<linearGradient id="GradientPrice" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#000"/>
					<stop offset="15%" stop-color="#000" stop-opacity="0"/>
				</linearGradient>
				<linearGradient id="GradientPart" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#fff"/>
					<stop offset="15%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
			</defs>

			<rect :id="node.data.name+'_rect'" v-bind="rectStyle( node ) "></rect>

			<Graph :type="type" :symbol="node.data.name" />

			<animate 
				:id="'width_animation_'+node.data.name"
				attributeName="width"
				:dur="animationDurable" 
				to="100%"
				fill="freeze"
				restart="never"
				begin="click"
				:onend="onend()"
			/>
			<animate 
				attributeName="height"
				:dur="animationDurable" 
				to="100%"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				attributeName="x"
				:dur="animationDurable" 
				to="0"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				attributeName="y"
				:dur="animationDurable" 
				to="0"
				fill="freeze"
				restart="never"
				begin="click"
			/>
			<animate 
				:xlink:href="'#'+node.data.name+'_rect'"
				attributeName="fill-opacity"
				:dur="animationDurable" 
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
					:dur="animationDurable" 
					to="14"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dy"
					:dur="animationDurable" 
					to="30"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dx"
					:dur="animationDurable" 
					to="64"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>
			<text class="symbol" v-bind="coinTextSecond( node )">
				{{ node.data.name}}
				<animate 
					attributeName="font-size"
					:dur="animationDurable" 
					to="48"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dy"
					:dur="animationDurable" 
					to="74"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dx"
					:dur="animationDurable" 
					to="64"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>
			<text class="part" v-bind="coinTextThird( node )">
				{{ formatPrice( node.data.part * 100) }}%
				<animate 
					attributeName="font-size"
					:dur="animationDurable" 
					to="24"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"

				/>
				<animate 
					attributeName="dy"
					:dur="animationDurable" 
					to="104"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
				<animate 
					attributeName="dx"
					:dur="animationDurable" 
					to="64"
					fill="freeze"
					restart="never"
					:begin="'opacity_animation_'+node.data.name+'.begin'"
				/>
			</text>

			<text v-bind="coinTextDeltaWrap( node )"> 
				<tspan class="delta" v-bind="coinTextDeltaIcon( node )" v-html="getSign(node)">
					<animate 
						attributeName="font-size"
						:dur="animationDurable"
						to="0"
						fill="freeze"
						restart="never"
						:begin="'opacity_animation_'+node.data.name+'.begin'"
					/>
				</tspan>
				<tspan class="delta" v-bind="coinTextDelta( node )">
					{{ formatPrice( node.data.delta * 100 ) }}
					<animate 
						attributeName="font-size"
						:dur="animationDurable"
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

<!-- 		<svg width="100%" height="64" y="12" viewBox="0 0 64 64" preserveAspectRatio="xMaxYMin meet">
			<circle cx="24" cy="24" r="18" fill="#FFFFFF" fill-rule="evenodd"></circle>
			<polygon points="19 19.8 23.2 24.0000063 19 28.2 19.8 29 24 24.8 28.2 29 29 28.2 24.8 24.0000063 29 19.8 28.2 19 24 23.2 19.8 19" />
		</svg> -->

	</svg>


</template>

<script>
	import * as d3 from 'd3'
	import Jsona from 'jsona'
	import _ from 'lodash'
	import Graph from '~/components/Graph.vue'

	const dataFormatter = new Jsona()

	export default {

		data() {
			return { 
				portrait: false,
				animationDurable: '50ms',
				nodes: [],
				graphs: [],
				hasData: true,
			}
		},

		mounted() {
			this.portrait = document.getElementById('content').offsetWidth < document.getElementById('content').offsetHeight
			this.isDevice = document.getElementById('content').offsetWidth < 769

			this.retrieveNodes

			if( Object.keys(this.$store.state.graphs).length <= 0 ) {
				this.retrieveGraphs
			}
		},

		props: {
			requestPortfolio: {
				type: String,
				default: `/api/portfolio/free-coin-info?fields[portfolio-balance]=id,symbol,coin_name,part_change,part,amount_total_usdt,amount_total_btc,amount_total`
			},
			requestGraphs: {
				type: String,
				default: `/api/portfolios/coin-graph`
			},

			type: {
				type: String,
				default: 'avg_portfolio'
			},

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

			async treemap() { return await this.calculateTree() },

			async retrieveNodes () {
				var nodes = []

				let treemap = await this.treemap

				if( treemap ) {
					treemap.each(function(d) {
						nodes.push(d);
					})

					this.nodes = nodes
					this.hasData = true
				} else {
					this.nodes = []
					this.hasData = false
				}
			},

			async retrieveGraphs () {
				var nodes = []

				try {
					const data = await this.$axios.get( request(this.requestGraphs, this.$store.state.filters) )

					if( this.type == 'uniq_portfolio') {
						this.$store.commit( 'SET_GRAPHS_UNIQ', data.data )
					}

					if( this.type == 'avg_portfolio') {
						this.$store.commit( 'SET_GRAPHS', data.data )
					}

				} catch(e) {
					if( e.response && e.response.status == 403 ) {
						this.$toast.show(this.$t('account.permission_denied'), {
							duration: null,
							action : {
								text : 'Ok',
								onClick : (e, toastObject) => {
									toastObject.goAway(0)
								}
							},
		    			})
					}
					console.error(e)
				}

			},

			noDataVisible () {
				return {
					'visibility': this.hasData ? 'hidden' : 'visibility',
				}
			},
		},

		components: {
			Graph,
		},

		methods: {

			rectPosition: function( node ) {

				let xPosition = node.x0 ? node.x0 + '%' : 0
				let width = (node.x1 - node.x0) ? (node.x1 - node.x0) + '%' : 0
				let yPosition =  node.y0 ? node.y0 + '%' : 0
				let height = (node.y1 - node.y0) ? (node.y1 - node.y0) + '%' : 0

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

				const partCoinText = this.partCoinText( node.data.part )
				const part = this.part( node.data.part )
				const margin = this.isDevice ? 8 : 16
				const fontSize = 14

				return {
					'dx': part ? margin * part : margin, 
					'dy': this.isDevice ? 3 * part : (part ? margin * part + fontSize * partCoinText : 50), 
					'font-size': this.isDevice ? 0 : (partCoinText ? fontSize * partCoinText : fontSize),
				}
			},

			coinTextSecond: function( node ) {

				const partCoinText = this.partCoinText( node.data.part )
				const part = this.part( node.data.part )

				const marginTop = -4
				const fontSize = 48
				const margin = this.isDevice ? 8 : 16

				return {
					'dx': part ? margin * part : margin, 
					'dy': part ? this.coinTextFirst(node).dy + (marginTop + fontSize) * partCoinText : this.coinTextFirst(node).dy + 48, 
					'font-size': partCoinText ? fontSize * partCoinText : fontSize,

				}
			},

			coinTextThird: function( node ) {

				const partCoinText = this.partCoinText( node.data.part )
				const part = this.part( node.data.part )

				const marginTop = 12
				const fontSize = 24
				const margin = this.isDevice ? 8 : 16

				return {
					'dx': part ? margin * part : margin, 
					'dy': this.isDevice ? 0 : (part ? this.coinTextSecond(node).dy + (marginTop + fontSize - 6) * partCoinText : this.coinTextSecond(node).dy + 24), 
					'font-size': this.isDevice ? 0 : ( partCoinText ? fontSize * partCoinText : fontSize ),
				}
			},

			coinTextDeltaWrap: function( node ) {
				return {
					'x': '100%',
					'y': '100%',
					'visibility': this.isDevice ? 'hidden' : 'visibility',
				}
			},

			coinTextDeltaIcon: function( node ) {

				const part = this.part( node.data.part )
				const margin = 16
				const fontSize = 36

				return {
					'dx': part ? -(margin * part) : -margin, 
					'dy': part ? -(margin * part) : -margin, 
					'font-size': part ? fontSize * part : fontSize,
					'text-anchor': 'end',
				}
			},

			coinTextDelta: function( node ) {

				const part = this.part( node.data.part )
				const fontSize = 64

				return {
					'font-size': part ? fontSize * part : fontSize,
					'text-anchor': 'end',
				}
			},

			part( value ) {
				let part = value > 0.01 ? value * 15 : value * 15 //* 3
				if ( part > 1 ) {
					part = 1
				}

				return part
			},

			partCoinText( value ) {
				let k = this.isDevice ? 15 : 35 
				let part = value > 0.01 ? value * k : value * k //* 3
				if ( part > 1 ) {
					part = 1
				}

				return part
			},

			getSign( node ) {
				return node.data.delta > 0 ? '&#9650;' : (node.data.delta < 0 ? '&#9660;' : '')
			},

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},




			async calculateTree() {
				try {
					const data = await this.$axios.get( request(this.requestPortfolio, this.$store.state.filters) )

					if( data.data.data.length <= 0 ) {
						return
					}

					let dataObj = simpleNodes(dataFormatter.deserialize( data.data ))

					let root = d3.hierarchy({"name": "root", "children": dataObj })
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

				this.$router.push('/ru/'+ this.downSymbol(node.data.name))
				this.$emit('node_click', node, this)
			},

			onend() {
				return "console.log('event1')"
			},

			downSymbol( value ) {
				if( value ) {
					return value.toLowerCase()
				}
			}


		},


		watch: {
			'$store.state.filters': {
				handler: _.debounce( async function ( newValue ) {
					await Promise.all([this.retrieveNodes, this.retrieveGraphs])
					this.$store.commit( 'TERMINATE_FILTER_LOADING' )
				}, 100 ),
				deep: true
			},
		},

	}

	function add(a, b) {
	    return a + b
	}

	function request( request, filters ) {
		let result = concatParam(request, 'cap', filters.cap)
		result = concatParam(result, 'period', filters.period)
		result = concatParam(result, 'profit', filters.profit)
		return result
	}

	function concatParam( request, param, value ) {
		if( value == undefined || value == null ) {
			return
		}
		return request + (request.indexOf('?') > 0 ? '&' : '?') + param + '=' + value
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
