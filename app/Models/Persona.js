'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Persona extends Model {
  getData (json) {
    return JSON.parse(json)
  }

  setData (obj) {
    return JSON.stringify(obj)
  }

  owner () {
    return this.belongsTo('App/Models/Project', 'projectId')
  }
}

module.exports = Persona
