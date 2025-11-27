import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';

function ChatWindow({ currentChat, onAddMessage }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const prevChatIdRef = useRef(null);

  const messages = currentChat?.messages || [];

  // Reset loading state when chat changes
  useEffect(() => {
    if (currentChat?.id !== prevChatIdRef.current) {
      setIsLoading(false);
      prevChatIdRef.current = currentChat?.id;
    }
  }, [currentChat?.id]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    onAddMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // TODO: Call Anthropic API here
    // Simulating API response for now with Markdown examples
    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        role: 'assistant',
        content: `This is a **placeholder response** with *markdown formatting*!

Once you add your API key, I'll respond with actual AI-generated content.

**Here's what I can display:**
- This is *italic text*
- This is **bold text**
- This is ***bold and italic text***
- This is \`inline code\`
- And even [links](https://example.com)

> This is a blockquote - perfect for highlighting important information!

### Heading Example
You can also use headings to organize longer responses.

I'm ready to help you write amazing content! 🪶`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      onAddMessage(aiResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log('File upload clicked');
  };

  return (
    <div className="chat-window h-100 d-flex flex-column" style={{ backgroundColor: '#faf8f3' }}>
      {/* Chat header */}
      <div className="border-bottom p-3" style={{ backgroundColor: '#ffffff' }}>
        <h5 className="mb-0" style={{ color: '#3d2f24' }}>
          <i className="bi bi-chat-dots me-2"></i>
          {currentChat ? currentChat.title : 'Start a new conversation'}
        </h5>
      </div>

      {/* Messages area */}
      <div className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#faf8f3' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted" style={{ marginTop: '20%' }}>
            <i className="bi bi-chat-text" style={{ fontSize: '3rem', color: '#c4b5a0' }}></i>
            <h4 className="mt-3" style={{ color: '#8b7355' }}>Start a conversation</h4>
            <p style={{ color: '#a89985' }}>Type a message below to begin writing with AI assistance</p>
          </div>
        ) : (
          <div>
            {messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-4 d-flex justify-content-start">
                <div className="p-3 rounded" style={{ backgroundColor: '#ffffff' }}>
                  <div className="spinner-border spinner-border-sm me-2" role="status" style={{ color: '#8b7355' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span style={{ color: '#8b7355' }}>Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input Component */}
      <MessageInput 
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        onFileUpload={handleFileUpload}
        disabled={false}
      />
    </div>
  );
}

export default ChatWindow;