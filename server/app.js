// 导入 express 模块
const express = require("express");
const joi = require("joi");
// 创建 express 服务器实例
const app = express();
const db = require("./config/db/index"); // 导入数据库操作模块

// 导入 cors 中间件，解决跨域问题
const cors = require("cors");
// 将 cors 注册为全局中间件
app.use(cors());

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
// 处理JSON格式:Content-Type: application/json;
app.use(express.json());

// 导入 express-jwt 并解构
const expressJWT = require('express-jwt')


// 导入路由模块
const userRouter = require("./router/user");
// 注册路由模块
app.use("/user", userRouter);
// 导入路由模块
const contentRouter = require("./router/content");
// 注册路由模块
app.use("/content", contentRouter);

// 密钥
const { secretKey } = require("./config/config");
// 使用 express-jwt 这个中间件，排除注册和登录
app.use(
  expressJWT.expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/user/],
  })
)


// 定义错误级别中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError)
    return res.send({
      status: 400,
      msg: "请求参数不合法" + err.message,
    });
  // 身份认证失败错误
  if (err.name === "UnauthorziedError")
    return res.send({ status: 401, msg: "无效的token！" });
  // 其它错误
  res.send({
    status: 500,
    msg: err.message,
  });
});

// 调用 app.listen 方法，指定端口号启动 web 服务器
app.listen(3000, () => {
  console.log("api server running at http://127.0.0.1:3000");
});