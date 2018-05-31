const { Controller } = require('bak')
const { Poll } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPoll)
    this.get('/polls', this.showAllPolls)
    // this.get('/polls/{username}', this.showPollsByUser)
    this.get('/polls/subject/{subject}', this.getPollsBySubject)
  }

  async showAllPolls (request, h) {
    let polls
    try {
      polls = await Poll.find()
      return { polls }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getPollsBySubject (request, h) {
    let subject = request.params.subject
    let qualificationTitle
    try {
      let qualifications = await Qualification.find({title:subject})
      for (let qualification of qualifications) {
        qualificationTitle = qualification.title
      }

      let polls = await Poll.find({subject:qualificationTitle})

      return {polls}
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async submitPoll (request, h) {
    let poll
    try {
      poll = new Poll(request.payload)
      await poll.save()
      return poll
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showPollsByUser (request, h) {
    let username = request.params.username
    console.log(username)
    let poll
    let user

    try {
      user = await User.find({username:username})
      //find user's objectID and query polls by that
      // poll = await Poll.find({subject:"user"})
      if (user) {
        return user
      } else {
        return Boom.notFound()
      }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }


}

module.exports = PollsController