const { Model, Schema } = require('@bakjs/mongo')

class Poll extends Model {
  static get $schema () {
    return {
      subject: String,
      model: {type:Schema.Types.ObjectId, ref: 'User'},
      votes: [{user: {type:Schema.Types.ObjectId, ref: 'User'}, choices: [int]}],
      approved: boolean
    }
  }
}

module.exports = Poll.$model
