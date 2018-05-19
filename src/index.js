const React = require('react')
const {app} = require('electron')

const MainWindow = require('./window').default
const listenerInit = require('./listener').init

require('electron-reload')(__dirname + '/dist')

const appReady = () => {
  const mainWindow = new MainWindow({width: 800, height: 600})
  listenerInit(mainWindow);
}

app.on('ready', appReady)

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})