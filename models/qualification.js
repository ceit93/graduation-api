const { Model, Schema } = require('@bakjs/mongo')

class Qualification extends Model {
  static get $schema () {
    return {
      title: String,
      approved: Boolean,
      creator: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  }
}

module.exports = Qualification.$model