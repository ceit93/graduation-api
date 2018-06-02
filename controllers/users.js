const { Controller } = require('bak')
const { User } = require('../models')
const Boom = require('boom')

class UsersController extends Controller {
  init() {
    this.get('/users/students', this.getAll93Students)
  }

  async getAll93Students (request, h){
    let results = []
    try{
      let users = await User.find()
      for(let user of users){
        if(user.username.match('^9331[0-9]{3}$')){
          let result = {}
          result.username = user.username
          result.name = user.name
          results.push(result)
        }
      }

      return results
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = UsersController