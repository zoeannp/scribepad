import React from 'react';
import sendIcon from './images/sendicon.png';
import uploadIcon from './images/uploadfile.png';

function MessageInput({ input, setInput, onSend, isLoading, onFileUpload, disabled }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-top p-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="d-flex gap-3 align-items-center">
        <button 
          className="btn btn-outline-secondary btn-lg"
          onClick={onFileUpload}
          title="Upload file"
          disabled={disabled}
          style={{ 
            borderColor: '#8b7355', 
            color: '#8b7355',
            padding: '12px 20px'
          }}
        >
          <img src={uploadIcon} alt="Upload" style={{ width: '28px', height: '28px' }} />
        </button>
        
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Type your message to start a new conversation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          style={{ 
            borderColor: '#c4b5a0',
            backgroundColor: '#faf8f3',
            fontSize: '1.1rem',
            padding: '12px 20px'
          }}
        />
        
        <button
          className="btn btn-lg"
          onClick={onSend}
          disabled={input.trim() === '' || isLoading || disabled}
          style={{ 
            backgroundColor: '#3d2f24', 
            color: '#e8dcc8',
            minWidth: '140px',
            padding: '12px 24px',
            fontSize: '1.1rem'
          }}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status"></span>
          ) : (
            <>
              <img src={sendIcon} alt="Send" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;