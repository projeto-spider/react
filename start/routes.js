'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.group(() => {
  // User Resource
  Route.resource('users', 'UserController').apiOnly()

  // Auth Routes
  Route.get('me', 'UserController.me')
    .middleware('auth')
  Route.post('login', 'UserController.login')
})
  .formats(['json'])
  .prefix('api')

Route.any('*', 'NuxtController.render')
