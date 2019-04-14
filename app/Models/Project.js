'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  owner () {
    return this.belongsTo('App/Models/User', 'ownerId')
  }
}

module.exports = Project
