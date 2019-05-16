'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Goal extends Model {
  owner () {
    return this.belongsTo('App/Models/Project', 'projectId')
  }
}

module.exports = Goal
