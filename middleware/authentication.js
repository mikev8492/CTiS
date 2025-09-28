var middlewareObj = {};

// TEST username
var username = "guest";

middlewareObj.isLoggedIn = function (req, res, next) {
    // var user = req.headers['x-iisnode-auth_user'];
    // var userArr = user.split("\\");
    // var username = userArr[1];
    // var username = user.split("").slice(9, user.length).join("");

    
    // if (username) {
    //     let queryStr = `SELECT gName, fName, lName FROM qryUserGroups WHERE uName = '${username}'`

    //     db.request().query(queryStr, function (err, results) {
    //         if (results.recordset.length > 0) {
    //             res.locals.username = username;
    //             res.locals.group = results.recordset[0].gName;
    //             res.locals.firstName = results.recordset[0].fName;
    //             res.locals.lastName = results.recordset[0].lName;
    //             return next();
                
    //         } else {
    //             req.flash("error", `User not authorized. Please contact administrator.`);
    //             res.redirect("/");
    //         }

    //     });
    // } else {
    //     req.flash("error", `User not authorized. Please contact administrator.`);
    //     res.redirect("/");
    // };


    // TEST username response:
    res.locals.username = username;
    // res.locals.group = results.recordset[0].gName;
    res.locals.firstName = "Guest";
    res.locals.lastName = "";
    return next();
};

module.exports = middlewareObj;