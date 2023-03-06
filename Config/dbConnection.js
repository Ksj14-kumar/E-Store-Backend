const { default: mongoose } = require("mongoose");
const URI= process.env.URI_DB || "mongodb://localhost:27017/ecommerce"
mongoose.connect(URI, (err) => {
    if (err) {
        console.log(err)
        console.log("not connected to db")
        return
    }
    else {
        console.log("connected to db")
    }
})