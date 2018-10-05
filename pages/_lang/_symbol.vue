<template>
	<div class="layout">
		<div class="toolbar">
			<nuxt-link 
				:to="{name: 'index'}" 
				class="logo_link"
				>
				<svg width="32px" height="16px" >
					<g transform="translate(-16.000000, -16.000000)">
						<path id="logo_path" fill="#fff" d="M41,24 L41,32 L33,32 L33,24 L33,16 L48,16 L48,24 L41,24 Z M31,24 L31,32 L23,32 L23,24 L16,24 L16,16 L31,16 L31,24 Z"></path>
					</g>
				</svg>
			</nuxt-link>

			<div class="filters">
				<filters :label="$t('home.label_capitalization')" 	:options="capitalizationOptions" />
				<filters :label="$t('home.label_profit')" 			:options="profitOptions" />
				<filters :label="$t('home.label_interval')" 		:options="intervalOptions" />
			</div>
		</div>

		<div class="content" id="content">
			<div class="chart">
				
			</div>
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
	</div>
</template>

<script>
	import Filters from '~/components/Filters.vue'
	import Jsona from 'jsona'
	import VueTimeago from 'vue-timeago'
	import Vue from 'vue'


	const REQUEST_COIN = `/api/portfolios/free-coin/`

	const dataFormatter = new Jsona()


	export default {
		data() {
			return {
				capitalizationOptions: [
					{ name: this.$t('filters.all'), value: 'all' },
					{ name: this.$t('filters.10k'), value: '10k' },
					{ name: this.$t('filters.100k'), value: '100k' },
					{ name: this.$t('filters.1m'), value: '1m' },
				],
				profitOptions: [
					{ name: this.$t('filters.all'), value: 'all' },
					{ name: this.$t('filters.10p'), value: '10p' },
					{ name: this.$t('filters.100p'), value: '100p' },
					{ name: this.$t('filters.1000p'), value: '1000p' },
				],
				intervalOptions: [
					{ name: this.$t('filters.interval.1d'), value: '1d' },
					{ name: this.$t('filters.interval.1w'), value: '1w' },
					{ name: this.$t('filters.interval.1m'), value: '1m' },
				],
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
		},

		components: {
			Filters,
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