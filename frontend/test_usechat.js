const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ai = require('@ai-sdk/react');

function TestComponent() {
  try {
    const chat = ai.useChat();
    console.log("useChat keys:", Object.keys(chat));
    console.log("has append?", typeof chat.append);
    console.log("has handleInputChange?", typeof chat.handleInputChange);
    console.log("has handleSubmit?", typeof chat.handleSubmit);
  } catch (e) {
    console.error("useChat error:", e.message);
  }
  return React.createElement('div', null, 'hello');
}

console.log(ReactDOMServer.renderToString(React.createElement(TestComponent)));
