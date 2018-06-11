const { Model, Schema } = require('@bakjs/mongo')

class Interview extends Model {
  static get $schema () {
    return {
      question: { type: Schema.Types.ObjectId, ref: 'Question'},
      answer: String,
    }
  }
}

module.exports = Interview.$model
