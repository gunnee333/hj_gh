// run `node scripts/make-qr.js`

const QRCode = require("qrcode");
const fs = require("fs");

const url = "https://gunnee333.github.io/wedding";

(async () => {
  const png = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 800,
  });

  fs.writeFileSync("invite-qr.png", png);
  console.log("Created invite-qr.png");
})();
