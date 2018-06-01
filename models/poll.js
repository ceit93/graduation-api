const { Model, Schema } = require('@bakjs/mongo')

class Poll extends Model {
  static get $schema () {
    return {
      owner: {type:Schema.Types.ObjectId, ref: 'User', required: true},
      votes: []
    }
  }
}

module.exports = Poll.$model
