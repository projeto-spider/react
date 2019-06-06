'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Goal extends Model {
  getJourney (json) {
    return JSON.parse(json)
  }

  setJourney (obj) {
    return JSON.stringify(obj)
  }

  owner () {
    return this.belongsTo('App/Models/Goal', 'moduleId')
  }

  personas () {
    return this.belongsToMany(
      'App/Models/Persona',
      'goalId',
      'personaId'
    ).pivotTable('goal_personas')
  }
}

module.exports = Goal
