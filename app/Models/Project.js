'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  getCanvas (json) {
    return JSON.parse(json)
  }

  setCanvas (obj) {
    return JSON.stringify(obj)
  }

  getGoals (json) {
    return JSON.parse(json)
  }

  setGoals (obj) {
    return JSON.stringify(obj)
  }

  owner () {
    return this.belongsTo('App/Models/User', 'ownerId')
  }

  personas () {
    return this.hasMany('App/Models/Persona', 'id', 'projectId')
  }

  goals () {
    return this.hasMany('App/Models/Goal', 'id', 'projectId')
  }
}

module.exports = Project
