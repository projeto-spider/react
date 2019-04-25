'use strict'

const Persona = use('App/Models/Persona')

class PersonaController {
  async index ({ auth, request }) {
    const project = await auth.user.projects()
      .where('id', request.params.projects_id)
      .first()

    return await project.personas().fetch()
  }

  async show ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const persona = await project.personas()
      .where('id', request.params.id)
      .first()

    if (!persona) {
      return response.notFound({
        message: 'Persona not found'
      })
    }

    return persona
  }

  async store ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const data = request.all()

    const { id } = await project.personas().create(data)

    return await Persona.findOrFail(id)
  }

  async update ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const persona = await project.personas()
      .where('id', request.params.id)
      .first()

    if (!persona) {
      return response.notFound({
        message: 'Persona not found'
      })
    }

    const data = request.all()
    persona.merge(data)
    await persona.save()

    return persona
  }

  async destroy ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const persona = await project.personas()
      .where('id', request.params.id)
      .first()

    if (!persona) {
      return response.notFound({
        message: 'Persona not found'
      })
    }

    await persona.delete()
  }
}

module.exports = PersonaController
