'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectSchema extends Schema {
  up() {
    this.create('projects', table => {
      table.increments()
      table.string('name').notNullable()
      // table.integer('ownerId').unsigned()
      // table.foreign('ownerId').references('users.id')
      table.string('clientName').defaultTo('')
      table.string('description').defaultTo('')
      table.date('startDate').defaultTo(this.fn.now())
      table.date('endDate').defaultTo(this.fn.now())
      table
        .json('canvas')
        .defaultTo(
          JSON.stringify({
            problems: [],
            solutions: [],
            is: [],
            isnt: [],
            constraints: []
          })
        )
        .notNullable()
      table
        .json('scale')
        .defaultTo(
          JSON.stringify([
            '?',
            '1/2',
            '1',
            '2',
            '3',
            '5',
            '8',
            '13',
            '40',
            '100',
            '...'
          ])
        )
        .notNullable()
      table
        .json('criteria')
        .defaultTo(
          JSON.stringify([
            'Independent',
            'Negotiable',
            'Valuable',
            'Estimable',
            'Small',
            'Testable'
          ])
        )
        .notNullable()
      table
        .json('inspection')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('projects')
  }
}

module.exports = ProjectSchema
