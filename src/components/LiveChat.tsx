import React, { useState, useRef, useEffect } from 'react';

interface chatMessage {
  text: string;
  sender: string;
  timestamp: Date;
}

 interface LiveChatProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    chatMessages: chatMessage[];
    sendChatMessage: (text: string) => void;
    // messages: ChatMessage[];
    // sendMessage: (text: string) => void;
    }   

const LiveChat: React.FC<LiveChatProps> = ({isOpen, setIsOpen, chatMessages, sendChatMessage}) => {
  
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div
      className={`w3-sidebar w3-bar-block w3-card w3-animate-bottom ${
        isOpen ? 'w3-show' : 'w3-hide'
      }`}
      style={{ width: '300px', right: 0, position: 'fixed', zIndex: 9999 }}
    >
      {isOpen && (
        <button
          className="w3-bar-item w3-button w3-right-align"
          onClick={toggleChat}
        >
          {"(-)"}
        </button>
      )}

      {!isOpen && (
        <div className="w3-bar">
          <button
            className="w3-bar-item w3-button"
            onClick={toggleChat}
            style={{ width: '30px' }}
          >
            +
          </button>
        </div>
      )}

      <div
        className="w3-container w3-border-bottom"
        style={{ marginBottom: '10px' }}
      >
        <h4>Chat</h4>
      </div>

      <div
        className="w3-container"
        style={{ minHeight: '400px', overflowY: 'scroll' }}
      >
        {chatMessages.map((message) => (
          <p key={message.timestamp.getTime()} style={{ textAlign: 'left'}}>
            <span style={{ fontWeight: 'bold' }}>
              {message.sender}
            </span>
            : 
            {message.text}

          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="w3-container w3-border-top w3-bottom
        w3-padding ">
      {/* <button
          className="w3-button w3-round-xxlarge w3-hover-grey"
          style={{ marginTop: '10px' }}
          onClick={scrollToBottom}
        >
          ↓ ↓ ↓
        </button> */}
        <input
          type="text"
          className="w3-input w3-border w3-round w3-margin-top w3-margin-bottom"
          placeholder="Type your message..."
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              sendChatMessage(event.currentTarget.value);
              event.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
};

export default LiveChat;
