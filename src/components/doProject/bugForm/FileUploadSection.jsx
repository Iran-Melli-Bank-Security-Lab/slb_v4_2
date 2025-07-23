import React, { useRef } from 'react';
import { ButtonBase, IconButton } from '@mui/material';
import FilePreview from './FilePreview';
import AddIcon from '@mui/icons-material/Add';

const FileUploadSection = ({ files, onFileChange, onFileDelete }) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <FilePreview 
                key={index} 
                file={file} 
                onDelete={() => onFileDelete(index)} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Upload area */}
      <div className="space-y-2">
        <ButtonBase
          onClick={triggerFileInput}
          className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center"
        >
          <AddIcon className="text-gray-400 text-3xl mb-2" />
          <p className="text-sm text-gray-600">Click to upload files</p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF, MP4 up to 1000MB
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
            accept="image/*,video/*"
            multiple
          />
        </ButtonBase>
      </div>
    </div>
  );
};

export default FileUploadSection;