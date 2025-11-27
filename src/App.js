import './App.css';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';

function App() {
  // Initialize state from localStorage or use default chats
  const [activeChat, setActiveChat] = useState(() => {
    const saved = localStorage.getItem('activeChat');
    return saved ? JSON.parse(saved) : null;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chats');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default chats if nothing in localStorage
    return [
      { 
        id: 1, 
        title: 'My First Story', 
        lastMessage: 'Once upon a time...', 
        date: '2024-10-25',
        messages: [
          { id: 1, role: 'user', content: 'Help me write a short story about a time traveler.', timestamp: '10:30 AM' },
          { id: 2, role: 'assistant', content: 'I\'d love to help you with that! Let\'s start by thinking about your time traveler.', timestamp: '10:31 AM' },
        ]
      },
      { 
        id: 2, 
        title: 'Blog Post Draft', 
        lastMessage: 'Introduction to AI...', 
        date: '2024-10-24',
        messages: [
          { id: 1, role: 'user', content: 'Help me write a blog post about AI.', timestamp: '9:15 AM' },
        ]
      },
      { 
        id: 3, 
        title: 'Character Development', 
        lastMessage: 'Sarah is a complex...', 
        date: '2024-10-23',
        messages: [
          { id: 1, role: 'user', content: 'Let\'s develop a character named Sarah.', timestamp: '2:45 PM' },
          { id: 2, role: 'assistant', content: 'Great! Let\'s start with Sarah\'s background and personality.', timestamp: '2:46 PM' },
        ]
      },
    ];
  });

  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(0);
  const [triggerRename, setTriggerRename] = useState(0);
  const [clearSearch, setClearSearch] = useState(0);

  // Save to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // Save to localStorage whenever activeChat changes
  useEffect(() => {
    localStorage.setItem('activeChat', JSON.stringify(activeChat));
  }, [activeChat]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + M: New Chat
      if (modKey && e.key === 'm') {
        e.preventDefault();
        handleNewChat();
      }

      // Ctrl/Cmd + K: Focus search
      if (modKey && e.key === 'k') {
        e.preventDefault();
        setTriggerSearch(prev => prev + 1);
      }

      // Escape: Clear search or deselect chat
      if (e.key === 'Escape') {
        setClearSearch(prev => prev + 1);
        setActiveChat(null);
      }

      // Ctrl/Cmd + /: Show shortcuts help
      if (modKey && e.key === '/') {
        e.preventDefault();
        setShowShortcutsHelp(true);
      }

      // Ctrl/Cmd + D: Delete current chat
      if (modKey && e.key === 'd') {
        e.preventDefault();
        if (activeChat) {
          handleDeleteChat(activeChat);
        }
      }

      // Ctrl/Cmd + R: Rename current chat
      if (modKey && e.key === 'r') {
        e.preventDefault();
        if (activeChat) {
          setTriggerRename(prev => prev + 1);
        }
      }

      // Ctrl/Cmd + E: Export current chat
      if (modKey && e.key === 'e') {
        e.preventDefault();
        if (activeChat) {
          handleExportChat(activeChat);
        }
      }

      // Ctrl/Cmd + Arrow Up/Down: Navigate between chats
      if (modKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        navigateChats(e.key === 'ArrowUp' ? -1 : 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChat, chats]);

  // Navigate between chats
  const navigateChats = (direction) => {
    if (chats.length === 0) return;
    
    const currentIndex = chats.findIndex(chat => chat.id === activeChat);
    let newIndex;

    if (currentIndex === -1) {
      // No chat selected, select first
      newIndex = 0;
    } else {
      newIndex = currentIndex + direction;
      // Wrap around
      if (newIndex < 0) newIndex = chats.length - 1;
      if (newIndex >= chats.length) newIndex = 0;
    }

    setActiveChat(chats[newIndex].id);
  };

  // Export chat as text file
  const handleExportChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    let content = `${chat.title}\n`;
    content += `Date: ${chat.date}\n`;
    content += '='.repeat(50) + '\n\n';

    chat.messages.forEach(msg => {
      content += `[${msg.timestamp}] ${msg.role === 'user' ? 'You' : 'AI'}:\n`;
      content += `${msg.content}\n\n`;
    });

    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate a smart title from the first message
  const generateTitle = (message) => {
    let title = message.trim();
    title = title.replace(/^(help me|can you|please|could you|i want to|i need to|let's|write)/i, '').trim();
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    if (title.length > 40) {
      title = title.substring(0, 40).trim() + '...';
    }
    
    if (title.length < 3) {
      title = 'New Conversation';
    }
    
    return title;
  };

  // Create new chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Conversation',
      lastMessage: '',
      date: new Date().toLocaleDateString('en-US'),
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    return newChat.id;
  };

  // Delete chat
  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      setActiveChat(null);
    }
  };

  // Rename chat
  const handleRenameChat = (chatId, newTitle) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  // Add message to active chat
  const handleAddMessage = (message) => {
    if (!activeChat) {
      const newChatId = Date.now();
      const autoTitle = message.role === 'user' ? generateTitle(message.content) : 'New Conversation';
      
      const newChat = {
        id: newChatId,
        title: autoTitle,
        lastMessage: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
        date: new Date().toLocaleDateString('en-US'),
        messages: [message]
      };
      
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChatId);
      return;
    }

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChat) {
        const updatedMessages = [...chat.messages, message];
        let newTitle = chat.title;
        
        if (chat.title === 'New Conversation' && message.role === 'user' && chat.messages.length === 0) {
          newTitle = generateTitle(message.content);
        }
        
        return {
          ...chat,
          title: newTitle,
          messages: updatedMessages,
          lastMessage: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
          date: new Date().toLocaleDateString('en-US')
        };
      }
      return chat;
    }));
  };

  const currentChat = chats.find(chat => chat.id === activeChat);

  return (
    <div className="App">
      <Header />
      
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar with chat list */}
          <div className="col-md-3 col-lg-2 bg-light border-end" style={{ height: 'calc(100vh - 56px)' }}>
            <ChatList 
              chats={chats}
              activeChat={activeChat}
              onSelectChat={setActiveChat}
              onDeleteChat={handleDeleteChat}
              onNewChat={handleNewChat}
              onRenameChat={handleRenameChat}
              triggerSearch={triggerSearch}
              triggerRename={triggerRename}
              clearSearch={clearSearch}
            />
          </div>
          
          {/* Main chat area */}
          <div className="col-md-9 col-lg-10" style={{ height: 'calc(100vh - 56px)' }}>
            <ChatWindow 
              currentChat={currentChat}
              onAddMessage={handleAddMessage}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp 
        show={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}

export default App;