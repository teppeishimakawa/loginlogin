/*queryをネスト化する理由は、関数が非同期処理なため。同一関数内なら上から
順次処理する、同期処理になる*/

var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('./mysqlConnection');


/* /がboard.js。その下のreq.params.board_idが/:board_id。これをreqされた時の動きが以下*/
/*ルートパラメータ利用は:をつける。このケースではboard_id番号と同じパラメータをboard_numとした */
router.get('/:board_num', function(req, res, next) {
  //formから送られてないのでbodyでなくparam
  var boardId = req.params.board_num;
  var getBoardQuery = 'SELECT * FROM boards WHERE board_id = ' + boardId;
  var getMessagesQuery = 'SELECT *, DATE_FORMAT(created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM messages WHERE board_id = ' + boardId;
  connection.query(getBoardQuery, function(err, board) {
    connection.query(getMessagesQuery, function(err, messages) {
      res.render('board.ejs', {
/*boardは1件しかデータが返ってこない場合でも必ず配列で返ってくるので、board[0]で展開して渡すとView側で使いやすい。*/
        title: board[0].title,
        board: board[0],
        messageList: messages
      });
    });
  });
});

router.post('/:board_num', function(req, res, next) {
  var message = req.body.message;
  var boardId = req.params.board_num;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var query = 'INSERT INTO messages (message, board_id, created_at) VALUES ("' + message + '", ' + '"' + boardId + '", ' + '"' + createdAt + '")';
  connection.query(query, function(err, rows) {
    res.redirect('/boards/' + boardId);
  });
});

module.exports = router;