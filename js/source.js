var CoinKey = require('coinkey')
var secureRandom = require('secure-random')
var qrcode = require('qrcode-generator')

function generate() {
  var bytes = secureRandom.randomBuffer(32)
  var key = new CoinKey(bytes, {
    private: 0x96,
    public: 0x35
  })

  document.getElementById('pubkey-string').innerHTML = key.publicAddress
  document.getElementById('privkey-string').innerHTML = key.privateWif

  var typeNumber = 4;
  var errorCorrectionLevel = 'L';
  var qrPub = qrcode(typeNumber, errorCorrectionLevel);
  qrPub.addData(key.publicAddress);
  qrPub.make();
  document.getElementById('pubkey-qr').innerHTML = qrPub.createImgTag(8, 16);

  var qrPriv = qrcode(typeNumber, errorCorrectionLevel);
  qrPriv.addData(key.privateWif);
  qrPriv.make();
  document.getElementById('privkey-qr').innerHTML = qrPriv.createImgTag(8, 16);

}

window.onload = function(){
  var generateBtn = document.getElementById('generate')
  generateBtn.onclick = generate;
}
