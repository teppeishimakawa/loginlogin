var connection = require('./mysqlConnection.js');

module.exports = function(req, res, next) {
//一度loginしていたらreq.session.user_idにrows[0].user_idが入っている
  var userId = req.session.user_id;
  if (userId) {
    var query = 'SELECT user_id, user_name FROM users WHERE user_id = ' + userId;
    connection.query(query, function(err, rows)
    {
      if (!err) {
  /*res.locals.user = ~という処理がありますが、これは今まで
  res.render('index', { user: user });のようにViewファイルに値を
  渡していましたが、実はこのように渡すことも可能です。*/
        res.locals.user = rows.length? rows[0]: false;
      }
    });
  }
  //renderは次のjsにて。その時にuser渡される
  next();
};
