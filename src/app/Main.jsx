const React = require('react')
require('./index.css')
import { hot } from 'react-hot-loader'

class Main extends React.Component {
  render() {
    return (
      <div id="content">
        <div></div>
        <webview
          src="http://web.whatsapp.com"
          autosize="on"
          id="webview"
          preload="./app/hooks/hook.js"
          useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Franz/5.0.0-beta.18 Chrome/59.0.3071.115 Electron/1.8.4 Safari/537.36"
          allowpopups="on"
          muted="off"></webview>
      </div>
    )
  }
}

const HotMain = hot(module)(Main)
module.exports.Main = Main
module.exports.HotMainInstance = <HotMain />