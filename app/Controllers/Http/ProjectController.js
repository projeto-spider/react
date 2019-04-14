'use strict'

class ProjectController {
  async index ({ auth }) {
    return await auth.user.projects().fetch()
  }

  async show ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    return project
  }

  async store ({ auth, request }) {
    const data = request.all()

    const project = await auth.user.projects().create(data)

    return project
  }

  async update ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.id)
      .first()

    if (!project) {
      return response.badRequest({
        message: 'Project not found'
      })
    }

    const data = request.all()
    project.merge(data)
    await project.save()

    return project
  }

  async destroy ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.id)
      .first()

    if (!project) {
      return response.badRequest({
        message: 'Project not found'
      })
    }

    await project.delete()
  }
}

module.exports = ProjectController
