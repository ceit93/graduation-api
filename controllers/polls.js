const { Controller } = require('bak')
const { Poll } = require('../models')
const { User } = require('../models')
const { Vote } = require('../models')
const { Qualification } = require('../models')
const Boom = require('boom')

class PollsController extends Controller {
  init (){
    this.post('/poll/submit', this.submitPolls)
    this.get('/polls', this.showAllPolls)
    this.get('/polls/{username}', this.getSavedPollsByUser)
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

  async submitPolls (request, h) {
    let voterUsername = request.payload.voter
    let voterObjectID
    let votesArray = []
    let votes = request.payload.votes
    try {
      for(let vote of votes){
        let candidates = await User.find({username:vote.username})
        let candidateID
        for(let candidate of candidates){
            candidateID = candidate._id
        }

        let qualifications = await Qualification.find({title:vote.title})
        let qualificationID
        for(let qual of qualifications){
          qualificationID = qual._id
        }

        let newVote = new Vote()
        newVote.subjectID = qualificationID
        newVote.candidateID = candidateID
        await newVote.save()
        votesArray.push(newVote._id)
      }

      console.log(votesArray)

      let users = await User.find({username:voterUsername})
      for(let user of users){
        voterObjectID = user._id
      }

      let polls = await Poll.find({owner:voterObjectID})

      if(polls.length > 0){
        for(let poll of polls){
          poll.votes = votesArray
          await poll.save()
          // console.log(newVotesArray)
        }
      }
      else{
        let poll = new Poll()
        poll.owner = voterObjectID
        poll.votes = votesArray
        await poll.save()
      }
      return votes
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async getSavedPollsByUser (request, h) {
    let username = request.params.username
    let user
    let voterObjectID
    let result
    let userVotes
    let polls
    let v

    try {
      let users = await User.find({username:username})
      for(let user of users){
        voterObjectID = user._id
      }

      polls = await Poll.find({owner:voterObjectID})
      for(let poll of polls){
        for(let vote of poll.votes){
          console.log((vote._id))
          v = await Vote.findById("5b104d4713bed515d6d33017")
          // userVotes.push(await Vote.findById(vote))
        }
      }

      return polls
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