import { Router } from 'express';
import axios from 'axios';
import fs from 'fs';

const routes = Router();

var fourchanapi = axios.create({
  baseURL: 'https://a.4cdn.org/'
});

//http(s)://i.4cdn.org/board/tim.ext

var images = axios.create({
  baseURL: 'https://i.4cdn.org/',
  responseType: 'arraybuffer'
});
/**
 * GET home page
 */


routes.get('/', (req, res) => {
  fourchanapi.get('/gif/thread/12203970.json')
  .then(function (response) {
    console.log("response here");
    // console.log(response.data.posts);
    // res.send(JSON.stringify(response));
    response.data.posts.forEach(function(post) {
    // var post = response.data.posts[3];
      // console.log(post.filename);
      // res.send(post.filename);
      // console.log('i.4cdn.org/gif/'+ post.tim + post.ext);
      images.get('/gif/'+ post.tim + post.ext)
      .then(function (img) {
        fs.writeFile('cache/' + post.filename + post.ext, img.data, 'binary', function(err){
            if (err) throw err
            console.log(`${post.filename} saved`);
        });
        // res.type('image/jpeg');
        // res.end( img.data, 'binary' );
      })
      .catch(function (error) {
        console.log(error);
      });
    });
    res.send("finished.");
  })
  .catch(function (error) {
    console.log(error);
    res.send(error)
  });
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

export default routes;
