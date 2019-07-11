'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GoalsSchema extends Schema {
  up () {
    this.create('goals', table => {
      table.increments()
      table.integer('moduleId').unsigned()
      table.foreign('moduleId').references('projects_modules.id')
      table.text('title').notNullable()
      table
        .integer('priority')
        .notNullable()
        .defaultTo(0)
      table
        .integer('type')
        .notNullable()
        .defaultTo(0)
      table
        .json('journey')
        .defaultTo(
          JSON.stringify({
            nodes: [],
            edges: []
          })
        )
        .notNullable()
      table
        .json('stories')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('goals')
  }
}

module.exports = GoalsSchema
