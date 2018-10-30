<template>
	<div class="chart" v-bind:class="up" ref="chart">

		<button v-on:click="onClose()" class="ff_close">
			<svg  viewBox="0 0 48 48">
				<circle cx="24" cy="24" r="18" fill="#FFFFFF" fill-rule="evenodd"></circle>
				<polygon class="stroked" points="19 19.8 23.2 24.0000063 19 28.2 19.8 29 24 24.8 28.2 29 29 28.2 24.8 24.0000063 29 19.8 28.2 19 24 23.2 19.8 19" />

			</svg>
		</button>

		<div class="coin_details">
			<div class="coin_detail">
				<label>{{ coin.coin_name }}</label>
				<div class="top_detail symbol">{{ coin.symbol }}</div>
				<div v-if="coin.part" class="bottom_detail">{{ formatPrice(coin.part * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.price') }}</label>
				<div class="top_detail">${{ formatPrice(coin.coin_price) }}</div>
				<div class="bottom_detail">{{ formatPrice(coin.price_percent_change * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.volume') }}</label>
				<div v-if="coin.amount_total" class="top_detail">{{ formatPrice(coin.amount_total) }}{{ coin.symbol }}</div>
				<div v-if="coin.amount_total_usdt" class="bottom_detail">${{ formatPrice(coin.amount_total_usdt) }}</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.part') }}</label>
				<div v-if="coin.part" class="top_detail">{{ formatPrice(coin.part * 100) }}%</div>
				<div v-if="coin.part_change" class="bottom_detail">{{ formatPrice(coin.part_change * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.actuality') }}</label>
				<div v-if="coin.updated_at" class="top_detail">{{ formatDate(coin.updated_at) }}</div>
				<div v-if="coin.updated_at" class="bottom_detail">
					<timeago :since="coin.updated_at" class="time-ago"></timeago>
				</div>
			</div>
		</div>

		<svg class="graph">
			<defs>
				<linearGradient id="GradientPrice" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#fff"/>
					<stop offset="20%" stop-color="#fff" stop-opacity="0"/>
				</linearGradient>
				<linearGradient id="GradientPart" x1="0" x2="0" y1="0" y2="5">
					<stop offset="0%" stop-color="#000"/>
					<stop offset="15%" stop-color="#000" stop-opacity="0"/>
				</linearGradient>
			</defs>

			<Graph :symbol="upSymbol" :interactive="true" v-on:testtest="onSelect" v-on:hide-tooltip="onHideTooltip" />
			<svg viewBOx="0 0 200 100" v-bind="tooltip()">
				<rect class="tooltip" width="201" height="100" fill="#f2f2f2" />
				<rect class="tooltip" x="0" y="40" width="100" height="60" fill="#fff" />
				<rect class="tooltip" x="101" y="40" width="100" height="60" fill="#fff" />


				<text class="tooltip_date" x="12" y="26" fill="#000">
					{{ formatDateTime( tooltipPoint.date) }}
				</text>
				<text class="tooltip_label" x="12" y="60" fill="#000">
					{{ $t('coin.price') }}
				</text>
				<text class="tooltip_value" x="12" y="85" fill="#000">
					${{ formatPrice( tooltipPoint.price) }}
				</text>

				<text class="tooltip_label" x="113" y="60" fill="#000">
					{{ $t('coin.part_short') }}
				</text>
				<text class="tooltip_value" x="113" y="85" fill="#000">
					{{ formatPrice( tooltipPoint.part * 100) }}%
				</text>

			</svg>
		</svg>



	</div>
</template>

<script>
	import Jsona from 'jsona'
	import VueTimeago from 'vue-timeago'
	import Vue from 'vue'
	import Graph from '~/components/Graph.vue'
	import _ from 'lodash'

	const REQUEST_COIN = `/api/portfolios/free-coin/`
	const REQUEST_GRAPH = `/api/portfolios/coin-graph/` //BTC?interval=1D`

	const dataFormatter = new Jsona()

	export default {

		data() {
			return {
				tooltipPoint: {},
				showTooltip: false,
			}
		},
		
		components: {
			Graph,
		},

		mounted() {
			if( this.$store.state.graphs[this.symbol] == undefined ) {
				this.retrieveGraph()
			}
		},

		async asyncData ({ app, params, store }) {
			let coin = null
			let upSymbol = symbolToUppercase(params.symbol)

			try {
				let data = await app.$axios.get( requestCoin(upSymbol, store.state.filters) )
				coin = dataFormatter.deserialize( data.data )

				if( coin == undefined ) {
					coin = {
								coin_name: '',
								symbol: upSymbol, 
								coin_price: null,
								price_percent_change: null,
								part: null, 
								amount_total: null, 
								amount_total_usdt: null, 
								part_change: null,
							}
				}

			} catch (e) {
				console.log(e)
			}

			return {
				coin: coin,
				upSymbol: upSymbol,
			}
		},

		methods: {

			formatPrice( value ) {
				let val = (value/1).toFixed(2)
				return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			},

			formatDate( dateString ) {
				let date 	= new Date(dateString)
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${date.getDate()}.${month}`
			},

			formatDateTime( dateString ) {
				let date 	= new Date(dateString)
				let month 	= date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				let hour 	= date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
				let min 	= date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
				return `${date.getDate()}.${month} ${hour}:${min}`
			},

			onClose () {
				this.$router.push({ name: 'index' })
			},

			async retrieveCoin () {
				try {
					const data = await this.$axios.get(requestCoin( this.upSymbol, this.$store.state.filters ))
					let coinName = this.coin.coin_name
					let coinPrice = this.coin.coin_price
					let coinPriceChange = this.coin.price_percent_change
					this.coin = dataFormatter.deserialize( data.data )
					if( this.coin == undefined ) {
						this.coin = {
									coin_name: coinName,
									symbol: this.upSymbol, 
									coin_price: coinPrice,
									price_percent_change: coinPriceChange,
									part: null, 
									amount_total: null, 
									amount_total_usdt: null, 
									part_change: null,
								}
					}
				} catch(error) {
					console.error(error)
				}
			},

			async retrieveGraph () {
				var nodes = []

				try {
					const data = await this.$axios.get(requestGraph( this.upSymbol, this.$store.state.filters ))
					this.$store.commit( 'SET_GRAPH', {symbol: this.upSymbol, data: data.data[this.upSymbol]} )
				} catch(error) {
					console.error(error)
				}
			},

			onSelect( position ) {
				this.showTooltip = true
				this.tooltipPoint = position
			},

			onHideTooltip( hide ) {
				this.showTooltip = false
			},

			tooltip() {
				return { 
					'x': this.tooltipPoint.offsetX ? this.tooltipPoint.offsetX - 220 : 0,
					'y': this.tooltipPoint.offsetY ? this.tooltipPoint.offsetY - 120 : 0,
					'width': 201,
					'height': 104,
					'fill': '#f2f2f2',
					'visibility': this.showTooltip ? 'visibile' : 'hidden',
				}
			},

		},

		computed: {
			up() {
				// let fill = coin.data.delta > 0 ? '#7DB312' : '#D95757'
				// let delta = coin.data.delta > 0 ? coin.data.delta : -coin.data.delta
				// let fillOpacity = 1

			 	// 	if( delta < 1 ) {
			 	// 		fillOpacity = 0.75 + delta / 4
			 	// 	}

				return { 'up' : (this.coin && this.coin.part_change) >= 0 }
			},
		},

		watch: {
			'$store.state.filters': {
				handler: _.debounce( async function ( newValue ) {
					await Promise.all([this.retrieveCoin(), this.retrieveGraph()])
					this.$store.commit( 'TERMINATE_FILTER_LOADING' )
				}, 100 ),
				deep: true
			},
			// '$store.state.filters.period': {
			// 	handler: _.debounce( function ( newValue ) {
			// 		this.retrieveGraph()
			// 	}, 100 ),
			// 	deep: true
			// }
		},

	}

	function symbolToUppercase( value ) {
		if( value ) {
			return value.toUpperCase()
		} else {
			return null
		}
	}

	function requestCoin( symbol, filters ) {
		let filterQuery = 
					( filters.cap ? '?cap=' + filters.cap : '' ) + 
					( filters.period ? '&period=' + filters.period : '' ) +
					( filters.profit ? '&profit=' + filters.profit : '' ) 
		return REQUEST_COIN + symbol +  filterQuery
	}

	function requestGraph( symbol, filters ) {
		let filterQuery = 
					( filters.cap ? '?cap=' + filters.cap : '' ) + 
					( filters.period ? '&period=' + filters.period : '' ) +
					( filters.profit ? '&profit=' + filters.profit : '' )
		return REQUEST_GRAPH + symbol +  filterQuery
	}

	Vue.use(VueTimeago, {
		name: 'timeago',
		locale: 'ru-RU',
		locales: {
			// you will need json-loader in webpack 1
			'ru-RU': require('assets/locales/ru-RU.json')
		}
	})



</script>

<style lang="sass" scoped>


</style>