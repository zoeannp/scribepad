import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import copyIcon from './images/copy.png';

function Message({ message }) {
  const [showCopied, setShowCopied] = useState(false);

  // Safety check AFTER hooks
  if (!message) return null;
  
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      // For rich text copy (preserves formatting)
      const blob = new Blob([message.content], { type: 'text/html' });
      const data = [new ClipboardItem({ 'text/html': blob })];
      await navigator.clipboard.write(data);
      
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      // Fallback to plain text if rich text copy fails
      navigator.clipboard.writeText(message.content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div
      className={`mb-4 d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
    >
      <div style={{ maxWidth: '70%' }}>
        <div
          className="p-3 rounded"
          style={{
            backgroundColor: isUser ? '#3d2f24' : '#ffffff',
            color: isUser ? '#e8dcc8' : '#3d2f24',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            fontFamily: isUser ? 'inherit' : 'Georgia, "Times New Roman", serif',
            fontSize: isUser ? 'inherit' : '1.05rem',
            lineHeight: isUser ? 'inherit' : '1.6'
          }}
        >
          {isUser ? (
            // User messages: plain text
            <div className="mb-2">{message.content}</div>
          ) : (
            // AI messages: Markdown rendered
            <div className="mb-2">
              <ReactMarkdown
                components={{
                  p: (props) => <p style={{ marginBottom: '0.5rem', marginTop: 0, textAlign: 'left' }} {...props} />,
                  strong: (props) => <strong style={{ fontWeight: 'bold', color: '#2d1f17' }} {...props} />,
                  em: (props) => <em style={{ fontStyle: 'italic' }} {...props} />,
                  code: ({inline, ...props}) => 
                    inline ? 
                      <code style={{ 
                        backgroundColor: '#f8f5f0', 
                        padding: '2px 6px', 
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        color: '#c7254e'
                      }} {...props} /> :
                      <code style={{ 
                        display: 'block',
                        backgroundColor: '#f8f5f0', 
                        padding: '12px', 
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        overflowX: 'auto',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem',
                        textAlign: 'left'
                      }} {...props} />,
                  ul: (props) => <ul style={{ marginLeft: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0', textAlign: 'left' }} {...props} />,
                  ol: (props) => <ol style={{ marginLeft: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0', textAlign: 'left' }} {...props} />,
                  li: (props) => <li style={{ marginBottom: '0.25rem', textAlign: 'left' }} {...props} />,
                  h1: (props) => <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '0.5rem', textAlign: 'left' }} {...props} />,
                  h2: (props) => <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '0.5rem', textAlign: 'left' }} {...props} />,
                  h3: (props) => <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginTop: '0.5rem', marginBottom: '0.5rem', textAlign: 'left' }} {...props} />,
                  blockquote: (props) => <blockquote style={{ 
                    borderLeft: '4px solid #8b7355', 
                    paddingLeft: '1rem', 
                    marginLeft: 0,
                    marginBottom: '0.5rem',
                    fontStyle: 'italic',
                    color: '#5d4e42',
                    textAlign: 'left'
                  }} {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Action buttons for AI messages */}
          {!isUser && (
            <div className="d-flex gap-2 align-items-center mt-2 pt-2" style={{ borderTop: '1px solid #e8dcc8' }}>
              <button
                className="btn btn-sm d-flex align-items-center gap-1"
                onClick={handleCopy}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8b7355',
                  border: 'none',
                  padding: '4px 8px',
                  fontSize: '0.85rem'
                }}
                title="Copy message"
              >
                {showCopied ? (
                  <>
                    <i className="bi bi-check2"></i>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <img src={copyIcon} alt="Copy" style={{ width: '16px', height: '16px' }} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <small style={{ opacity: 0.7, marginLeft: 'auto' }}>{message.timestamp}</small>
            </div>
          )}
          
          {/* Timestamp for user messages */}
          {isUser && (
            <small style={{ opacity: 0.7 }}>{message.timestamp}</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;