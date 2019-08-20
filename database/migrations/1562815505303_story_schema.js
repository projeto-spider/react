'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StorySchema extends Schema {
  up () {
    this.create('stories', table => {
      table.increments()
      table.integer('goalId').unsigned()
      table.foreign('goalId').references('goals.id')
      table
        .text('title')
        .notNullable()
        .defaultTo('')
      table
        .string('priority')
        .notNullable()
        .defaultTo('')
      table
        .boolean('isSystem')
        .notNullable()
        .defaultTo(false)
      table
        .json('businessRules')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table
        .json('acceptanceScenarios')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('stories')
  }
}

module.exports = StorySchema
