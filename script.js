import express from 'express'
import qs from 'querystring'
import fs from 'fs'

const app = express();

app.set("view engine", "ejs");

// Static CSS //
app.use(express.static("styles"));

// Home Page //
app.get("/", (req, res) => {
    res.render("index")
})

// About Page //
app.get("/about", (req, res) => {
    res.render("about");
})


// Sign up Page //
app.get("/signup", (req, res) => {
    res.render("signup");
})

// Sign up Logic
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
})

// Login Page //
app.get("/login", (req, res) => {
    res.render("login")
})

// Login Logic //
app.post("/login", (req, res) => {
    let body = ""
    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", () => {
        let data = qs.parse(body);
        fs.readFile("database/users.json", "utf-8", (err, userData) => {
            if (err) {
                console.log("Error occured", err);
            }
            let users = []
            users = JSON.parse(userData);
            const user = users.find(u => u.email === data.email);

            if (!user) {
                console.log("User not found");
                return res.send("<h1>User not found</h1>")
            }
            else {
                if (user.password === data.password) {
                    res.redirect("/")
                }
                else {
                    console.log("Wrong password");
                }
            }
        })
    })
})

// todo Page //
app.get("/todo", (req, res) => {
    res.render("todo");
})

// Error Page //
app.use((req, res) => {
    res.status(404).render("error");
})
app.listen(4500);