'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CrcCard extends Model {
  getProperties (json) {
    return JSON.parse(json)
  }

  setProperties (obj) {
    return JSON.stringify(obj)
  }

  getActions (json) {
    return JSON.parse(json)
  }

  setActions (obj) {
    return JSON.stringify(obj)
  }

  getRelations (json) {
    return JSON.parse(json)
  }

  setRelations (obj) {
    return JSON.stringify(obj)
  }

  getModules (json) {
    return JSON.parse(json)
  }

  setModules (obj) {
    return JSON.stringify(obj)
  }

  owner () {
    return this.belongsTo('App/Models/Project', 'projectId')
  }
}

module.exports = CrcCard
