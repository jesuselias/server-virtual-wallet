const SMTPServer = require("smtp-server").SMTPServer;
const nodemailer = require("nodemailer");

const server = new SMTPServer({
  onConnect(client, callback) {
    console.log("Cliente conectado");
    callback();
  },
  onData(stream, session, callback) {
    stream.pipe(process.stdout);
    callback();
  },

  auth: {
    user: 'jesus.e.elias.s@gmail.com',
    pass: 'cpmu fdpd rcnn oyxv'
  }
});

server.listen(587, "127.0.0.1", () => {
  console.log("Servidor SMTP local escuchando en puerto 587");
});
