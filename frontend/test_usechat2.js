const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ai = require('@ai-sdk/react');

function TestComponent() {
  try {
    const chat = ai.useChat({ api: "http://localhost:8000/api/chat" });
    console.log("useChat keys:", Object.keys(chat));
    // Check if the internal fetch route is accessible
  } catch (e) {
    console.error("useChat error:", e.message);
  }
  return React.createElement('div', null, 'hello');
}

ReactDOMServer.renderToString(React.createElement(TestComponent));
