// ====================================
// DEPENDENCY CONSTANTS
// ====================================
const express = require("express"),
      app = express(),
      session = require("cookie-session"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      data = require("./data"),
      sqlite3 = require("sqlite3").verbose(),
      flash = require("connect-flash"),
      cookieParser = require("cookie-parser"),
      http = require("http");
// ======================================

// ====================================================
// DEFINE POINTERS TO CORRESPONDING ROUTES FILE
// ====================================================
const indexRoutes = require("./routes/index"),
      carTRoutes = require("./routes/products/carT"),
      nkcarRoutes = require("./routes/products/nkCar"),
      hpcRoutes = require("./routes/products/HPC");
// =====================================================

app.use(methodOverride("_method")); //necessary for converting POST route to PUT route when changing data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");//tells app all view files are written in ejs
app.use(express.static(__dirname + "/public"));//points app to static assets (pictures, logos, etc..)

// ======================================
// SESSION AND SECURE COOKIE SETUP
// ======================================
app.use(cookieParser());
app.use(session({
  secret: "m@vb10",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Creates local variable to be filled with flash message
app.use(function(req, res, next){
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// ======================================


// ========================================================================
// POINTS APP TO EACH ROUTER MINI-APP BASED ON URL AND ROUTES DEFINED ABOVE
// ========================================================================
app.use("/", indexRoutes);
app.use("/products/carT", carTRoutes);
app.use("/products/nkCar", nkcarRoutes);
app.use("/products/HPC", hpcRoutes);
// ========================================================================



app.listen(process.env.PORT || 3000, process.env.IP, function(){
  // console.log("Running ctisDemo");
  // console.log(process.env);
});
