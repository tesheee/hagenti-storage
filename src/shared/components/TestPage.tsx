// "use client";

// import React, { useEffect, useRef, useState } from "react";

// const TestPage = () => {
//   const socket = useRef();
//   const [username, setUsername] = useState();
//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState([]);

//   const connect = () => {
//     socket.current = new WebSocket("ws://localhost:5001");

//     socket.current.onopen = () => {
//       setConnected(true);
//       const message = {
//         event: "connection",
//         username,
//       };
//       socket.current.send(JSON.stringify(message));
//     };

//     socket.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       setMessages((prev) => [message, ...prev]);
//     };

//     socket.current.onclose = () => {
//       console.log("Socket закрыт");
//     };

//     socket.current.onerror = () => {
//       console.log("Socket произошла ошибка");
//     };
//   };

//   return (
//     <div>
//       <p>Test Page!</p>
//       <button onClick={connect}>Войти</button>
//       {messages.map((message, key) => (
//         <div key={key}>{message.event}</div>
//       ))}
//     </div>
//   );
// };

// export default TestPage;
