const express = require("express")
const { default: mongoose } = require("mongoose")
const app = express()
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 5600
const item_router = require("./routers/Items_router")
const userInfo = require("./routers/UserInfo_router")
const OTP_route = require("./routers/OTP_Router")
const allAdress = require("./routers/addresses")
const Orders = require("./routers/Order")
const stripe = require("./routers/stripe")
const loginVia= require("./routers/Other_login_router")
const staticfiles = require("./routers/static_files")
const expressSession = require("express-session")
const server = require("http").createServer(app)
const passport = require("passport")
const MongoStore = require("connect-mongo")
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const path = require("path")
const utl = require("util")
const fs = require("fs")
const morgan = require("morgan")
require("./Config/dbConnection")
const bodyParser = require("body-parser")
const { ErrorMiddleware } = require("./middleware/ErrorMiddleware")

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
const expressSessionMiddleware = expressSession({
    secret: process.env.session_secret,
    resave: true,
    name: "ss",
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.URI_DB,
        dbName: 'passport-session',
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        secure: "auto"
    }
})
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", "https: data:"]
    }
}))
app.use(morgan("combined", { stream: accessLogStream }))
app.use(express.static("view"))
app.use("/api/v1/stripe/webhook", express.raw({ type: 'application/json' }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "200mb", extended: true }))
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "200mb" }))
app.use(cors({
    origin: [process.env.UI_URL],
    credentials: true,
    methods: ["PUT", "POST", "DELETE", "GET"],
    allowedHeaders: ['Content-Type', "Access-Control-Allow-Origin"]
}))
app.use(cookieParser())
app.use(expressSessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
require("./middleware/passport.middleware")()
app.use("/api/v1/item", item_router)
app.use("/api/v1/user", userInfo)
app.use("/api/v1/otp", OTP_route)
app.use("/api/v1/address", allAdress)
app.use("/api/v1/stripe", stripe)
app.use("/api/v1/static", staticfiles)
app.use("/api/v1/orders", Orders)
app.use("/api/v1", loginVia)
require("./Services/Socket.connection").Socket(server, expressSessionMiddleware, helmet, morgan)
app.get("*", (req, res) => {
    return res.sendFile(path.join(__dirname, "/view/index.html"))
})
console.log = function (d) {
    fs.createWriteStream(__dirname + "/log.log", { flags: "a" }).write(utl.format(d) + "\n")
    process.stdout.write(utl.format(d) + "\n")
}

app.use(ErrorMiddleware)
mongoose.connection.once("open", (err) => {
    server.listen(port, (err) => {
        if (err) {
            console.log("server is not start", port)
        }
        else {
            console.log("server is start at port", port)
        }
    })
})