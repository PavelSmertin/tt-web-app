<template>
  <form @keydown.enter.stop.prevent="login" name="LoginForm">
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
        <input type="password" name="password" v-model="password">
      </div>

      <div class="row_field row_tools">
        <button v-if="!busy" class="button_link" @click.stop.prevent="login">{{ $t('account.signin') }}</button>
        <div v-else class="loading-spiral"></div>
        <nuxt-link :to="{name: 'account-forgot'}" class="row_link">{{ $t('account.forgot') }}</nuxt-link>
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
        errors: null,
        busy: false,
      }
    },
    methods: {
      async login() {
        this.busy = true
        this.errors = null

        return this.$auth
          .loginWith('api', {
            data: 'LoginForm[email]=' + this.email + '&LoginForm[password]=' + this.password,
          }).then((response) => {
            this.$toast.success(this.$t('account.success_auth'))
          }).catch( e => {
            this.busy = false
            this.errors = e.response.data.errors.map((el) => { return el.title})
            var element = this.$parent.$refs["scroll_container_account"];
            element.scrollTo(0, 0);
          } )
      },

      notBusy () {
        return typeof this.$auth.busy === 'undefined' 
        || this.$auth.busy === null 
        || this.$auth.busy == false
      }
    }
  }

</script>