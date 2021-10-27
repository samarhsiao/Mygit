const express = require('express');
const router = express.Router();
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-images');


router.route('/:sid')
 .get(async (req, res) => {
     const sql = "SELECT * FROM `member` WHERE sid=?";
     const [rs] = await db.query(sql, [req.params.sid]);

     if (rs.length) {
       res.render('/stprofile', {
         row: rs[0]
       });
     } else {
       res.redirect('/stprofile')
     }
   })
   .post(async (req, res) => {
     // TODO: 欄位檢查
     const output = {
       success: false,
       postData: req.body,
     }

     const input = {
       ...req.body
     };
     const sql = "UPDATE `member` SET ? WHERE sid=?";
     let result = {};

     try {
       [result] = await db.query(sql, [input, req.params.sid]);
     } catch (ex) {
       output.error = ex.toString();
     }
     output.result = result;
     if (result.affectedRows === 1) {
       if (result.changedRows === 1) {
         output.success = true;
       } else {
         output.error = '資料沒有變更'

       }
     }
     res.json(output);

   });






 module.exports = router;