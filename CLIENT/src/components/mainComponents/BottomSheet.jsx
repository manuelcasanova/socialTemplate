import React from 'react';
import '../../css/BottomSheet.css'; 

const BottomSheet = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </>
  );
};

export default BottomSheet;
