const { Model, Schema } = require('@bakjs/mongo')

class Notification extends Model {
  static get $schema () {
    return {
      title: String,
      message: String,
      type: String,
      timeout: Number,
      approved: Boolean
    }
  }
}

module.exports = Notification.$model
