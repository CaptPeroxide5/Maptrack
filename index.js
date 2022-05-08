const http = require('http')
const port = 3000

const server = http.createServer(function(req,res) {
  res.write("hello")
  res.end()
})

// Initiate the Openscreen node SDK and include the project ID that you recieved using the Openscreen dashboard 
const { Openscreen } = require("@openscreen/sdk");
require('dotenv').config();
const os = new Openscreen().config({key: process.env.OS_API_KEY, secret: process.env.OS_API_SECRET});
const projectId = '0f4dcfc4-a020-4c9d-afaf-79de34d45e97';

async function main() { 
  
  // Create an asset for a new listing sign being hosted for 123 Main Street 
  const res = await os.project(projectId).assets().create({
    name: 'James Carter',
    description: 'null',
    customAttributes: {      
      type: 'Male',
      MLS: '123ABC',
    },
    qrCodes: [{
      intent: 'http://127.0.0.1:8080/Desktop/Maps/james.html',
      intentType: 'DYNAMIC_REDIRECT'
    }]
  });

  // Returns a scannable QR Code
  const { qrCodeId } = res.asset.qrCodes[0];
  const qrCode = await os.qrCode(qrCodeId).get({format: 'png'})
  await os.saveQrImageDataToFile(qrCode, 'jamesqrcode.png');
  // View the new asset that you have created 
  console.log('Asset:', JSON.stringify(res, '',2));
}

main().catch((err) => {
  console.error(err);
});