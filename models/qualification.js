const { Model, Schema } = require('@bakjs/mongo')

class Qualification extends Model {
  static get $schema () {
    return {
      title: String
    }
  }
}

module.exports = Qualification.$model