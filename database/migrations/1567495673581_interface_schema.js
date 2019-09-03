'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InterfaceSchema extends Schema {
  up () {
    this.create('interfaces', table => {
      table.increments()

      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')

      table
        .text('title')
        .notNullable()
        .defaultTo('')

      table
        .text('input')
        .notNullable()
        .defaultTo('')

      table
        .text('output')
        .notNullable()
        .defaultTo('')

      table
        .text('supplier')
        .notNullable()
        .defaultTo('')

      table
        .text('internal')
        .notNullable()
        .defaultTo(false)

      table.timestamps()
    })
  }

  down () {
    this.drop('interfaces')
  }
}

module.exports = InterfaceSchema
