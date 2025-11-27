import React from 'react';

function KeyboardShortcutsHelp({ show, onClose }) {
  if (!show) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: `${modKey}+M`, description: 'New chat' },
    { keys: `${modKey}+K`, description: 'Focus search bar' },
    { keys: 'Escape', description: 'Close search/Clear search/Deselect chat' },
    { keys: 'Enter', description: 'Send message' },
    { keys: `${modKey}+/`, description: 'Show keyboard shortcuts' },
    { keys: `${modKey}+D`, description: 'Delete current chat' },
    { keys: `${modKey}+R`, description: 'Rename current chat' },
    { keys: `${modKey}+E`, description: 'Export current chat' },
    { keys: `${modKey}+↑/↓`, description: 'Navigate between chats' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 1050 
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="position-fixed top-50 start-50 translate-middle"
        style={{ 
          zIndex: 1051,
          width: '90%',
          maxWidth: '500px'
        }}
      >
        <div 
          className="card shadow-lg"
          style={{ 
            backgroundColor: '#faf8f3',
            border: '2px solid #8b7355'
          }}
        >
          {/* Header */}
          <div 
            className="card-header d-flex justify-content-between align-items-center"
            style={{ 
              backgroundColor: '#3d2f24',
              color: '#e8dcc8',
              borderBottom: '2px solid #8b7355'
            }}
          >
            <h5 className="mb-0">
              <i className="bi bi-keyboard me-2"></i>
              Keyboard Shortcuts
            </h5>
            <button
              className="btn btn-sm"
              onClick={onClose}
              style={{
                color: '#e8dcc8',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                lineHeight: '1',
                padding: '0',
                width: '30px',
                height: '30px'
              }}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          {/* Body */}
          <div className="card-body p-4">
            <div className="list-group list-group-flush">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="d-flex justify-content-between align-items-center py-2 border-bottom"
                  style={{ borderColor: '#e8dcc8' }}
                >
                  <span style={{ color: '#3d2f24' }}>{shortcut.description}</span>
                  <kbd 
                    style={{ 
                      backgroundColor: '#3d2f24',
                      color: '#e8dcc8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KeyboardShortcutsHelp;