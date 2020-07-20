const express = require("express");
const multer = require("multer");
const ImageModel = require("../models/image");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
}).single("myImage");

router.post("/image-upload", (req, res) => {
  return upload(req, res, (err) => {
    if (err)
      return res.status(400).json({
        error: err,
      });

    /*Now do where ever you want to do*/
    console.log("Request ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.

    const newImage = new ImageModel({
      imageName: req.file.originalname,
      imageData: req.file.path,
    });

    newImage.save((err, result) => {
      if (err)
        return res.status(400).json({
          error: err,
        });

      console.log(result);

      return res.status(200).json({
        success: true,
        document: result,
      });
    });
  });
});

module.exports = router;
