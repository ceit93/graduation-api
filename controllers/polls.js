const { Controller } = require('bak')
const { Poll } = require('../models')
const { User } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    // this.get('/polls', this.showAllPolls)
    this.get('/polls/{username}', this.getSavedPollsByUser)
    // this.get('/polls/subject/{subject}', this.getPollsBySubject)
  }


  async submitPolls (request, h) {
    let voterUsername = request.payload.voter
    let voterObjectID

    try {
      let users = await User.find({username:voterUsername})
      for(let user of users){
        voterObjectID = user._id
      }

      let polls = await Poll.find({owner:voterObjectID})

      if(polls.length > 0){
        for(let poll of polls){
          poll.votes = request.payload.votes
          await poll.save()
        }
      }
      else{
        let poll = new Poll()
        poll.owner = voterObjectID
        poll.votes = request.payload.votes
        await poll.save()
      }
      return polls
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getSavedPollsByUser (request, h) {
    let username = request.params.username
    let voterObjectID
    let result
    let polls

    try {
      let users = await User.find({username:username})
      for(let user of users){
        voterObjectID = user._id
      }

      polls = await Poll.find({owner:voterObjectID})
      if(polls.length > 0) {
        for (let poll of polls) {
          result = poll.votes
        }
      } else {
        return []
      }
      return result
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }



}

module.exports = PollsController