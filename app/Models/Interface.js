'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Interface extends Model {
  owner() {
    return this.belongsTo('App/Models/ProjectModule', 'moduleId')
  }
}

module.exports = Interface
