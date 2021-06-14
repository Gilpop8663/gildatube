import { render } from "pug";
import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { token } from "morgan";

export const getJoin = (req, res) => res.render("join",{pageTitle:"Join"})
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "Password confirmation does not match.",
      });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).render("join", {
        pageTitle,
        errorMessage: "This username/email is already taken.",
      });
    }
    try {
        await User.create({
          name,
          username,
          email,
          password,
          location,
        });
        return res.redirect("/login");
      } catch (error) {
        return res.status(400).render("join", {
          pageTitle: "Upload Video",
          errorMessage: error.errmsg
        });
      }
    };
export const edit = (req,res) => res.send("Edit User");
export const getLogin = (req,res) => res.render("login",{pageTitle:"Login"});
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username,socialOnly:false });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "An account with this username does not exists.",
      });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("login", {
        pageTitle,
        errorMessage: "Wrong password",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  };
export const logout = (req,res) =>{
  req.session.destroy();//쿠키 세션의 user의 session 을 파괴함
  return res.redirect("/");
};
export const see = (req,res) => res.send("See User");

export const startGithubLogin = (req,res) =>{
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id:process.env.GH_CLIENT,
    allow_signup:false,
    scope:"read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`; 
  return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req,res) => {
  const baseUrl="https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code
  }
  const params =new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  // fetch(x),then(response => response.json()).tehn( json => access_token fetch)
  const tokenRequset = await (await fetch(finalUrl,{
    method:"POST",
    headers:{
      Accept: "application/json",
    }
  })).json();
  if("access_token" in tokenRequset) {
    const {access_token} = tokenRequset;
    const  apiUrl = "https://api.github.com"
    const userData = await (await fetch(`${apiUrl}/user`,{
      headers:{
        Authorization: `token ${access_token}`,
      }
    })).json();
    const emailData = await (await fetch(`${apiUrl}/user/emails`,{
      headers:{
        Authorization: `token ${access_token}`,
      }
    })).json();

    const emailObj = emailData.find(
       (email) => email.primary ===true && email.verified === true );
    if (!emailObj) {
      return res.redirect("/login")
    }
    let user = await User.findOne({email : emailObj.email}) //우리의 데이터에서 이미 해당 이메일을 가지고 있는지 체크한다
    if (!user){
       user = await User.create({  /// 우리의 데이터에서 해당 이메일이 없으므로 새롭게 user 데이터에서 유저의 데이터를 깃허브에서 준 데이터를 바탕으로 만들어준다
        avatalUrl:userData.avatar_url,
        name:userData.name ? userData.name:"Unknown",
        username:userData.login,
        email:emailObj.email,
        password:"",
        socialOnly:true,//포스트 로그인에서 체크하려고 해당 스키마와 소셜온리를 체크하는것이다
        location:userData.location,
      });
    }
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }else{
    return res.redirect("/login")
    }
  };