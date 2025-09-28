const express = require("express"),
  router = express.Router(),
  middleware = require("../middleware/authentication");


// ROOT ROUTE (landing page)
router.get('/', function (req, res) {
  res.render("landing");
  
});

// HOME/PRODUCTS
router.get("/products", middleware.isLoggedIn, function (req, res) {
  res.render("home");
});

// CONTACTS PAGE
router.get("/contact", function(req, res) {
  res.render("contact");
});

// NEW ROUTE
router.get("/products/new", middleware.isLoggedIn, function (req, res) {
  res.render("new");
});

//CREATE ROUTE
router.post("/products/new", middleware.isLoggedIn, function (req, res) {

  var study = req.body.study,
    site = req.body.site,
    subj = req.body.subj,
    lot = req.body.lot,
    prodType = req.body.prodType,
    collectdate = req.body.collectdate,
    processver = "semi-automated",
    mfgsite = req.body.mfgsite,
    collecttime = req.body.collecttime,
    dose = req.body.dose,
    tdxcells = req.body.tdxcells,
    username = res.locals.username;

  // add to tblIndex
  let queryStr = `INSERT INTO tblIndex(study, site, subj, lot, prodType, collectdate, idate, processver, mfgsite, collecttime, dose, tdxcells, moduser)
                  VALUES ('${study}', '${site}', '${subj}', '${lot}', '${prodType}', '${collectdate}', '${collectdate}', '${processver}', '${mfgsite}', '${collecttime}', '${dose}', '${tdxcells}', '${username}')`;
  db.all(queryStr, function (err, results) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        // console.log(err);
        req.flash("error", `Lot number ${lot} already exists!`);
        res.redirect("/products/new");
      } else {
        // console.log(err);
        let displayError = JSON.stringify(err.message)
        req.flash("error", displayError);
        res.redirect("/products/new")
      }

    } else {
      req.flash("success", "New Lot added successfully!")
      res.redirect("/products");
    }
  });

});

module.exports = router;

// "SQLITE_CONSTRAINT: UNIQUE constraint failed: tblIndex.lot"