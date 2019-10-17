'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProjectModule extends Model {
  getGoals(json) {
    return JSON.parse(json)
  }

  setGoals(obj) {
    return JSON.stringify(obj)
  }

  owner() {
    return this.belongsTo('App/Models/Project', 'projectId')
  }

  goals() {
    return this.hasMany('App/Models/Goal', 'id', 'moduleId')
  }
}

module.exports = ProjectModule
