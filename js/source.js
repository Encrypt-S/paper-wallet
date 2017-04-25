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

  var password = document.getElementById("password").value;

  if (password == "") {
    var encrypt = confirm('Are you sure you want proceed with unencrypted wallets?')
    if (!encrypt) {
      document.getElementById("password").value = "";
      return;
    }
  }

  if (password !== "") {
    var encrypt = confirm('Are you sure you want to BIP38 encrypt the wallets?\r\n \r\n Make sure you save your password!')
    if (!encrypt) {
      document.getElementById("password").value = "";
      return;
    } else {
      document.getElementById("overlay").style.display = 'block';
    }
  }

  for (var i=0; i < 4; i++) resetOne(i);

  setTimeout(function(){
    for (var i=0; i < 4; i++) generateOne(i, colorOption, numToGenerate)
    document.getElementById('print').style.display = 'inline-block';
    document.getElementById('reset').style.display = 'inline-block';
  } ,100)
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

  var password = document.getElementById("password").value;

  var privateKey = key.privateWif;

  if (password !== "") {
    var decoded = wif.decode(key.privateWif);
    bip38.version = version;
    var encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, password, function (status) {
      console.log('encrypting', Math.round(status.percent), '%')
    })

    console.log(password, encryptedKey);

    document.getElementById('encrypted-key-' + index).innerHTML = encryptedKey
    document.getElementById('pt-encrypted-' + index).style.display = 'table-row'
    document.getElementById('password-' + index).innerHTML = password
    document.getElementById('pt-password-' + index).style.display = 'table-row'
    privateKey = encryptedKey;
  }

  document.getElementById('plain-text-' + index).style.display = 'block'
  document.getElementById('public-key-' + index).innerHTML = key.publicAddress
  document.getElementById('private-key-' + index).innerHTML = key.privateWif

  document.getElementById('pubkey-string-' + index).innerHTML = key.publicAddress
  document.getElementById('pubkey-string-' + index + '-invert').innerHTML = key.publicAddress
  document.getElementById('privkey-string-' + index).innerHTML = privateKey
  document.getElementById('privkey-string-' + index + '-invert').innerHTML = privateKey

  var typeNumber = 4;
  var errorCorrectionLevel = 'L';
  var qrPub = qrcode(typeNumber, errorCorrectionLevel);
  qrPub.addData(key.publicAddress);
  qrPub.make();
  document.getElementById('pubkey-qr-' + index).innerHTML = qrPub.createImgTag(4, 8);

  var qrPriv = qrcode(typeNumber, errorCorrectionLevel);
  qrPriv.addData(privateKey);
  qrPriv.make();
  document.getElementById('privkey-qr-' + index).innerHTML = qrPriv.createImgTag(4, 8);

  document.getElementById('wallet-' + index).style.display = 'block'

  if(colorOption === 'BLACK_WHITE') {
    document.getElementById('paper-wallet-' + index).style.color = '#000'
    document.getElementById('paper-background-' + index).setAttribute('src', 'images/paper-wallet-bw.png')
  } else {
    document.getElementById('paper-wallet-' + index).style.color = '#FFF'
    document.getElementById('paper-background-' + index).setAttribute('src', 'images/paper-wallet-color.png')
  }
  document.getElementById("overlay").style.display = 'none';
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
  document.getElementById('wallet-' + index).style.display = 'none'
}

function print() {
  window.print();
}

function decrypt() {
  var version = {
    private: 0x96,
    public: 0x35
  }
  var password = document.getElementById("password").value;
  var encryptedKey = document.getElementById("encrypted").value;

  document.getElementById("overlay").style.display = 'block';
  setTimeout(function(){

    try {
      var decryptedKey = bip38.decrypt(encryptedKey, password, function(status) {
        console.log('decrypting', Math.round(status.percent), '%')
      });

      var decodedDecrypted = wif.encode(150, decryptedKey.privateKey, decryptedKey.compressed)

      var key = CoinKey.fromWif(decodedDecrypted, version);

      document.getElementById("public-key-0").innerHTML = key.publicAddress;
      document.getElementById("encrypted-key-0").innerHTML = encryptedKey;
      document.getElementById("private-key-0").innerHTML = decodedDecrypted;
      document.getElementById("password-0").innerHTML = password;
      document.getElementById('reset_decrypt').style.display = 'inline-block';
      document.getElementById("plain-text-decrypt").style.display = 'block';
      document.getElementById("overlay").style.display = 'none';
    } catch(e) {
      document.getElementById("overlay").style.display = 'none';
    }

  }, 100);

}

function decryptReset() {
  document.getElementById("public-key-0").innerHTML = '';
  document.getElementById("encrypted-key-0").innerHTML = '';
  document.getElementById("private-key-0").innerHTML = '';
  document.getElementById("password-0").innerHTML = '';
  document.getElementById("plain-text-decrypt").style.display = 'none';
  document.getElementById('reset_decrypt').style.display = 'none';
}

window.onload = function(){
  if (document.getElementById('generate')) document.getElementById('generate').onclick = generate;
  if (document.getElementById('print')) document.getElementById('print').onclick = print;
  if (document.getElementById('reset')) document.getElementById('reset').onclick = reset;
  if (document.getElementById('decrypt')) document.getElementById('decrypt').onclick = decrypt;
  if (document.getElementById('reset_decrypt')) document.getElementById('reset_decrypt').onclick = decryptReset;
}
