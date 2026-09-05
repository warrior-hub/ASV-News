const multer = require("multer");
const storage = require("../config/cloudinaryStorage");

const upload = multer({
   
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  
});

    
module.exports = upload;