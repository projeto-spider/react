'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectModuleSchema extends Schema {
  up () {
    this.create('project_modules', table => {
      table.increments()
      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')
      table.text('title').notNullable()
      table
        .json('goals')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('project_modules')
  }
}

module.exports = ProjectModuleSchema
