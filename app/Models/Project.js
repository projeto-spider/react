'use strict';

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

  setCanvas (obj) {
    return JSON.stringify(obj)
  }

  getInspection (json) {
    return JSON.parse(json)
  }

  setInspection (obj) {
    return JSON.stringify(obj)
  }

  owner () {
    return this.belongsTo('App/Models/User', 'ownerId')
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
