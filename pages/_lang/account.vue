<template>
  <div class="row ff_account no-gutters scroll-container" ref="scroll_container_account">
    <div>

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
  </div>
</template>