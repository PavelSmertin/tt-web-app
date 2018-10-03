<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>{{ $t('account.congratulations') }}</h1>

    <p class="success_text">
      {{ message }}
    </p>

    <div class="row_field row_tools row_center">
      <nuxt-link :to="{name: 'account-signin'}" class="button_link">{{ $t('account.signin') }}</nuxt-link>
    </div>

    <p class="ff-label instruction">
      {{ $t('account.confidence') }}
    </p>
    
  </div>
</template>


<script>

  export default {
    head() {
      return { meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]}
    },
    data() {
      return {
        message: this.$t('account.success_password')
      }
    }
  }

</script>