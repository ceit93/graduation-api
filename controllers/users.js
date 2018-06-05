const { Controller } = require('bak')
const { upload, url } = require('@bakjs/minio')
const { User } = require('../models')
const Boom = require('boom')

class UsersController extends Controller {
  init() {
    this.post('/profie', this.updateProfile)
    this.get('/users/students', this.getAll93Students)
    this.get('/users/{username}', this.getByUsername)
  }

  async getAll93Students (request, h){
    let results = []
    try{
      let users = await User.find()

      for(let user of users){
        let student_numbers = user.toObject().std_numbers
        if(student_numbers) {
          for (let number of student_numbers) {
            if (number.match('^9331[0-9]{3}$')) {
              let result = {}
              result.objectID = user._id
              result.std_numbers = number
              result.name = user.name
              result.username = user.username
              result.objectID = user._id
              result.avatar = user.avatar
              result.gender = user.gender
              results.push(result)
            }
          }
        }
      }

      return results
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


  async getByUsername (request, h) {
    let user = await User.findOne({ username: request.params.username }).populate('posts')
    user.votes = undefined
    user = user.toObject()
    let toBeDisplayedPosts = []

    if (user._id.equals(request.user._id)) {
      for (let post in user.posts) {
        let author = await User.findById(user.posts[post].user).select('_id name username std_numbers avatar')
        user.posts[post].user = author.toObject()
        toBeDisplayedPosts.push(user.posts[post])
      }
    } else {
      for (let post in user.posts) {
        if (user.posts[post].user.equals(request.user._id) || user.posts[post].approved) {
          let author = await User.findById(user.posts[post].user).select('_id name username std_numbers avatar')
          user.posts[post].user = author.toObject()
          toBeDisplayedPosts.push(user.posts[post])
        }
      }
    }

    user.posts = undefined
    user.posts = toBeDisplayedPosts

    return { user }
  }

  async updateProfile(request, h) {
    let user = request.user._id
    let avatar = request.payload.avatar
    delete request.payload.avatar

    try {
      user = await User.findById(user)
      if (avatar instanceof Buffer) {
        avatar = await upload('users', user._id + '.jpg', avatar, 'image/jpeg')
        avatar = url('users', user._id + '.jpg', avatar, 'image/jpeg')
        user.avatar = avatar
      }

      await user.save()
      return {avatar}
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()

    }
  }
}




module.exports = UsersController
