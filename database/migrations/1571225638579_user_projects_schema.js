'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserProjectsSchema extends Schema {
  up() {
    this.create('user_projects', table => {
      table.increments()
      table.integer('userId').unsigned()
      table.foreign('userId').references('users.id')
      table.integer('projectId').unsigned()
      table.foreign('projectId').references('projects.id')
      table
        .enum('role', ['member', 'owner'])
        .notNullable()
        .defaultTo('member')
    })
  }

  down() {
    this.drop('user_projects')
  }
}

module.exports = UserProjectsSchema
