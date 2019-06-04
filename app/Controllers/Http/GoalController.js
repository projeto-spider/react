'use strict'

const Goal = use('App/Models/Goal')

class GoalController {
  async index({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    return await mod.goals().fetch()
  }

  async show({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const goal = await mod
      .goals()
      .where('id', request.params.id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    return goal
  }

  async store({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const data = request.all()

    const { id } = await mod.goals().create(data)

    return await Goal.findOrFail(id)
  }

  async update({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const goal = await mod
      .goals()
      .where('id', request.params.id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const data = request.all()
    goal.merge(data)
    await goal.save()

    return goal
  }

  async destroy({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const goal = await mod
      .goals()
      .where('id', request.params.id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    await goal.delete()
  }

  async addPersona({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const goal = await mod
      .goals()
      .where('id', request.params.id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const { personaId } = request.all()

    return goal.personas().attach([personaId])
  }

  async removePersona({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const mod = await project
      .modules()
      .where('id', request.params.modules_id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const goal = await mod
      .goals()
      .where('id', request.params.id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const { personaId } = request.all()

    return goal.personas().detach([personaId])
  }
}

module.exports = GoalController
