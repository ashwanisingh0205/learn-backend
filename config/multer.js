import crypto from 'crypto'
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/imgaes/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12,function(err,bytes){
          const fn=bytes.toString('hex') + path.extname(file.originalname)
          cb(null, fn )
       })
     
    }
  })
  
  const upload = multer({ storage: storage })
  export default upload;