const { Model, Schema } = require('@bakjs/mongo')

class Poll extends Model {
  static get $schema () {
    return {
      owner: {type:Schema.Types.ObjectId, ref: 'User', required: true},
      // subject: String,
      // votes: [{voter: {type:Schema.Types.ObjectId, ref: 'User'}}, {candidate: {type:Schema.Types.ObjectId, ref: 'User'}}]
      votes: [{vote: {type:Schema.Types.ObjectId, ref: 'Vote'}}]
    }
  }
}

module.exports = Poll.$model
