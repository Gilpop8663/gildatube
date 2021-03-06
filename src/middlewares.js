import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials:{
        accessKeyId:process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
    }
})
export const isHeroku = process.env.NODE_ENV ==="production"

const multerImgUpload = multerS3({
      s3: s3,
      bucket: 'gildatube/images',
      acl: 'public-read',});

const multerVideoUpload = multerS3({
    s3: s3,
    bucket: 'gildatube/videos',
    acl: 'public-read',});

export const localsMiddleware = (req,res,next) =>{
    // console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "GildaTube";
    res.locals.loggedInUser = req.session.user || {};
    // console.log(req.session.user)
    res.locals.isHeroku = isHeroku;
    next();
}

export const protectorMiddleware = (req,res,next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req,res,next) =>{
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}

export const avatarUpload = multer({ dest: 'uploads/avatars/', limits:{ fileSize:3000000,},storage: isHeroku ? multerImgUpload  : undefined,});
export const videoUpload = multer({ dest: 'uploads/videos/' , limits:{ fileSize:10000000,},storage: isHeroku ? multerVideoUpload : undefined,});