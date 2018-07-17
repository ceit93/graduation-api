const { Controller } = require('bak')
const { upload, url } = require('@bakjs/minio')
const { User } = require('../models')
const { Question } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class UsersController extends Controller {
  init() {
    this.post('/profie', this.updateProfile)
    this.get('/users/students', this.getAll93Students, {
      auth: {mode: 'try'}
    })
    this.get('/users', this.getAllUsers)
    this.get('/users/{username}', this.getByUsername, {
      auth: {mode: 'try'}
    })
  }

  async getAll93Students (request, h){
    try{
      let users = await User.find({ $or: [{ std_numbers: { $regex: /^9331[0-9]{3}$/ } }, { authorized: true }] })
        .select('_id name username std_numbers avatar gender modified_name')
      return users
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


  async getByUsername (request, h) {


    let user = await User.findOne({ username: request.params.username }).populate('posts').populate('interviews')
    // request.authorize('can_request_wall', user)
    user.votes = undefined
    user = user.toObject()
    let toBeDisplayedPosts = []

    for(let index in user.interviews){
      user.interviews[index].question = await Question.findById(user.interviews[index].question)
    }

    if (request.user && user._id.equals(request.user._id)) {
      for (let post in user.posts) {
        let author = await User.findById(user.posts[post].user).select('_id name username std_numbers avatar gender modified_name')
        user.posts[post].user = author.toObject()
        toBeDisplayedPosts.push(user.posts[post])
      }
    } else {
      for (let post in user.posts) {
        if ((request.user && user.posts[post].user.equals(request.user._id)) || user.posts[post].approved) {
          let author = await User.findById(user.posts[post].user).select('_id name username std_numbers avatar gender modified_name')
          user.posts[post].user = author.toObject()
          toBeDisplayedPosts.push(user.posts[post])
        }
      }
    }

    user.posts = undefined
    user.posts = toBeDisplayedPosts


    let forbiddenTarins = [
      '5b13d5675f6c8430dc25a0fb',
      '5b178dcdcc274c001a094c5f',
      '5b1932930f1bff001a201d74',
      '5b1e34b8ed40a9001aa33793',
      '5b13d4f55f6c8430dc25a0ee',
      '5b13d4045f6c8430dc25a0d7',
      '5b13d1d25f6c8430dc25a0ab',
      '5b13d25a5f6c8430dc25a0b9',
      '5b13d2bf5f6c8430dc25a0c5',
    ];



    let username = user.username
    let results = []
      let targetUser = await User.findOne({username:username})
      let users = await User.find()
      let voteResults = []
      for (let user of users) {
        for (let vote of user.votes) {
          if (vote.candidate) {
            if (targetUser._id.equals(vote.candidate)) {
              if(!forbiddenTarins.includes(vote.qualification._id)) {
                voteResults.push(vote.qualification._id)
              }
            }
          }
        }
      }
      let voteCounts = []
      let count
      for(let userVote of voteResults) {
        count = voteResults.filter(
          function (id) {
            return id === userVote
          }
        ).length
        let voteCount = {}
        voteCount.id = userVote
        voteCount.count = count
        if (
          (voteCounts.filter(
            function (e) {
              return e.id === userVote
            }
          ).length) === 0
        ) {
          voteCounts.push(voteCount)
        }
      }

      let sorted = voteCounts.sort(function func(a, b) {
        return b.count > a.count ?  1
          : b.count < a.count ? -1
            : 0;
      });

      for(let i=0; i<5; i++){
        let result = {}
        if(sorted.length > i) {
          let qual = await Qualification.findById(sorted[i].id)
          let underlined_title = qual.title.replace(new RegExp(' ', 'g'), "_")
          result.name = underlined_title
          results.push(result)
        }
      }

      user.topTarins = results


    return {user}
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

  async getAllUsers(request, h) {
    let results = []

    try {
      let users = await User.find()
      for(let user of users){
        let student_numbers = user.toObject().std_numbers
        results.push(student_numbers)
      }
      results.sort()

      return results
    }
     catch (e) {
      console.log(e)
      throw Boom.badRequest()

    }
  }
}




module.exports = UsersController
