<template>
	<div class="layout">

		<div ref="tt_sidenav" class="sidenav">
			<div class="sidenav_overflow">
				<a href="javascript:void(0)" class="closebtn" v-on:click="closeNav()">&times;</a>
				<a href="#">{{ $t('nav.account') }}</a>
				<a href="#">{{ $t('nav.traders') }}</a>
				<a href="#">{{ $t('nav.about') }}</a>
				<a href="#">{{ $t('nav.settings') }}</a>
				<a href="#">{{ $t('nav.logout') }}</a>
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
				<filters :label="$t('home.label_capitalization')" :options="capitalizationOptions" />
				<filters :label="$t('home.label_profit')" :options="profitOptions" />
				<filters :label="$t('home.label_interval')" :options="intervalOptions" />
			</div>

			<span class="burger" v-on:click="openNav()">
				&#9776;
			</span>

		</div>

		<div class="content" id="content">
			<nuxt/>
		</div>

	</div>
</template>

<script>
	import Filters from '~/components/Filters.vue'

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
		}
	}
</script>