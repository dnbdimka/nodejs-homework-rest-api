const Jimp = require('jimp')

const resizeImageByJimp = async (image) => {
  await Jimp.read(image)
    .then((img) => {
      return img
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .write(image) // save
    })
    .then()
    .catch((err) => {
      console.error(err)
    })
}

module.exports = resizeImageByJimp
