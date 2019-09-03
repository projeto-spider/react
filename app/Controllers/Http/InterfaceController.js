'use strict';

const Interface = use('App/Models/Interface')

class InterfaceController {
  async index ({ auth, request }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    return await project.interfaces().fetch()
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

    const interfac = await project
      .interfaces()
      .where('id', request.params.id)
      .first()

    if (!interfac) {
      return response.notFound({
        message: 'Interface not found'
      })
    }

    return interfac
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

    const { id } = await project.interfaces().create(data)

    return await Interface.findOrFail(id)
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

    const interfac = await project
      .interfaces()
      .where('id', request.params.id)
      .first()

    if (!interfac) {
      return response.notFound({
        message: 'Interface not found'
      })
    }

    const data = request.all()
    interfac.merge(data)
    await interfac.save()

    return interfac
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

    const interfac = await project
      .interfaces()
      .where('id', request.params.id)
      .first()

    if (!interfac) {
      return response.notFound({
        message: 'Interface not found'
      })
    }

    await interfac.delete()
  }
}

module.exports = InterfaceController
