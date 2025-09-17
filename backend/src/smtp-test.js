const net = require("net");

function testSMTPConnection(host, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.setTimeout(5000); // 5s timeout

    socket.connect(port, host, () => {
      console.log(`✅ Connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      console.error(`⏱️ Timeout connecting to ${host}:${port}`);
      socket.destroy();
      reject(new Error("Timeout"));
    });

    socket.on("error", (err) => {
      console.error(`❌ Error connecting to ${host}:${port} -> ${err.message}`);
      reject(err);
    });
  });
}

(async () => {
  const host = "smtp.gmail.com";
  const ports = [465, 587, 25]; // common SMTP ports

  for (const port of ports) {
    try {
      await testSMTPConnection(host, port);
    } catch (err) {
      // already logged above
    }
  }
})();
