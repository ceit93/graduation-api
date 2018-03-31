const { Controller } = require('bak')
const { Post } = require('../models')
const Boom = require('boom')

class PostsController extends Controller {
  init () {
    this.get('/posts', this.showAllPosts)
    this.get('/posts/{post}', this.showPost)
    this.post('/posts/{post}', this.updatePost)
    this.post('/posts', this.createPost)
    this.delete('/posts/{post}', this.deletePost)
  }

  async showAllPosts (request, h) {
    try {
      posts = await Post.find()
      return posts
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showPost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findById(post)
      if (post) {
        return post
      } else {
        return Boom.notFound()
      }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async createPost (request, h) {
    let post

    try {
      post = new Post(request.payload)
      await post.save()
      return post
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async updatePost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findById(post)
      post.set(request.payload)
      await post.save()
      return { updated: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async deletePost (request, h) {
    let post = request.params.post

    try {
      post = await Post.findByIdAndRemove(post)
      return { deleted: true }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = PostsController
