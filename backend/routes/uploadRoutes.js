import path from 'path'
import express, { Router } from 'express'
import multer from 'multer'
const router = express.Router()

//define the storage configuration which takes in the destination & filename
const storage = multer.diskStorage({
  //destination for files
  destination: (req, file, cb) => {
    //call the callback null for error, and add where we want the files to be uploaded
    cb(null, 'uploads/')
  },

  //Define a unique filename by using file.fieldname & adding date/time
  //Avoid using file.originalname in case there will be uploaded file with same filename
  //Get the file extension using path method .extname() and add in the filename
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

//validation for file type allowed
//test() method is use for comparison and will return true or false
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,

  //create file filter function to check types of file allowed to be uploaded
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

//define route or endpoint | pass in the middleware upload
//in frontend, this can be used to setup the image state that will go to the database
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router
