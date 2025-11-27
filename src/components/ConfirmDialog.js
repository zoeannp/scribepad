import React from 'react';

function ConfirmDialog({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 1050 
        }}
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div 
        className="position-fixed top-50 start-50 translate-middle"
        style={{ 
          zIndex: 1051,
          width: '90%',
          maxWidth: '400px'
        }}
      >
        <div 
          className="card shadow-lg"
          style={{ 
            backgroundColor: '#faf8f3',
            border: '2px solid #8b7355'
          }}
        >
          {/* Header with X button */}
          <div 
            className="card-header d-flex justify-content-between align-items-center"
            style={{ 
              backgroundColor: '#3d2f24',
              color: '#e8dcc8',
              borderBottom: '2px solid #8b7355'
            }}
          >
            <h5 className="mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {title || 'Confirm Action'}
            </h5>
            <button
              className="btn btn-sm"
              onClick={onCancel}
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
            <p className="mb-0" style={{ color: '#3d2f24', fontSize: '1.1rem' }}>
              {message || 'Are you sure you want to proceed?'}
            </p>
          </div>
          
          {/* Footer */}
          <div className="card-footer bg-transparent border-top-0 p-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-lg"
              onClick={onCancel}
              style={{
                backgroundColor: '#e8dcc8',
                color: '#3d2f24',
                border: '1px solid #8b7355',
                minWidth: '100px'
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-lg"
              onClick={onConfirm}
              style={{
                backgroundColor: '#8b4513',
                color: '#e8dcc8',
                border: 'none',
                minWidth: '100px'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;