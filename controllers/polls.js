const { Controller } = require('bak')
const { Vote } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.getSavedPollsByUser)
    this.get('/polls/results', this.getAllVoteResults)
  }


  async submitPolls (request, h) {
    try {
      let user = await User.findById(request.user._id)
      let votes = request.payload.votes
      user.votes = votes
      await user.save()
      return user.votes
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getAllVoteResults (request, h) {
    if (request.user.is_admin) {


      let totalResults = []
      try {
        let targetUsers = await User.find()
        let i = 0
        let users = await User.find()
        for (let targetUser of targetUsers) {
          let voteResults = []
          for (let user of users) {
            for (let vote of user.votes) {
              if (vote.candidate) {
                if (targetUser._id.equals(vote.candidate)) {
                  let voteResult = {}
                  let voter = user
                  voteResult.tarin = vote.qualification.title
                  voteResult.voter = voter.name
                  voteResults.push(voteResult)
                }
              }
            }
          }
          let totalResult = {}
          totalResult.name = targetUser.name
          totalResult.votes = voteResults
          totalResults.push(totalResult)
        }

        return totalResults

      } catch (e) {
        console.log(e)
        throw Boom.badRequest()
      }
    } else {
      return Boom.unauthorized()
    }
  }





  async getSavedPollsByUser (request, h) {
    let voteResults = []
    let user
    try {
      user = await User.findById(request.user._id)
      let votes = user.votes.toObject()
      if (!user.locked){
        user.locked = true
        await user.save()
        let quals = await Qualification.find({approved: true})
        // Find the new approved qualification
        for(let i in quals){
          let qual = quals[i]
          let found = false
          for (let j in votes){
            let vote = votes[j]
            if(qual._id.equals(vote.qualification._id))
              found = true
          }
          if (!found){
            console.log(i + ': NOT FOUND')
            let vote = new Vote()
            vote.qualification = qual
            vote.candidate = null
            votes.push(vote)
          }
        }
        user.locked = false
        user.votes = votes
        await user.save()
        return user.votes
      } else {
        throw Boom.badRequest()
      }
    } catch (e) {
      console.log(e)
      user.locked = false
      await user.save()
      throw Boom.badRequest()
    }
  }



}

module.exports = PollsController
