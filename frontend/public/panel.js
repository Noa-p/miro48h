'use strict';

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = ".btn {\n    width: 100px;\n}\n\n.app {\n    display: flex;\n    align-items: center;\n    align-content: center;\n    flex-direction: column;\n    gap: 18px;\n}\n\n.tags {\n    color: #fff;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    align-items: center;\n    align-content: center;\n}\n\n.tag {\n    margin: 8px;\n    text-align: center;\n    width: 260px;\n    height: 40px;\n    border-radius: 5px;\n}\n.tag p {\n    line-height: 1em;\n    font-weight: bold;\n}\n\n.diver {\n    border-top: 1px solid rgb(196, 196, 196);\n    width: 90%;\n    margin: 30 10 10 20;\n}\n\n.tracker {\n    text-align: center;\n    width: 260px;\n    border-radius: 5px;\n}\n.tracker p {\n    line-height: 1em;\n    font-weight: bold;\n    font-size: 20px;\n    color: #888;\n}";
n(css,{});

const tags = [{
  name: 'assign',
  bgColor: '#000'
}, {
  name: 'todo',
  title: 'To Do',
  bgColor: '#BDBDBD'
}, {
  name: 'inprocess',
  bgColor: '#FAC710'
}, {
  name: 'done',
  bgColor: '#2D9BF0'
}, {
  name: 'undermodified',
  bgColor: '#F24726'
}];

const App = () => {
  const handleTrackerVisible = async () => {
    miro.board.ui.closePanel();
    await miro.board.ui.openPanel('tracker.html', 800);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tags"
  }, tags.map(i => {
    return /*#__PURE__*/React.createElement("div", {
      key: i.name,
      className: "tag",
      style: {
        backgroundColor: i.bgColor
      }
    }, /*#__PURE__*/React.createElement("p", null, i.name));
  })), /*#__PURE__*/React.createElement("div", {
    className: "diver"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tracker",
    style: {
      backgroundColor: '#fff'
    },
    onClick: handleTrackerVisible
  }, /*#__PURE__*/React.createElement("p", null, "Process Tracker")));
};

const domContainer = document.querySelector('#container');
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), domContainer);
