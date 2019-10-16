'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  getScale (json) {
    return JSON.parse(json)
  }

  setScale (obj) {
    return JSON.stringify(obj)
  }

  getCanvas (json) {
    return JSON.parse(json)
  }

  setCriteria (obj) {
    return JSON.stringify(obj)
  }

  getCriteria (json) {
    return JSON.parse(json)
  }

  setCanvas (obj) {
    return JSON.stringify(obj)
  }

  getInspection (json) {
    return JSON.parse(json)
  }

  setInspection (obj) {
    return JSON.stringify(obj)
  }

  members () {
    return this.belongsToMany(
      'App/Models/User',
      'projectId',
      'userId'
    ).pivotTable('user_projects')
  }

  personas () {
    return this.hasMany('App/Models/Persona', 'id', 'projectId')
  }

  modules () {
    return this.hasMany('App/Models/ProjectModule', 'id', 'projectId')
  }

  crcCards () {
    return this.hasMany('App/Models/CrcCard', 'id', 'projectId')
  }

  interfaces () {
    return this.hasMany('App/Models/Interface', 'id', 'projectId')
  }
}

module.exports = Project
