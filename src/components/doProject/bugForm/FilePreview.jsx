import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FilePreview = ({ file, onDelete, isExisting = false }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!isExisting && file.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (isExisting && file.type?.startsWith('image/')) {
      setPreview(file.thumbnail || file.url);
    }
  }, [file, isExisting]);

  const renderPreview = () => {
    if (preview && (file.type?.startsWith('image/') || isExisting)) {
      return <img src={preview} alt={file.name} className="w-full h-full object-cover" />;
    }
    if (file.type?.startsWith('video/') || (isExisting && file.type?.includes('video'))) {
      return <VideocamIcon className="text-gray-400 text-2xl" />;
    }
    return <InsertDriveFileIcon className="text-gray-400 text-2xl" />;
  };

  return (
    <div className="relative group w-20">
      <div className="w-18 h-18 flex items-center justify-center border border-gray-200 rounded-md overflow-hidden bg-gray-50">
        {renderPreview()}
      </div>
      {onDelete && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-red-500 hover:bg-red-600 text-white p-1"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      )}
      <div className="text-xs text-gray-500 truncate mt-1">{file.name}</div>
      <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
    </div>
  );
};

export default FilePreview;