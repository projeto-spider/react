<template>
  <div :style="{ background: '#fff', padding: '24px', minHeight: '280px', margin: '0 auto', maxWidth: '640px' }">
    <a-form
      id="auth-form"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            { rules: [{ required: true, message: 'Please input your Email!' }] }
          ]"
          placeholder="email"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: 'Please input your Password!' }] }
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true,
            }
          ]"
        >
          Remember me
        </a-checkbox>
        <a
          class="login-form-forgot"
          href=""
        >
          Forgot password
        </a>
        <a-button
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          Log in
        </a-button>
        Or <nuxt-link to="/register">
          register now!
        </nuxt-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LoginPage',

  middleware: 'notAuthenticated',

  beforeCreate () {
    this.form = this.$form.createForm(this)
  },

  computed: {

  },

  mounted () {
    const email = localStorage.getItem('lastEmail') || ''
    this.form.setFieldsValue({ email })
  },

  methods: {
    ...mapActions('auth', [
      'login'
    ]),

    handleSubmit (e) {
      e.preventDefault()

      this.form.validateFields((err, credentials) => {
        const { email, remember } = credentials

        localStorage.setItem('lastEmail', remember ? email : '')

        if (!err) {
          const { email, password } = credentials

          this.login(credentials)
            .then(() => {
              this.$router.push('/projects')
            })
            .catch(() => {
              this.$message.error('Invalid Credentials')
            })
        }
      })
    }
  }
}
</script>

<style>
#auth-form {
  max-width: 640px;
}

#auth-form .login-form {
  max-width: 300px;
}
#auth-form .login-form-forgot {
  float: right;
}
#auth-form .login-form-button {
  width: 100%;
}
</style>
