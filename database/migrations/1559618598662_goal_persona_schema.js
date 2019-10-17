'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GoalPersonaSchema extends Schema {
  up() {
    this.create('goal_personas', table => {
      table.increments()
      table.integer('goalId').unsigned()
      table.foreign('goalId').references('goals.id')
      table.integer('personaId').unsigned()
      table.foreign('personaId').references('personas.id')
    })
  }

  down() {
    this.drop('goal_personas')
  }
}

module.exports = GoalPersonaSchema
