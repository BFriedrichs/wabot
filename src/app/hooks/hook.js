const {ipcRenderer} = require('electron');

/**
 * Sends a message to a certain channel and waits for a response
 * @param {string} channel
 * @param {object} args
 */
function send(channel, args) {
  ipcRenderer.send(channel, args);

  return new Promise((resolve, reject) => {
    ipcRenderer.once(channel, (sender, value) => {
      resolve(value);
    })
  }).catch((reason) => {
    console.log(reason)
  });
};

/**
 * Puts an absolute positioned element at the desired location
 * @param {object} pos
 * @param {boolean} keepElem - default is deleting the element after 2 seconds
 */
function addDebugElementAtPos(pos, keepElem) {
  let elm = document.createElement('div');
  elm.style.position = 'absolute';
  elm.style.top = pos.top + 'px';
  elm.style.left = pos.left + 'px';
  elm.style.width = '10px';
  elm.style.height = '10px';
  elm.style.background = 'red';
  elm.style.pointerEvents = 'none';
  document.body.appendChild(elm);

  keepElem = keepElem || false;
  if (keepElem) {
    return;
  }
  setTimeout(() => {
    elm.remove();
  }, 2000);
}

class WhatsAppBot {
  constructor() {
    this.timer = 2000;
    this.didInit = false;
  }

  /**
   * Idle until ready
   */
  checkReady() {
    const app = document.getElementById('app')
    const startup = document.getElementById('startup')

    if (app == null) {
      return;
    }

    if (startup != null) {
      return;
    }

    this.didInit = true;
  }

  /**
   * check for notifications in an interval
   * currently any error is just ignored and another interval is started
   */
  intervalCheck() {
    if (!this.didInit) {
      this.checkReady();
      setTimeout(this.intervalCheck.bind(this), this.timer);
      return;
    }

    const checkPromise = this.checkForNotifications();
    checkPromise.then(() => {
      setTimeout(this.intervalCheck.bind(this), this.timer);
    }).catch((error) => {
      setTimeout(this.intervalCheck.bind(this), this.timer);
    });
  }

  async checkForNotifications() {
    await this.debugFunc();
    // const chatsWithNotifications = document.querySelectorAll('.CxUIE, .unread');

    // for (let chat of chatsWithNotifications) {
    //   const chatPos = this.getPosition(chat, 10);

    //   addDebugElementAtPos(chatPos);
    //   await send('click', {x: chatPos.left, y: chatPos.top});
    // }
  }

  /**
   * Uses the electron response to execute an action
   * @param {object} response
   */
  async evalResponse(response) {
    switch (response.name) {
      case 'enterText':
        await this.enterText(response.text);
        break;
      case 'notAnAction':
        console.log(response);
        break;
      default:
        break;
    }
  }

  async debugFunc() {
    const panel = document.querySelectorAll('._25Ooe > ._1wjpf[title="🅗🅞🅤🅢🅔 🅑🅐🅔🅢"]')[0];
    const panelPos = this.getPosition(panel, 10);
    await send('click', {x: panelPos.left, y: panelPos.top});

    const messageClassList = document.getElementsByClassName('_3zb-j ZhF0n')
    const messages = Array.prototype.slice.call(messageClassList).map((el) => {
      return {
        hash: el.parentElement.getAttribute('data-pre-plain-text'),
        msg: el.children[0].innerHTML
      }
    });

    for (let message of messages) {
      if (message.msg.startsWith('!')) {
        const response = await send('evaluateCommand', message);
        await this.evalResponse(response);
      }
    }
  }

  /**
   * Enters a text into the chat bar and sends it to the chat
   * @param {string} text
   */
  async enterText(text) {
    const chatBar = document.querySelectorAll('[contenteditable="true"]')[0];
    const chatBarPos = this.getPosition(chatBar, 10);
    chatBar.parentElement.classList.add('focused');

    await send('click', {x: chatBarPos.left, y: chatBarPos.top});
    await send('requestInput', text);
    await send('requestEnter');
  }

  /*
   * Returns the absolute DOM position of an element
   */
  getPosition(el, buffer) {
    buffer = buffer || 0;
    el = el.getBoundingClientRect();
    return {
      left: Math.abs(el.left + window.scrollX) + buffer,
      top: Math.abs(el.top + window.scrollY) + buffer
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const bot = new WhatsAppBot();
  bot.intervalCheck();
});
