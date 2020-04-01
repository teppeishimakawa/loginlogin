var express = require('express');
var router = express.Router();
var connection = require('./mysqlConnection.js');

router.get('/', function(req, res, next) {
  if (req.session.user_id) {
//req.session.user_idがある=すでにログインしているユーザーは/にリダイレクト
    res.redirect('/');
  } else {
    res.render('login.ejs', {
      title: 'ログイン'
    });
  }
});

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var query = 'SELECT user_id FROM users WHERE email = "' + email + '" AND password = "' + password + '" LIMIT 1';
  connection.query(query, function(err, rows) {
    var userId = rows.length? rows[0].user_id: false;
    if (userId) {
// '/'にリダイレクトする前にセッションにユーザーIDを保存しています。←超重要
//req.session以下にデータを格納することでセッションへのデータ格納が実現できます。
      req.session.user_id = userId;
      res.redirect('/');
    } else {
      res.render('login.ejs', {
        title: 'ログイン',
        noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
      });
    }
  });
});

module.exports = router;
