<template>
	<div class="chart" v-bind:class="up ">


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
				<div class="bottom_detail">{{ formatPrice(coin.part * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.price') }}</label>
				<div class="top_detail">${{ formatPrice(coin.coin_price) }}</div>
				<div class="bottom_detail">{{ formatPrice(coin.price_percent_change * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.volume') }}</label>
				<div class="top_detail">{{ formatPrice(coin.amount_total) }}{{ coin.symbol }}</div>
				<div class="bottom_detail">${{ formatPrice(coin.amount_total_usdt) }}</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.part') }}</label>
				<div class="top_detail">{{ formatPrice(coin.part * 100) }}%</div>
				<div class="bottom_detail">{{ formatPrice(coin.part_change * 100) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.actuality') }}</label>
				<div class="top_detail">{{ formatDate(coin.updated_at) }}</div>
				<div class="bottom_detail">
					<timeago :since="coin.updated_at" class="time-ago"></timeago>
				</div>
			</div>
		</div>


		<svg class="graph">
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
			<Graph :symbol="upSymbol" />
		</svg>





	</div>
</template>

<script>
	import Jsona from 'jsona'
	import VueTimeago from 'vue-timeago'
	import Vue from 'vue'
	import Graph from '~/components/Graph.vue'

	const REQUEST_COIN = `/api/portfolios/free-coin/`
	const REQUEST_GRAPH = `/api/portfolios/coin-graph/` //BTC?interval=1D`

	const dataFormatter = new Jsona()

	export default {

		components: {
			Graph,
		},

		mounted() {
			if( this.$store.state.graphs[this.symbol] == undefined ) {
				this.retrieveGraph()
			}
		},

		async asyncData ({ app, params }) {
			let coin = null
			let upSymbol = symbolToUppercase(params.symbol)

			try {
				let data = await app.$axios.get( REQUEST_COIN + upSymbol  )
				coin = dataFormatter.deserialize( data.data )
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
				let date = new Date(dateString)
				let month = date.getMonth() <= 8 ? `0${date.getMonth()+1}` : date.getMonth()+1
				return `${date.getDate()}.${month}`
			},
			onClose () {
				this.$router.push({ name: 'index' })
			},

			async retrieveGraph () {
				var color = this.color;
				var nodes = []

				try {
					const data = await this.$axios.get( requestGraph(this.upSymbol, this.$store.state.filters) )
					this.$store.commit( 'SET_GRAPH', {symbol: this.upSymbol, data: data.data[this.upSymbol]} )
				} catch(error) {
					console.error(error)
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

				return { 'up' : this.coin.part_change >= 0 }
			}
		},

	}

	function symbolToUppercase( value ) {
		if( value ) {
			return value.toUpperCase()
		} else {
			return null
		}
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