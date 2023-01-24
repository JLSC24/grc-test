import React from "react";

function Message(props) {
  var message_type = "client-chat";
  try {
    return (
      <div className="chats" style={{ whiteSpace: "pre-line" }} id="chats-id">
        {props.messages.map((msg, index) => {
          if (msg.sender === "U") {
            message_type = "my-chat";
          } else {
            message_type = "client-chat";
          }
          return (
            <div className={message_type}>
              <div>{msg.error ? msg.error.error : ""}</div>
              <div>{msg.msg}</div>
              <div>
                {msg.responses.map((r) => (
                  <p>{r}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    return <h1>ERROR!</h1>;
  }
}

export default Message;
