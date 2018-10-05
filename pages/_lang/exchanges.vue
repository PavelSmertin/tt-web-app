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

		</div>

		<div class="content" id="content">
			
			<div class="exchanges_form">
				<div class="left_pane">

					<h1>{{ $t('account.portfolio.added_exchanges') }}</h1>
					<ul>
						<li v-for="exchange in exchanges" v-bind:key="exchange.id">
							{{ exchange.exchange.name }}
						</li>
					</ul>
				</div>


				<form @keydown.enter.stop.prevent="add" name="PortfolioTraiderExchange" class="right_pane">
					<fieldset>
						<ul v-if="errors" class="row_errors">
							<li v-for="error of errors" v-bind:key="error">
								{{error}}
							</li>
						</ul>

						<div class="row_field">
							<label class="ff_label">{{ $t('account.portfolio.exchange') }}</label>
							<select v-model="selected">
								<option value="">{{ $t('account.portfolio.choose_one') }}</option>
								<option v-for="option in options" v-bind:value="option.id">
									{{ option.name }}
								</option>
							</select>
						</div>

						<div class="row_field">
							<label class="ff_label">{{ $t('account.portfolio.api_key') }}</label>
							<input type="text" name="apiKey" v-model="apiKey">
						</div>

						<div class="row_field">
							<label class="ff_label">{{ $t('account.portfolio.api_secret') }}</label>
							<input type="text" name="apiSecret" v-model="apiSecret">
						</div>

						<div class="row_field row_tools row_center">
							<button v-if="!busy" class="button_link" @click.stop.prevent="add">
								{{ $t('account.portfolio.api_add') }}
							</button>
							<div v-else class="loading-spiral"></div>
						</div>

					</fieldset>
				</form>
			</div>
		</div>

	</div>


</template>

<script>
	import Jsona from 'jsona'

	const REQUEST_EXCHANGES 			= `/api/portfolios/exchanges`
	const REQUEST_PORTFOLIOS_EXCHANGES 	= `/api/portfolio/traider-exchanges?include=balances,exchange`
	const POST_EXCHANGE_ACCOUNT			= `/api/portfolios/add-exchange`

	const CHOOSE_ONE = ``

	const dataFormatter = new Jsona()

	export default {

		data() {
			return {
				selected: CHOOSE_ONE,
				exchange: null,
				apiKey: null,
				apiSecret: null,
				errors: null,
				busy: false,
			}
		},

		async asyncData ({ app, redirect }) {
			let exchanges = []
			let options = []

			try {
				let data = await app.$axios.get( REQUEST_PORTFOLIOS_EXCHANGES )
				exchanges = dataFormatter.deserialize( data.data )
			} catch (e) {
				if( e.response && e.response.status == 401 ) {
					return redirect( `/account/signin` )
				}
			}

			try {
				let dataOptions = await app.$axios.get( REQUEST_EXCHANGES )
				options = dataFormatter.deserialize( dataOptions.data )
			} catch (e) {
			}

			return {
				exchanges: exchanges,
				options: options,
			}

		},


		methods: {
			async add() {
				this.busy = true
				this.errors = null

				return this.$axios.post( POST_EXCHANGE_ACCOUNT,
						'PortfolioTraiderExchange[exchange_id]=' + this.selected +
						'&PortfolioTraiderExchange[api_access]=' + this.apiKey +
						'&PortfolioTraiderExchange[api_secret]=' + this.apiSecret
					)
				.then((response) => {
					this.busy = false
					this.exchanges = dataFormatter.deserialize( response.data )
				})
				.catch(e => {
					this.busy = false
					//this.errors = e.response.data.errors.map((el) => { return el.title})
				})
			},
		}
	}
</script>
