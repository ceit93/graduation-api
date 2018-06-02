const { Controller } = require('bak')
const { Vote } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.getSavedPollsByUser)
  }


  async submitPolls (request, h) {
    let user = request.user
    let votes = request.payload.votes
    let votesResults = []

    try {

      for(let v of votes){
        let qualObjectId, candidateObjectId
        let user = await User.findOne({username:v.username})
        if(user){
          candidateObjectId = user._id
        }
        let qualification = await Qualification.findOne({title:v.title})
        if(qualification){
          qualObjectId = qualification._id
        }
        // let voteResult = {}
        // voteResult.candidate = candidateObjectId
        // voteResult.qualification = qualObjectId
        // votesResults.push(voteResult)
        let vote = new Vote()
        vote.candidate = candidateObjectId
        vote.qualification = qualObjectId
        await vote.save()
        votesResults.push(vote)
      }

      user.votes = votesResults
      user.save()

      return votesResults
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getSavedPollsByUser (request, h) {

    let voteResults = []

    try {

      let user = await User.findById(request.user._id).populate('votes')

      for(let vote of user.votes){
        let voteResult = {}
        let voteQualification = await Qualification.findById(vote.qualification)
        voteResult.title = voteQualification.title

        let voteCandidate = await User.findById(vote.candidate)
        voteResult.username = voteCandidate.username

        voteResults.push(voteResult)
      }

      return voteResults

    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }



}

module.exports = PollsController