<template>
  <form @keydown.enter.stop.prevent="register" name="SignupForm">
    <fieldset>
      <ul v-if="errors" class="row_errors">
        <li v-for="error of errors" v-bind:key="error">
          {{error}}
        </li>
      </ul>
      <div class="row_field">
        <label class="ff-label">{{ $t('account.email') }}</label>
        <input type="email" name="email" v-model="email">
      </div>
      <div class="row_field">
        <label class="ff-label">{{ $t('account.password') }}</label>
        <input type="password" v-model="password" name="password">
      </div>
      <div class="row_field">
        <label class="ff-label">{{ $t('account.repeat_password') }}</label>
        <input type="password" v-model="repassword" name="repassword">
      </div>

      <div class="row_field row_tools row_center">
        <button v-if="!busy" class="button_link" @click.stop.prevent="register">{{ $t('account.signup') }}</button>
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
        password: null,
        repassword: null,
        name: null,
        errors: null,
        busy: false,
      }
    },
    methods: {
      async register() {

        this.busy = true
        this.errors = null


        if(this.email) {
          this.$auth.$storage.setUniversal('username',  this.email )
        }

        return this.$axios.post(`/api/auth/signup`,
            'SignupForm[email]=' + this.email +
            '&SignupForm[password]=' + this.password +
            '&SignupForm[rePassword]=' + this.repassword +
            '&SignupForm[user_name]=' + this.name
          )
          .then((response) => {
            this.$router.push({ name: `account-signup-success` })
          })
          .catch(e => {
            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          })
      }
    }
  }

</script>