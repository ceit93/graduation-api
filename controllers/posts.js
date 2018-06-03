const { Controller } = require('bak')
const { Post, User } = require('../models')
const Boom = require('boom')
const { upload, url } = require('@bakjs/minio')

class PostsController extends Controller {
  init () {
    this.get('/posts', this.showAllPosts)
    this.get('/posts/wall', this.showAllWall)
    this.post('/posts/wall/{user}', this.createPostWall)
    this.get('/posts/{post}', this.showPost)
    this.post('/posts/{post}', this.updatePost)
    this.post('/posts', this.createPost)
    this.delete('/posts/{post}', this.deletePost)
  }

  async showAllPosts (request, h) {
    try {
      let user = await User.findById(request.user._id).populate('posts')
      let posts = []
      for (let post of user.posts) {
        if (post.user.equals(request.user._id)) {
          posts.push(post)
        }
      }


      return { posts }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async showAllWall(request, h) {
    try {
      let user = await User.findById(request.user._id).populate('posts')
      let posts = []
      for (let post of user.posts) {
        if (!post.user.equals(request.user._id)) {
          posts.push(post)
        }
      }


      return { posts }
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
    let image = request.payload.image
    delete request.payload.image

    try {
      post = new Post(request.payload.data)
      post.user = request.user._id
      post.approved = false
      await post.save()
      if (image instanceof Buffer) {
        image = await upload('posts', post._id + '.jpg', image, 'image/jpeg')
        image = url('posts', post._id + '.jpg', image, 'image/jpeg')
      }
      post.image = image
      await post.save()
      let user = await User.findById(request.user._id)
      user.posts.push(post)
      await user.save()
      return post
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async createPostWall (request, h) {
    let post
    let image = request.payload.image
    delete request.payload.image

    try {
      post = new Post(request.payload.data)
      if (image instanceof Buffer) {
        image = await upload('p2l', item._id + '.jpg', image, 'image/jpeg')
        image = url('p2l', item._id + '.jpg', item.img, 'image/jpeg')
      }
      post.user = request.user._id
      post.approved = false
      await post.save()
      post.image = image
      let user = await User.findById(request.params.user)
      user.posts.push(post)
      await user.save()
      return post
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }

  async updatePost (request, h) {
    let post = request.params.post

    try {
      let toBeUpdatedPost = await Post.findById(post)
      if (request.user._id.equals(toBeUpdatedPost.user)) {
        toBeUpdatedPost.set(request.payload.data)
        if (request.payload.image instanceof Buffer) {
          toBeUpdatedPost.image = await upload('p2l', item._id + '.jpg', image, 'image/jpeg')
          toBeUpdatedPost.image = url('p2l', item._id + '.jpg', item.img, 'image/jpeg')
        }
        await toBeUpdatedPost.save()
        return { updated: true }
      } else {
        return Boom.unauthorized()
      }
    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }

  }

  async deletePost (request, h) {
    let post = request.params.post

    try {
      let toBeDeletedPost = await Post.findById(post)
      if (request.user._id.equals(toBeDeletedPost.user)) {
        let user = await User.findOne({posts: post})
        for (let post in user.posts) {
          if (user.posts[post].equals(toBeDeletedPost._id)) {
            user.posts.slice(post, 1)
            break
          }
        }
        await user.save()
        post = await Post.findByIdAndRemove(post)
        return { deleted: true }
      } else {
        return Boom.unauthorized()
      }

    } catch (e) {
      console.log(e)
      throw Boom.badRequest()
    }
  }
}

module.exports = PostsController
