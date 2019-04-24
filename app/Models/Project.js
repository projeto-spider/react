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

  owner () {
    return this.belongsTo('App/Models/User', 'ownerId')
  }
}

module.exports = Project
