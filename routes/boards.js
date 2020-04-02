/*queryをネスト化する理由は、関数が非同期処理なため。同一関数内なら上から
順次処理する、同期処理になる*/

var express = require('express');
var router = express.Router();
//時刻モジュール
var moment = require('moment');
//file uploadモジュール
var multer = require('multer');
var connection = require('./mysqlConnection');
var upload = multer({ dest: './public/images/uploads/' });
//clouduploadサービス
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dvrhecg2w',
  api_key: '795361813436253',
  api_secret: 'OeTNkxODvwjspFR1_91VVswaQck'
});


/* /がboard.js。その下のreq.params.board_idが/:board_id。これをreqされた時の動きが以下*/
/*ルートパラメータ利用は:をつける。このケースではboard_id番号と同じパラメータをboard_numとした */
router.get('/:board_num',function(req, res, next) {
  //formから送られてないのでbodyでなくparam
  var boardId = req.params.board_num;
  var getBoardQuery = 'SELECT * FROM boards WHERE board_id = ' + boardId;
  var getMessagesQuery = 'SELECT M.message, M.image_path, ifnull(U.user_name, \'名無し\') AS user_name, DATE_FORMAT(M.created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.board_id = ' + boardId + ' ORDER BY M.created_at ASC';
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
//image_fileはinputタグに設定したname属性
router.post('/:board_num',upload.single('image_file'),function(req, res)
{
  console.log(req.file);
  var path = req.file.path;
  var message = req.body.message;
  //urlパラメータの番号
  var boardId = req.params.board_num;
  //sessionに紐づかせたuser_id
  var userId = req.session.user_id? req.session.user_id: 0;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  cloudinary.uploader.upload(path, function(result)
  {
   var imagePath = result.url;
   var query = 'INSERT INTO messages (image_path, message, board_id, user_id, created_at) VALUES ("' + imagePath + '",' + '"' + message + '", ' + '"' + boardId + '", ' + '"' + userId + '", ' + '"' + createdAt + '")';
  connection.query(query, function(err, rows)
    {
    res.redirect('/boards/' + boardId);
    });
  });
});

module.exports = router;