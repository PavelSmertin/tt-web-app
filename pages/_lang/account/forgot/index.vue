<template>
  <form @keydown.enter.stop.prevent="request" name="PasswordResetRequestForm">
    <fieldset>
      <div class="form_logo"></div>
      <ul v-if="errors" class="row_errors">
        <li v-for="error of errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>
      <div class="row_field">
        <label class="ff-label">{{ $t('account.forgot_email') }}</label>
        <input type="email" name="email" v-model="email">
      </div>

      <div class="row_field row_tools row_center">
        <button v-if="!busy" class="button_link" @click.stop.prevent="request">{{ $t('account.restore') }}</button>
        <div v-else class="loading-spiral"></div>
      </div>

    </fieldset>
  </form>
</template>


<script>

  export default {
    head() {
      return { meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }]}
    },
    data() {
      return {
        email: null,
        errors: null,
        busy: false,
      }
    },
    methods: {
      async request() {

        this.busy = true
        this.errors = null

        return this.$axios.post(`/api/auth/request-password-reset`, 'PasswordResetRequestForm[email]=' + this.email + '&PasswordResetRequestForm[endpoint]=tt')
          .then((response) => {
            this.$router.push({ name: `account-forgot-follow` })
          })
          .catch(e => {
            if( process.env.NODE_ENV == 'development'  ) {
              console.error(e)
            }

            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          })
      }
    }
  }

</script>