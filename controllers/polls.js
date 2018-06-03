const { Controller } = require('bak')
const { Vote } = require('../models')
const { User } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.getSavedPollsByUser)
    this.get('/polls/{username}', this.getVotesForUser)
  }


  async submitPolls (request, h) {
    let user = request.user
    let votes = request.payload.data.votes
    console.log(request.payload.data)
    let votesResults = []

    try {

      for(let vote of votes){
        let qualObjectId, candidateObjectId
        let studentNumber = vote.toObject().std_numbers[0]
        // console.log(vote._id)
        let user = await User.findOne({std_numbers:studentNumber})
        if(user){
          candidateObjectId = user.name
        }
        let qualification = await Qualification.findOne({title:vote.title})
        if(qualification){
          qualObjectId = qualification._id
        }
        //
        // console.log(candidateObjectId)
        // console.log(qualObjectId)
        //
        // let vote = new Vote()
        // vote.candidate = candidateObjectId
        // vote.qualification = qualObjectId
        // await vote.save()
        // votesResults.push(vote)
      }

      user.votes = votesResults
      user.save()

      return votes
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getVotesForUser (request, h) {

    let voteResults = []

    try {
      let user = await User.findOne({username:request.params.username})
      let allVotes = await Vote.find().populate('candidate')
      for(let vote of allVotes){
        if(vote.candidate.username === request.params.username){
          let tarin = await Qualification.findById(vote.qualification)
          voteResults.push(tarin.title)
        }
      }



      return voteResults

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