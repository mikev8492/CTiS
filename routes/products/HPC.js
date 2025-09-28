const express = require("express"),
      router = express.Router(),
      middleware = require("../../middleware/authentication");

// ================
// QUERY VARIABLES
// ================
var indexResult = [],
    dataResult = [],
    lotIndex = [],
    initDate = [],
    mfgSite = [],
    lock = [],
    cryoDate = [],
    dataDump = [],
    lotDataDump = [];

// ========================================
// INDEX ROUTE
// ========================================
router.get("/", middleware.isLoggedIn, function(req, res){

  let queryStr = `SELECT CONCAT(study, '-', site, '-', subj, '-', lot) AS lotNum, idate AS initDate, mfgsite, pK_ID, tblHPC_Cryo.cryo_lock, tblHPC_Cryo.cryo_procDate FROM tblIndex INNER JOIN tblHPC_Cryo ON (tblIndex.lot = tblHPC_Cryo.fk_lot) WHERE prodType = 'HPC' ORDER BY idate desc`  


  // db global variable defined and exported from data.js
  db.all(queryStr, function (err, results) {
    function indexLots() {

      // loop through the objects array

      for (let i = 0; i < results.length; i++) {
        mfgSite.push(results[i].mfgsite)
        initDate.push(results[i].initDate)
        lotIndex.push(results[i].pk_ID)
        indexResult.push(results[i].lotNum)
        lock.push(results[i].cryo_lock)
        cryoDate.push(results[i].cryo_procDate)
      }
    }

    if (err) {
      console.log(err);
      let displayError = JSON.stringify(err.message);
      req.flash("error", `Error: ${displayError}`);
      res.redirect("/products");
    } else if (indexResult.length === 0) { //prevents pushing duplicates to indexResult if the page was already loaded
      indexLots();
      res.render("products/HPC/index", {
        lot: indexResult,
        id: lotIndex,
        date: initDate,
        site: mfgSite,
        lock: lock,
        cryoDate: cryoDate
      });

    } else if (results.length !== indexResult.length) { //checks for added lots
      indexResult = []
      mfgSite = []
      initDate = []
      lotIndex = []
      lock = []
      cryoDate = []

      indexLots();
      res.render("products/HPC/index", {
        lot: indexResult,
        id: lotIndex,
        date: initDate,
        site: mfgSite,
        lock: lock,
        cryoDate: cryoDate
      });

    } else {
      indexResult = []
      mfgSite = []
      initDate = []
      lotIndex = []
      lock = []
      cryoDate = []

      indexLots();
      res.render("products/HPC/index", {
        lot: indexResult,
        id: lotIndex,
        date: initDate,
        site: mfgSite,
        lock: lock,
        cryoDate: cryoDate
      });
    }
  });   
});

// =================================================
// EDIT ROUTE
// =================================================
router.get("/:id/edit",middleware.isLoggedIn, function(req, res){
  var currentLot = req.params.id;
  // console.log(req.params);

  let queryStr = `SELECT * FROM qryHPC_All WHERE pk_ID = ${req.params.id}`;

  db.all(queryStr, function (err, results){
    if (err) {
      console.log(err);
      let displayError = JSON.stringify(err.message);
      req.flash("error", `Error: ${displayError}`);
      res.redirect("/products/HPC");
    } else{
      for (let i = 0; i < results.length; i++) {
        dataResult = results[i];
      }
      // console.log(dataResult);
      res.render("products/HPC/edit", {data: dataResult, lot: indexResult, id: lotIndex, currentLot: currentLot})
    }
  });
});

// =================================================
// UPDATE ROUTE
// =================================================
router.put("/:lot",middleware.isLoggedIn, function (req, res){
  // console.log(req.body);
  // console.log(req.params);
  // console.log(req.query);
  var tableName = Object.keys(req.body),
    columns = Object.keys(req.body[tableName]),
    values = Object.values(req.body[tableName]),
    setValues = "",
    username = res.locals.username;

  for(let i = 0; i < columns.length; i++){
    if (i < columns.length - 1){
      setValues += `${columns[i]} = '${values[i]}', `;
    } else {
      setValues += `${columns[i]} = '${values[i]}'`;
    }
  }
  // setValues += `moduser = '${username}' `;

  let queryStr = `UPDATE tblHPC_${tableName} SET ${setValues} WHERE fk_lot = '${req.params.lot}'`;
  // console.log(queryStr);

  db.all(queryStr, function (err, results) {
    if (err) {
      console.log(err);
      let displayError = JSON.stringify(err.message);
      req.flash("error", `Error: ${displayError}`);
      res.redirect(`/products/HPC/${req.query.id}/edit`);
    } else {
      dataResult = [];
      req.flash("success", "Lot updated");
      res.redirect(`/products/HPC/${req.query.id}/edit`);

    }
  });
});


// =============================================
// JSON DOWNLOAD API FOR ALL HPC LOTS
// =============================================
router.get("/download",middleware.isLoggedIn, function (req, res) {
  let queryStr = "SELECT * FROM qryHPC_All"; //Uses qryAll view instead of running query manually
  // qryAll view creates table with all process data 

  db.all(queryStr, function (err, results) {

    function exportLots(){
      for (let i = 0; i < results.length; i++) {
        dataDump.push(results[i]);
      }
      res.send(dataDump);
    }

    if (err) {
      console.log(err);
      let displayError = JSON.stringify(err.message);
      req.flash("error", `Error: ${displayError}`);
      res.redirect("/products/HPC");
    } else {
      if (dataDump.length === 0){
        exportLots();
      } else {
        dataDump = [];
        exportLots();
      }
    }
  });
});

// ==============================================
// JSON DOWNLOAD API FOR SELECTED LOT
// ===============================================

router.get("/:id/edit/download",middleware.isLoggedIn, function (req, res) {
  let queryStr = `SELECT * FROM qryHPC_All WHERE pk_ID = ${req.params.id}`; 

  db.all(queryStr, function (err, results) {

    function exportLot(){
      for (let i = 0; i < results.length; i++) {
        lotDataDump.push(results[i]);
      }
      res.send(lotDataDump);
    }

    if (err) {
      console.log(err);
      let displayError = JSON.stringify(err.message);
      req.flash("error", `Error: ${displayError}`);
      res.redirect(`/products/HPC/${req.params.id}/edit`);
    } else {
      if (lotDataDump.length === 0){
        exportLot();
      } else {
        lotDataDump = [];
        exportLot();
      }
    }
  });
});

module.exports = router;