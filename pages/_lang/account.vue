<template>
	<div class="ff_account" ref="scroll_container_account">
		<div class="form_pane">
			<ul class="navigation">
				<li>
					<nuxt-link :to="{name: 'account-signin'}">{{ $t('account.signin') }}</nuxt-link>
				</li>
				<li>
					<nuxt-link :to="{name: 'account-signup'}">{{ $t('account.signup') }}</nuxt-link>
				</li>
			</ul>

			<nuxt-child />
		</div>
	</div>
</template>



<script>
export default {
	layout: 'empty',
	}
</script>