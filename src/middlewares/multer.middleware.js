// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp')
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer(
//     { 
//         storage, 
//     }
// )
//MULTER WORKFLOW
// const express = require('express');
// const multer = require('multer');

// const app = express();

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Where uploaded files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // File naming
//   }
// });

// // Create Multer instance with the configured storage options
// const upload = multer({ storage: storage });

// // Define a route that accepts file uploads
// app.post('/upload', upload.single('file'), (req, res) => {
//   // Access uploaded file via req.file
//   res.send('File uploaded successfully');
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
//WRITTEN BY MYSELF
// import multer from "multer"
// const storage = multer.diskStorage({
//     destination: function ( req, file , cb) {
//         cb(null, './public/temp')//null indicated no error
//     },
//     filename: function( req , file , cb){
//         cb(null,file.originalname)
//     }
// })

// export const upload = multer({
//     storage,
// })
