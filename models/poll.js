const { Model, Schema } = require('@bakjs/mongo')

class Poll extends Model {
  static get $schema () {
    return {
      subject: String,
      model: {type:Schema.Types.ObjectId, ref: 'User'},
      selectables: [String],
      votes: [{user: {type:Schema.Types.ObjectId, ref: 'User'}, choices: [int]}],
    }
  }
}

module.exports = Poll.$model
