<template>
  <div class="flash_form">
    <h1>{{ $t('account.confirm_email') }}</h1>

    <p class="success_text row_center">
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

    async asyncData({ app, params, redirect }) {


      const { data } = await app.$axios.get( `/api/auth/email-confirm`, { params: { code: params.code } } )
      if(data.email_confirmed) {

        app.$auth.setToken('api', 'Bearer ' + data.access_token)
        app.$auth.setUser({})

        return {
          message: this.$t('account.go_to_home')
        }
      } 
      return {
        message: this.$t('account.wrong_confirmation_code')
      }
    },

    mounted () {
      this.$router.push({ name: `index` })    
    },

  }

</script>