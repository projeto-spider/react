'use strict'

const User = use('App/Models/User')
const Project = use('App/Models/Project')

class ProjectController {
  async index ({ auth }) {
    return await auth.user.projects().fetch()
  }

  async show ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('projects.id', request.params.id)
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

    const project = await Project.create(data)
    await auth.user.projects().attach([project.id], pivot => {
      pivot.role = 'owner'
    })

    return project
  }

  async update ({ auth, request, response }) {
    const project = await auth.user.projects()
      .where('projects.id', request.params.id)
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
      .where('projects.id', request.params.id)
      .first()

    if (!project) {
      return response.badRequest({
        message: 'Project not found'
      })
    }

    await project.delete()
  }

  async listMembers ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('projects.id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    return project.members().fetch()
  }

  async addMember ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('projects.id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const { id } = request.all()

    const user = await User
      .query()
      .where('id', id)
      .first()

    if (!user) {
      return response.notFound({
        message: 'User not found'
      })
    }

    return project.members().attach([user.id])
  }

  async removeMember ({ auth, request, response }) {
    const project = await auth.user
      .projects()
      .where('projects.id', request.params.projects_id)
      .first()

    if (!project) {
      return response.notFound({
        message: 'Project not found'
      })
    }

    const user = await User
      .query()
      .where('id', request.params.id)
      .first()

    if (!user) {
      return response.notFound({
        message: 'User not found'
      })
    }

    await project.members().detach([user.id])
  }
}

module.exports = ProjectController
