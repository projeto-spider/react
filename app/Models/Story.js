'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Story extends Model {
  getBusinessRules(json) {
    return JSON.parse(json)
  }

  setBusinessRules(obj) {
    return JSON.stringify(obj)
  }

  getAcceptanceScenarios(json) {
    return JSON.parse(json)
  }

  setAcceptanceScenarios(obj) {
    return JSON.stringify(obj)
  }

  owner() {
    return this.belongsTo('App/Models/Goal', 'goalId')
  }
}

module.exports = Story
