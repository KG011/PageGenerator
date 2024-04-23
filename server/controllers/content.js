
const db = require("../config/db/index"); // 导入数据库操作模块
exports.insertContent = (req, res) => {
    const data = req.body
    const insertSql = `UPDATE data SET data_json = JSON_MERGE_PATCH(data_json, ?) WHERE id = ?;`
    db.query(insertSql, [data.json,data.userId],(err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            content: results,
        });
    });
};
exports.getDataJson = (req, res) => {
    const data = req.body
    const insertSql = `select * from data where id=?;`
    db.query(insertSql, data.userId,(err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            JsonData: results,
        });
    });
};
