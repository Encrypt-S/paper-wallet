var CoinKey = require('coinkey')
var secureRandom = require('secure-random')
var qrcode = require('qrcode-generator')

function generate() {
  var numToGenerate = document.getElementById('number-option').value
  var colorOption = document.getElementById('color-option').value
  for (var i=0; i < numToGenerate; i++) generateOne(i, colorOption)
}

function generateOne(index, colorOption) {
  var bytes = secureRandom.randomBuffer(32)
  var key = new CoinKey(bytes, {
    private: 0x96,
    public: 0x35
  })

  document.getElementById('pubkey-string-' + index).innerHTML = key.publicAddress
  document.getElementById('pubkey-string-' + index + '-invert').innerHTML = key.publicAddress
  document.getElementById('privkey-string-' + index).innerHTML = key.privateWif
  document.getElementById('privkey-string-' + index + '-invert').innerHTML = key.privateWif

  var typeNumber = 4;
  var errorCorrectionLevel = 'L';
  var qrPub = qrcode(typeNumber, errorCorrectionLevel);
  qrPub.addData(key.publicAddress);
  qrPub.make();
  document.getElementById('pubkey-qr-' + index).innerHTML = qrPub.createImgTag(4, 8);

  var qrPriv = qrcode(typeNumber, errorCorrectionLevel);
  qrPriv.addData(key.privateWif);
  qrPriv.make();
  document.getElementById('privkey-qr-' + index).innerHTML = qrPriv.createImgTag(4, 8);

  document.getElementById('paper-wallet-' + index).style.display = 'block'

  if(colorOption === 'BLACK_WHITE') {
    document.getElementById('paper-wallet-' + index).style.color = '#000'
    document.getElementById('paper-background-' + index).setAttribute('src', 'images/paper-wallet-bw.png')
  } else {
    document.getElementById('paper-wallet-' + index).style.color = '#FFF'
    document.getElementById('paper-background-' + index).setAttribute('src', 'images/paper-wallet-color.png')
  }

}

window.onload = function(){
  var generateBtn = document.getElementById('generate')
  generateBtn.onclick = generate;

  var encrypted = CryptoJS.AES.encrypt("This is my message", "SecretPassphrase");
  //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

  var decrypted = CryptoJS.AES.decrypt(encrypted, "SecretPassphrase");
  //4d657373616765

}
