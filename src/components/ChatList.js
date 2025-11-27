import React, { useState, useEffect, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog';

function ChatList({ chats, activeChat, onSelectChat, onDeleteChat, onNewChat, onRenameChat, triggerSearch, triggerRename, clearSearch }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchInputRef = useRef(null);

  // Focus search when Ctrl+K is pressed
  useEffect(() => {
    if (triggerSearch > 0 && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [triggerSearch]);

  // Clear search when Escape is pressed
  useEffect(() => {
    if (clearSearch > 0) {
      setSearchQuery('');
    }
  }, [clearSearch]);

  // Trigger rename for active chat
  useEffect(() => {
    if (triggerRename > 0 && activeChat) {
      const chat = chats.find(c => c.id === activeChat);
      if (chat) {
        handleRenameClick(chat.id, chat.title);
      }
    }
  }, [triggerRename, activeChat]);

  const handleDeleteClick = (chatId, chatTitle) => {
    setChatToDelete({ id: chatId, title: chatTitle });
    setShowDeleteDialog(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete.id);
    }
    setShowDeleteDialog(false);
    setChatToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setChatToDelete(null);
  };

  const handleRenameClick = (chatId, currentTitle) => {
    setRenamingId(chatId);
    setRenameValue(currentTitle);
    setOpenMenuId(null);
  };

  const handleRenameSubmit = (chatId) => {
    if (renameValue.trim()) {
      onRenameChat(chatId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const toggleMenu = (chatId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = chat.title.toLowerCase().includes(query);
    const messageMatch = chat.lastMessage.toLowerCase().includes(query);
    
    return titleMatch || messageMatch;
  });

  return (
    <div className="chat-list h-100 d-flex flex-column" style={{ backgroundColor: '#f8f5f0' }}>
      {/* New Chat Button */}
      <div className="p-3 border-bottom" style={{ backgroundColor: '#e8dcc8' }}>
        <button 
          className="btn w-100" 
          style={{ backgroundColor: '#3d2f24', color: '#e8dcc8' }}
          onClick={onNewChat}
        >
          <i className="bi bi-plus-circle me-2"></i>
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-bottom" style={{ backgroundColor: '#faf8f3' }}>
        <div className="position-relative">
          <i className="bi bi-search position-absolute" style={{ 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#8b7355'
          }}></i>
          <input
            ref={searchInputRef}
            type="text"
            className="form-control ps-5"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #c4b5a0',
              color: '#3d2f24'
            }}
          />
          {searchQuery && (
            <button
              className="btn btn-sm position-absolute"
              style={{
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8b7355',
                padding: '2px 8px'
              }}
              onClick={() => setSearchQuery('')}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-grow-1 overflow-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center text-muted p-4">
            {searchQuery ? (
              <>
                <i className="bi bi-search" style={{ fontSize: '2rem', color: '#c4b5a0' }}></i>
                <p className="mt-2">No chats found</p>
                <p className="small">Try a different search term</p>
              </>
            ) : (
              <>
                <p>No chats yet</p>
                <p className="small">Start a new conversation!</p>
              </>
            )}
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  activeChat === chat.id ? 'active' : ''
                }`}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: activeChat === chat.id ? '#3d2f24' : 'transparent',
                  borderLeft: activeChat === chat.id ? '4px solid #8b7355' : 'none',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                {/* Chat info */}
                <div 
                  className="flex-grow-1 me-2"
                  onClick={() => onSelectChat(chat.id)}
                  style={{ minWidth: 0 }}
                >
                  {renamingId === chat.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm mb-1"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit(chat.id);
                        if (e.key === 'Escape') handleRenameCancel();
                      }}
                      onBlur={() => handleRenameSubmit(chat.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      style={{ backgroundColor: '#faf8f3', color: '#3d2f24' }}
                    />
                  ) : (
                    <h6 className="mb-1" style={{ color: activeChat === chat.id ? '#e8dcc8' : '#3d2f24' }}>
                      {chat.title}
                    </h6>
                  )}
                  <p 
                    className="mb-1 small text-truncate" 
                    style={{ color: activeChat === chat.id ? '#c4b5a0' : '#6c757d' }}
                  >
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                  <small style={{ color: activeChat === chat.id ? '#a89985' : '#adb5bd' }}>
                    {chat.date}
                  </small>
                </div>
                
                {/* Three-dot menu */}
                <div className="position-relative">
                  <button
                    className="btn btn-sm ms-2"
                    style={{ 
                      color: activeChat === chat.id ? '#e8dcc8' : '#6c757d',
                      backgroundColor: activeChat === chat.id ? 'rgba(232, 220, 200, 0.1)' : 'transparent',
                      border: 'none',
                      padding: '4px 8px'
                    }}
                    onClick={(e) => toggleMenu(chat.id, e)}
                    title="More options"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>

                  {openMenuId === chat.id && (
                    <>
                      <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 10 }}
                        onClick={() => setOpenMenuId(null)}
                      />
                      
                      <div
                        className="position-absolute end-0 mt-1 shadow-lg"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #8b7355',
                          borderRadius: '8px',
                          minWidth: '150px',
                          zIndex: 11,
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          className="btn btn-sm w-100 text-start d-flex align-items-center gap-2"
                          style={{
                            color: '#3d2f24',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '10px 15px',
                            borderBottom: '1px solid #e8dcc8'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f5f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameClick(chat.id, chat.title);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                          Rename
                        </button>
                        
                        <button
                          className="btn btn-sm w-100 text-start d-flex align-items-center gap-2"
                          style={{
                            color: '#dc3545',
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '10px 15px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f5f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(chat.id, chat.title);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        show={showDeleteDialog}
        title="Delete Chat"
        message={`Are you sure you want to delete "${chatToDelete?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default ChatList;