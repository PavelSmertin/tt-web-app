<template>
	<div class="chart">


		<div class="coin_details">
			<div class="coin_detail">
				<label>{{ coin.coin_name }}</label>
				<div class="top_detail symbol">{{ coin.symbol }}</div>
				<div class="bottom_detail">{{ formatPrice(coin.part) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.price') }}</label>
				<div class="top_detail">${{ formatPrice(coin.coin_price) }}</div>
				<div class="bottom_detail">{{ formatPrice(coin.price_percent_change) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.volume') }}</label>
				<div class="top_detail">{{ formatPrice(coin.amount_total) }}{{ coin.symbol }}</div>
				<div class="bottom_detail">${{ formatPrice(coin.amount_total_usdt) }}</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.part') }}</label>
				<div class="top_detail">{{ formatPrice(coin.part) }}%</div>
				<div class="bottom_detail">{{ formatPrice(coin.part_change) }}%</div>
			</div>
			<div class="coin_detail">
				<label>{{ $t('coin.actuality') }}</label>
				<div class="top_detail">{{ formatDate(coin.updated_at) }}</div>
				<div class="bottom_detail">
					<timeago :since="'2018-10-03T10:08:49+00:00'" class="time-ago"></timeago>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import Jsona from 'jsona'
	import VueTimeago from 'vue-timeago'
	import Vue from 'vue'


	const REQUEST_COIN = `/api/portfolios/free-coin/`

	const dataFormatter = new Jsona()


	export default {


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
		},

	}

	function symbolToUppercase( value ) {
		if( value ) {
			return value.toUpperCase()
		} else {
			return null
		}
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