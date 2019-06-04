'use strict'

const ProjectModule = use('App/Models/ProjectModule')

class ProjectModuleController {
  async index ({ auth, request }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    return await project.modules().fetch()
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
      .where('id', request.params.id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    return mod
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

    const { id } = await project.modules().create(data)

    return await ProjectModule.findOrFail(id)
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
      .where('id', request.params.id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    const data = request.all()
    mod.merge(data)
    await mod.save()

    return mod
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
      .where('id', request.params.id)
      .first()

    if (!mod) {
      return response.notFound({
        message: 'Module not found'
      })
    }

    await mod.delete()
  }
}

module.exports = ProjectModuleController
