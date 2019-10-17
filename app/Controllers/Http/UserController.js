'use strict'
const User = use('App/Models/User')

class UserController {
  async store({ request, response }) {
    const data = request.all()
    const { email } = data

    const emailExists = await User.query()
      .where('email', email)
      .first()

    if (emailExists) {
      return response.badRequest({
        message: 'Duplicated email'
      })
    }

    const user = await User.create(data)

    return user
  }

  async login({ auth, request }) {
    const { email, password } = request.all()
    return await auth.attempt(email, password)
  }

  me({ auth }) {
    return auth.user
  }
}

module.exports = UserController
