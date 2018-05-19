const path = require('path')
const url = require('url')

const {BrowserWindow} = require('electron')


class MainWindow extends BrowserWindow {
  constructor(options) {
    super(options)

    this.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    this.on('closed', function () {
    })
  }
}

module.exports.default = MainWindow

