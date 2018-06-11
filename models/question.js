const { Model, Schema } = require('@bakjs/mongo')

class Question extends Model {
  static get $schema () {
    return {
      text: String,
      approved: Boolean,
    }
  }
}

module.exports = Question.$model
