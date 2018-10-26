<template>
  <div class="flash_form">

    <img class="love_img" src="~/assets/images/love.svg" alt="thnx">

    <h1>{{ $t('account.thank_you') }}</h1>

    <p class="success_text">
      {{ message }}
    </p>

    <div class="row_field row_tools row_center">
      <nuxt-link :to="{name: 'index'}" class="button_link">{{ $t('account.back_to_home') }}</nuxt-link>
    </div>

    <div class="row_field row_tools row_center">
      <button v-on:click="resend" class="row_link">{{ $t('account.resend_code') }}</button>
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
        message: this.$t('account.instruction')
      }
    },
    methods: {
      async resend() {
        this.error = null

        // this.$auth.setToken('api', 'djsnjn')
        // this.$auth.setUser({})

        var username = this.$auth.$storage.getUniversal('username')

        if( !username ) {
          this.$router.push({ name: `account-signup` })
          return
        }

        return this.$axios.post( `/api/auth/resend-confirmation-email`, 'ResendConfirmationCode[email]=' + username + 'endpoint=tt' )
          .then(response => {
            if( response.data.success ) {
              this.showMessage( this.$t('account.resend_success'))
            } else {
              this.showMessage( this.$t('account.resend_wrong'))
            }
          })
          .catch(function (error) {
            this.showMessage( this.$t('account.resend_success'))
          });
      },

      showMessage(message) {
        this.message = message
      }
    }
  }

</script>