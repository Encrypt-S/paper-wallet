# NavCoin Paper Wallet Generator

This is a simple Electron app that can create up to 4 wallets at once (encrypted or unencrypted).
The wallets can all fit on a single piece of A4 paper.
None of the generated keys are ever broadcast over the internet.
This application has been created with mostly vanilla Javascript and  minimal use of libraries to make it easily auditable. 


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/Encrypt-S/paper-wallet
# Go into the repository
cd paper-wallet
# Install dependencies
npm install
# Run the app
npm start
```

## Build

```bash
npm install -g electron-packager
electron-packager ./ nav-paper --icon=build/icon.icns
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
