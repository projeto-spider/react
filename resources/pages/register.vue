<template>
  <div
    :style="{
      background: '#fff',
      padding: '24px',
      minHeight: '280px',
      margin: '0 auto',
      maxWidth: '640px'
    }"
  >
    <a-form
      id="auth-form"
      :form="form"
      class="register-form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: 'Please input your display name!' }
              ]
            }
          ]"
          placeholder="Display name"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]
            }
          ]"
          type="email"
          placeholder="Email"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
                },
                {
                  validator: validateToNextPassword
                }
              ]
            }
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'passwordConfirm',
            {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                {
                  validator: compareToFirstPassword
                }
              ]
            }
          ]"
          type="password"
          placeholder="Password confirmation"
          @blur="handleConfirmBlur"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          class="register-form-button"
        >
          Register
        </a-button>
        Or
        <nuxt-link to="/login">
          login now!
        </nuxt-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegisterPage',

  data: () => ({
    confirmDirty: false
  }),

  beforeCreate() {
    this.form = this.$form.createForm(this)
  },

  methods: {
    ...mapActions('auth', ['register']),

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, data) => {
        if (!err) {
          this.register(data)
            .then(() => {
              this.$router.push('/')
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        }
      })
    },

    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        // eslint-disable-next-line
        callback('Two passwords that you enter is inconsistent!')
      } else {
        callback()
      }
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['passwordConfirm'], { force: true })
      }
      callback()
    }
  }
}
</script>

<style>
#auth-form {
  max-width: 640px;
}

#auth-form .register-form {
  max-width: 300px;
}
#auth-form .register-form-button {
  width: 100%;
}
</style>
