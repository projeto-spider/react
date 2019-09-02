'use strict';

const CrcCard = use('App/Models/CrcCard')

class CrcCardController {
  async index ({ auth, request }) {
    const project = await auth.user
      .projects()
      .where('id', request.params.projects_id)
      .first()

    return await project.crcCards().fetch()
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

    const crcCard = await project
      .crcCards()
      .where('id', request.params.id)
      .first()

    if (!crcCard) {
      return response.notFound({
        message: 'Class not found'
      })
    }

    return crcCard
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

    const { id } = await project.crcCards().create(data)

    return await CrcCard.findOrFail(id)
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

    const crcCard = await project
      .crcCards()
      .where('id', request.params.id)
      .first()

    if (!crcCard) {
      return response.notFound({
        message: 'Class not found'
      })
    }

    const data = request.all()
    crcCard.merge(data)
    await crcCard.save()

    return crcCard
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

    const crcCard = await project
      .crcCards()
      .where('id', request.params.id)
      .first()

    if (!crcCard) {
      return response.notFound({
        message: 'Class not found'
      })
    }

    await crcCard.delete()
  }
}

module.exports = CrcCardController
