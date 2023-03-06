const {AddAddress}= require("../Controller/socket.methods")
module.exports.Socket = (server, sessionMiddleware,helmet,morgan) => {
    const io = require("socket.io")(server, {
        path: "/store",
        transports: ["websocket"],
        cors: {
            origin: process.env.UI_URL,
            credentials: true,
        },
        cookie: {
            name: "cv",
            httpOnly: true,
            maxAge: 86400
          }
    })
    const address_nsp = io.of("/api/v1/nsp/address")
    address_nsp.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
    address_nsp.on("connection", (socket) => {
        socket.on("newAddress", async (params) => {
            const res = await AddAddress(params,socket)
        })
    })
}
