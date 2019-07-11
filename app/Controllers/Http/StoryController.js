'use strict'

const Story = use('App/Models/Story')

class StoryController {
  async index ({ auth, request, response }) {
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
      .where('id', request.params.goals_id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    return await goal
      .stories()
      .fetch()
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
      .where('id', request.params.goals_id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const story = await goal
      .stories()
      .where('id', request.params.id)
      .first()

    if (!story) {
      return response.notFound({
        message: 'Story not found'
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
      .where('id', request.params.goals_id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const data = request.all()

    const { id } = await goal.stories().create(data)

    return await Story.findOrFail(id)
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
      .where('id', request.params.goals_id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const story = await goal
      .stories()
      .where('id', request.params.id)
      .first()

    if (!story) {
      return response.notFound({
        message: 'Story not found'
      })
    }

    const data = request.all()
    story.merge(data)
    await story.save()

    return story
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
      .where('id', request.params.goals_id)
      .first()

    if (!goal) {
      return response.notFound({
        message: 'Goal not found'
      })
    }

    const story = await goal
      .stories()
      .where('id', request.params.id)
      .first()

    if (!story) {
      return response.notFound({
        message: 'Story not found'
      })
    }

    await story.delete()
  }
}

module.exports = StoryController
