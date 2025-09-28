import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./data/ctis.db", sqlite3.OPEN_READWRITE, (err) =>{
    if(err){
        console.log("Error connecting to database: ", err.message);
    }
    else {
        console.log("Connected to ctis.db!!");
    }
});

db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON;", (err) => {
            if (err) {
                console.error("Error enabling foreign keys:", err.message);
            } else {
                console.log("Foreign keys enabled.");
            }
        });
});
global.db = db;
