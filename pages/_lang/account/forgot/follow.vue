<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>{{ $t('account.thank_you') }}</h1>

    <p class="success_text">
      {{ message }}
    </p>

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
        message: this.$t('account.instruction_forgot')
      }
    }
  }

</script>