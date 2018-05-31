const { Model, Schema } = require('@bakjs/mongo')

class Poll extends Model {
  static get $schema () {
    return {
      subject: String,
      votes: [{vote: {type:Schema.Types.ObjectId, ref: 'Vote'}}]
    }
  }
}

module.exports = Poll.$model
