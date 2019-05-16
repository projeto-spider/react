'use strict'

const Goal = use('App/Models/Goal')

class GoalController {
  async index ({ auth, request }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    return await project.goals().fetch()
  }

  async show ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const goal = await project
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

  async store ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const data = request.all()

    const { id } = await project.goals().create(data)

    return await Goal.findOrFail(id)
  }

  async update ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const goal = await project
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

  async destroy ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const goal = await project
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
}

module.exports = GoalController
