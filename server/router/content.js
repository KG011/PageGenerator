// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/content");

//获取编辑数据
router.post("/insertContent", controllers.insertContent);
router.post("/getDataJson", controllers.getDataJson);


// 导出router
module.exports = router;