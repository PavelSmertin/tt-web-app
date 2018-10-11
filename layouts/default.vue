<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav">
			<div class="sidenav_overflow">
				<a href="javascript:void(0)" class="closebtn" v-on:click="closeNav()">&times;</a>
				<nuxt-link v-if="$auth.loggedIn" :to="{ path: '/exchanges' }">{{ $t('nav.account') }}</nuxt-link>
				<nuxt-link :to="{ path: '/' }">{{ $t('nav.traders') }}</nuxt-link>
				<nuxt-link :to="{ path: '/about' }">{{ $t('nav.about') }}</nuxt-link>
				<a href="#">{{ $t('nav.settings') }}</a>
				<a v-if="$auth.loggedIn" href="javascript:void(0)" v-on:click="$auth.logout()">{{ $t('nav.logout') }}</a>
			</div>
		</div>


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
				<filters :label="$t('home.label_capitalization')" :options="capitalizationOptions" :selectedProp="$store.state.filters.cap"  v-on:updateOption="filter($event, 'cap')" />
				<filters :label="$t('home.label_profit')" :options="profitOptions" :selectedProp="$store.state.filters.profit" v-on:updateOption="filter($event, 'profit')" />
				<filters :label="$t('home.label_interval')" :options="intervalOptions" :selectedProp="$store.state.filters.period"  v-on:updateOption="filter($event, 'period')" />
			</div>

			<nuxt-link 
				v-if="!$auth.loggedIn"
				:to="{ path: '/account/signin' }" 
				class="ff_account_menu">
				{{ $t('nav.compare') }}
			</nuxt-link>

			<span class="burger" v-on:click="openNav()">
				<svg width="24px" height="18px" viewBox="0 0 24 18">
					<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g transform="translate(-1400.000000, -15.000000)" fill="#000000">
							<g id="Header">
								<path d="M1400,15 L1424,15 L1424,17 L1400,17 L1400,15 Z M1400,23 L1424,23 L1424,25 L1400,25 L1400,23 Z M1412,31 L1424,31 L1424,33 L1412,33 L1412,31 Z" id="Combined-Shape"></path>
							</g>
						</g>
					</g>
				</svg>
			</span>

		</div>

		<div class="content" id="content">
			<nuxt/>
		</div>

	</div>
</template>

<script>
	import Filters from '~/components/Filters.vue'

	const FILTER_TYPE_CAP = 'cap'
	const FILTER_TYPE_PROFIT = 'profit'
	const FILTER_TYPE_PERIOD = 'period'

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
					{ name: this.$t('filters.10p'), value: '10' },
					{ name: this.$t('filters.100p'), value: '100' },
					{ name: this.$t('filters.1000p'), value: '1000' },
				],
				intervalOptions: [
					{ name: this.$t('filters.interval.1d'), value: '1d' },
					{ name: this.$t('filters.interval.1w'), value: '1w' },
					{ name: this.$t('filters.interval.1m'), value: '1m' },
				],
			}
		},
		components: {
			Filters,
		},

		methods: {
			openNav() {
				this.$refs["tt_sidenav"].style.width = "250px"
			},

			closeNav() {
				this.$refs["tt_sidenav"].style.width = "0"
			},

			filter ( filter, type ) {
				this.$store.commit( 'SET_FILTER', { type: type, value: filter.value } )
			},
		},


	}
</script>