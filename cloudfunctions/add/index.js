// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const com = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('articles').doc(event.taskId).update({
      // data 传入需要局部更新的数据
      data: {
        click: event.clicked
      }
    })
      .then(console.log)
      .catch(console.error)
  } catch (e) {
    console.error(e)
  }
}