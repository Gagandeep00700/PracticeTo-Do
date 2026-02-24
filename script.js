import express from 'express'
import path from 'path'
import qs from 'querystring'
import fs from 'fs'

const app = express();

let absPath = path.resolve("pages")
app.use(express.static("styles"))

app.get("/", (req, res) => {
    res.sendFile(absPath + "/index.html")
})

app.get("/about", (req, res) => {
    res.send("<h1>about page</h1>");
})
app.get("/login", (req, res) => {
    res.sendFile(absPath + "/login.html");
})
app.get("/signup", (req, res) => {
    res.sendFile(absPath + "/signup.html");
})

app.post("/signup", (req, res) => {
    let body = ''
    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        let data = qs.parse(body);
        console.log(data);
        fs.readFile("database/users.json", "utf-8", (err, userData) => {
            let users = [];
            if (!err && userData) {
                users = JSON.parse(userData);
            }
            users.push(data);
            fs.writeFile("database/users.json", JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.log("Error occured", err)
                }
                res.redirect("/login")
            })
        })
    })

    // fs.writeFile("database/users.json",)
    // fs.readFile("database/users.json", "utf-8", (err, data) => {
    //     let users = [];
    //     if (!err && data) {
    //         users = JSON.parse(data);
    //     }
    //     users.push(data);
    //     fs.writeFile("database/users.json", JSON.stringify(users), (err)=>{
    //         if (err) {
    //             console.log("Error occured",err);
    //         }
    //         res.redirect("/login")
    //     })
    // })
})

app.get("/todo", (req, res) => {
    res.send("<h1>todo page</h1>");
})

app.use((req, res) => {
    res.status(404).sendFile(absPath + "/error.html")
})
app.listen(4500);