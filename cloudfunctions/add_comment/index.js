// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const com = db.command

exports.main = async (event, context) => {
  return await new Promise((resolve, reject) => {
    db.collection('articles_node').doc(event.taskId).update({
      // data 传入需要局部更新的数据
      data: {
        comment: event.my_comment
      }
    })
  })
}