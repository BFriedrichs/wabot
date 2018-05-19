const {ipcMain} = require('electron')
const getAction = require('./listener').getAction;

module.exports.init = (browserWindow) => {
  let commandHistory = {};

  const webview = browserWindow.webContents;

  /**
   * Send input event to click at a certain location
   * @param {object} arg - {x: number, y: number}
   */
  ipcMain.on('click', (event, arg) => {
    browserWindow.focus();
    webview.sendInputEvent({type:'mouseDown', x:arg.x, y: arg.y, button:'left', clickCount: 1});
    webview.sendInputEvent({type:'mouseUp', x:arg.x, y: arg.y, button:'left', clickCount: 1});
    event.sender.send('click');
  });

  /**
   * sends input events for a string
   * @param {string} arg
   */
  ipcMain.on('requestInput', (event, arg) => {
    browserWindow.focus();
    for (let char of arg) {
      webview.sendInputEvent({keyCode: char, type: 'keyDown'});
      webview.sendInputEvent({keyCode: char, type: 'char'});
      webview.sendInputEvent({keyCode: char, type: 'keyUp'});
    }
    event.sender.send('requestInput');
  });

  /**
   * sends an 'Enter' key event
   * @param {null} arg
   */
  ipcMain.on('requestEnter', (event, arg) => {
    browserWindow.focus();
    webview.sendInputEvent({keyCode: '\u000d', type: 'keyDown', charCode: 13});
    webview.sendInputEvent({keyCode: '\u000d', type: 'char', charCode: 13});
    webview.sendInputEvent({keyCode: '\u000d', type: 'keyUp', charCode: 13});
    event.sender.send('requestEnter');
  });

  /**
   * Evaluates a command
   * The hash is a combination of date, time-by-minute and username
   * @param {object} command - {msg: string, hash: string}
   */
  ipcMain.on('evaluateCommand', (event, command) => {
    // check if command was already executed
    if (command.hash in commandHistory) {
      event.sender.send('evaluateCommand', {name: 'alreadyExecuted'});
    } else {
      const stampSplit = split(']')[0].substr(1).split(', ');
      const timeStamp = new Date(`${stampSplit[1]} ${stampSplit[0]}`);
      command.stamp = timeStamp;

      // flush the history, we assume that after 5000 commands
      // the old last ones will be too old
      if (Object.keys(commandHistory).length > 5000) {
        commandHistory = {};
      }

      commandHistory[command.hash] = command;

      if (timeStamp > Date.now() - 1000) {
        event.sender.send('evaluateCommand', {name: 'actionTooOld'});
      }

      const action = getAction(command.msg);
      event.sender.send('evaluateCommand', action);
    }
  });
}

