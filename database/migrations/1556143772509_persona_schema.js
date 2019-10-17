'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonaSchema extends Schema {
  up() {
    this.create('personas', table => {
      table.increments()
      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')
      table.string('name').notNullable()
      table.string('role').notNullable()
      table
        .json('data')
        .defaultTo(
          JSON.stringify({
            profile: [],
            expectations: [],
            goals: []
          })
        )
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('personas')
  }
}

module.exports = PersonaSchema
