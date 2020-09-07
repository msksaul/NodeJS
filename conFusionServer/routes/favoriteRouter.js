const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require ('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user)
    Favorites.findOne({user: req.user._id})
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then((favorites) => {
        if (favorites) {
          let notAdded = false
          favorites.dishes.map((dish) => {
            if (dish == req.body._id) {
              notAdded = false
              res.statusCode = 403
              res.setHeader('Content-Type', 'application/json')
              res.end('Favorite dish already added!')
            }
            else {notAdded = true}
          })
          if (notAdded) {
          favorites.dishes.push(req.body._id)
          favorites.save()
            .then((favorites) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorites)
            }, (err) => next(err))
            .catch((err) => next(err))
          }
        }
        else {
          Favorites.create({user: req.user._id, dishes: req.body._id})
            .then((favorites) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorites)
            }, (err) => next(err))
            .catch((err) => next(err))
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then((favorites) => {
          favorites.remove()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json('Favorites deleted!')
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  favoriteRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('GET operation not supported on /favorites/ ' + req.params.dishId)
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then((favorites) => {
        console.log(favorites.dishes)
        if (favorites.dishes.length > 0) {
          let notAdded = false
          favorites.dishes.map((dish) => {
            if (dish == req.params.dishId) {
              notAdded = false
              res.statusCode = 403
              res.setHeader('Content-Type', 'application/json')
              res.end('Favorite dish already added!')
            }
            else {notAdded = true}
          })
          if (notAdded) {
          favorites.dishes.push(req.params.dishId)
          favorites.save()
            .then((favorites) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorites)
            }, (err) => next(err))
            .catch((err) => next(err))
          }
        }
        else if (favorites.dishes.length == 0) {
          favorites.dishes.push(req.params.dishId)
          favorites.save()
            .then((favorites) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorites)
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        else {
          err = new Error('No favorites document found for this user!')
          err.statusCode = 404
          return next(err) 
        }
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites/ ' + req.params.dishId)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
      let newDishes = []
      if (favorites.dishes.length > 0) {
        favorites.dishes.map((dish) => {
          if (dish._id != req.params.dishId) {
            newDishes.push(dish._id)
          }
        })
        favorites.dishes = []
        favorites.dishes.push(...newDishes)
        favorites.save()
          .then((favorites) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
          }, (err) => next(err))
      }
      else {
        err = new Error('No favorite dishes found!')
        err.statusCode = 404
        return next(err) 
      }
    }, (err) => next(err))
    .catch((err) => next(err))
  })

  module.exports = favoriteRouter;