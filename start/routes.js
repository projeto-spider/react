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

  // Project Resource
  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .middleware('auth')
  Route.get(
    '/projects/:projects_id/members',
    'ProjectController.listMembers'
  ).middleware('auth')
  Route.post(
    '/projects/:projects_id/members',
    'ProjectController.addMember'
  ).middleware('auth')
  Route.delete(
    '/projects/:projects_id/members/:id',
    'ProjectController.removeMember'
  ).middleware('auth')
  // Project Personas Resource
  Route.resource('projects.personas', 'PersonaController')
    .apiOnly()
    .middleware('auth')
  // Project Goals Resource
  Route.resource('projects.modules', 'ProjectModuleController')
    .apiOnly()
    .middleware('auth')
  // Project CRC Cards Resource
  Route.resource('projects.crc-cards', 'CrcCardController')
    .apiOnly()
    .middleware('auth')
  // Project Interfaces Resource
  Route.resource('projects.interfaces', 'InterfaceController')
    .apiOnly()
    .middleware('auth')
  // Project Goals Resource
  Route.resource('projects.modules.goals', 'GoalController')
    .apiOnly()
    .middleware('auth')
  // Project Goals Stories Resource
  Route.resource('projects.modules.goals.stories', 'StoryController')
    .apiOnly()
    .middleware('auth')
  Route.post(
    '/projects/:projects_id/modules/:modules_id/goals/:id/personas',
    'GoalController.addPersona'
  ).middleware('auth')
  Route.delete(
    '/projects/:projects_id/modules/:modules_id/goals/:goals_id/personas/:id',
    'GoalController.removePersona'
  ).middleware('auth')

  // Auth Routes
  Route.get('me', 'UserController.me').middleware('auth')
  Route.post('login', 'UserController.login')
})
  .formats(['json'])
  .prefix('api')

Route.any('*', 'NuxtController.render')
