const env=require('./config/environment');
const logger=require('morgan');

const express = require("express");
const db = require("./config/mongoose");
const app = express();
//used to populoate in the views the actual filepath with hash (for the css files) in prod
require("./config/view-helpers")(app);
const cookieParser = require("cookie-parser");
const port = 8080;

//for passport
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle=require("./config/passport-google-oauth2-strategy");
const sassMiddleware = require("node-sass-middleware");
const MongoStore = require("connect-mongo");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

//socket.io 
const chatServer= require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);

const path=require('path');

if(env.name){
  app.use(
    sassMiddleware({
      src: path.join(__dirname,env.asset_path,'/scss'),
      dest: path.join(__dirname,env.asset_path,'/css'),
      debug: false,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

app.use(express.urlencoded());
app.use(cookieParser());

app.use(expressLayouts);
app.set("layout extractStyles", true);

// app.set("layout","./layouts/layout");
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(env.asset_path));
app.use('/uploads',express.static('./uploads'));

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/codeial_development",
        autoRemove: "disabled",
      },
      (err) => {
        console.log(err || "connect ok -->session db");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.createFlash);

app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error!");
    return;
  }

  console.log("Success!");
});
