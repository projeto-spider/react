'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CrcCardSchema extends Schema {
  up () {
    this.create('crc_cards', table => {
      table.increments()

      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')

      table
        .text('title')
        .notNullable()
        .defaultTo('')
      table
        .json('properties')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table
        .json('actions')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table
        .json('relations')
        .defaultTo(JSON.stringify([]))
        .notNullable()
      table
        .json('modules')
        .defaultTo(JSON.stringify([]))
        .notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('crc_cards')
  }
}

module.exports = CrcCardSchema
