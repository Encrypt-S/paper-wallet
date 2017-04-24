var CoinKey = require('coinkey')
var secureRandom = require('secure-random')
var qrcode = require('qrcode-generator')
var bip38 = require('bip38')
var cs = require('coinstring')
var util = require('../node_modules/coinkey/lib/util')
var base58 = require('bs58')

var wif = require('wif')

function generate() {
  var numToGenerate = document.getElementById('number-option').value
  var colorOption = document.getElementById('color-option').value
  for (var i=0; i < 4; i++) generateOne(i, colorOption, numToGenerate)
  document.getElementById('print').style.display = 'inline-block';
  document.getElementById('reset').style.display = 'inline-block';
}

function generateOne(index, colorOption, numToGenerate) {

  if (index >= numToGenerate) {
    resetOne(index);
    return
  }
  var version = {
    private: 0x96,
    public: 0x35
  }
  var bytes = secureRandom.randomBuffer(32)
  var key = new CoinKey(bytes, version)

  var decoded = wif.decode(key.privateWif)

  console.log(decoded)

  bip38.version = version;

  var password = 'MyPassword';

  var encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, password, function (status) {
    console.log('encrypting', Math.round(status.percent), '%')
  })

  var decryptedKey = bip38.decrypt(encryptedKey, password, function(status) {
    console.log('decrypting', Math.round(status.percent), '%')
  });

  var decodedDecrypted = wif.encode(decoded.version, decryptedKey.privateKey, decryptedKey.compressed)

  console.log(decodedDecrypted, key.privateWif)

  if (decodedDecrypted !== key.privateWif) {
    console.log('something went wrong')
  } else {
    console.log('encryption successful')
  }

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

function reset() {
  var reset = confirm('Are you sure you want to reset the wallets? This can not be undone.')
  if (!reset) return
  document.getElementById('print').style.display = 'none';
  document.getElementById('reset').style.display = 'none';
  for (var i=0; i < 4; i++) resetOne(i);
}

function resetOne(index) {
  document.getElementById('pubkey-string-' + index).innerHTML = ''
  document.getElementById('pubkey-string-' + index + '-invert').innerHTML = ''
  document.getElementById('privkey-string-' + index).innerHTML = ''
  document.getElementById('privkey-string-' + index + '-invert').innerHTML = ''
  document.getElementById('pubkey-qr-' + index).innerHTML = ''
  document.getElementById('privkey-qr-' + index).innerHTML = ''
  document.getElementById('paper-wallet-' + index).style.display = 'none'
}

function print() {
  window.print();
}

window.onload = function(){
  document.getElementById('generate').onclick = generate;
  document.getElementById('print').onclick = print;
  document.getElementById('reset').onclick = reset;
}
