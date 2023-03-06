const path = require("path")
class Static {
    async Static_404(req, res) {
        return res.sendFile(path.join(__dirname, "../Images", "404.jpg"))
    }
    async Profile(req, res){
        try {
            return res.status(200).sendFile(path.join(__dirname,"../Images","avatar.png"))
        } catch (err) {
            console.log(err)
            return res.status(500).send("something error occured")
        }
    }
}


module.exports = new Static()