'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GoalsSchema extends Schema {
  up () {
    this.create('goals', table => {
      table.increments()
      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')
      table.text('title').notNullable()
      table
        .integer('priority')
        .notNullable()
        .defaultTo(0)
      table
        .integer('type')
        .notNullable()
        .defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('goals')
  }
}

module.exports = GoalsSchema
