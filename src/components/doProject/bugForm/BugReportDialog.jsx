import  { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  ButtonBase
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import CVSSv4Calculator from './CVSSv4Calculator';
import { creatReport } from '../../../api/bugs/createReport';
import { useParams } from 'react-router';
import { useUserId } from '../../../hooks/useUserId';

// Helper component for file previews
const FilePreview = ({ file, onDelete, isExisting = false }) => {
  const [preview, setPreview] = useState(null);
console.log(" rerender in file preview *********************************************: " )
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
      <div className="text-xs text-gray-500 truncate mt-1">{file.name}</div>
      <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};


const BugReportDialog = ({ open, onClose, initialData }) => {
    const { id, label , wstg , projectId ,projectManager   } = useParams();
    const userId = useUserId() ; 

  const [isLoading, setIsLoading] = useState(false);
  const [cvssDialogOpen, setCvssDialogOpen] = useState(false);
  const [cvssData, setCvssData] = useState({
    score: null,
    severity: null,
    vector: null
  });

  const [formData, setFormData] = useState({
    cve: '',
    path: '',
    impact: '',
    exploit: '',
    solution: '',
    tools: '',
    reference: '',
    webServerSecuring: false,
    codeModificationSecuring: false,
    wafPossibility: '',
    files: [],
    existingFiles: []
  });

  const fileInputRef = useRef(null);

  // Load initial data if provided (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        existingFiles: initialData.files || []
      }));
      if (initialData.cvssScore) {
        setCvssData({
          score: initialData.cvssScore,
          severity: initialData.cvssSeverity,
          vector: initialData.cvssVector
        });
      }
    } else {
      // Reset form when opening for new report
      setFormData({
        cve: '',
        path: '',
        impact: '',
        exploit: '',
        solution: '',
        tools: '',
        reference: '',
        webServerSecuring: false,
        codeModificationSecuring: false,
        wafPossibility: '',
        files: [],
        existingFiles: []
      });
      setCvssData({
        score: null,
        severity: null,
        vector: null
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {

    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
      const isValidType = validTypes.some(type => file.type.includes(type));
      const isValidSize = file.size <= 1000 * 1024 * 1024; // 1000MB
      return isValidType && isValidSize;
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const handleDeleteFile = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      newFiles.splice(index, 1);
      return { ...prev, files: newFiles };
    });
  };

  const handleDeleteExistingFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      existingFiles: prev.existingFiles.filter(f => f.id !== fileId)
    }));
  };





const triggerFileInput = () => {
 
  fileInputRef.current.click();
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const submissionData = new FormData();
    submissionData.append("id" , id )
    submissionData.append("wstg" , wstg )
    submissionData.append("label" , label )
        submissionData.append("projectId" , projectId  )
            submissionData.append("projectManager" , projectManager )
            submissionData.append("userId" ,userId )






    // Append regular form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'files' && key !== 'existingFiles') {
        submissionData.append(key, value);
      }
    });
    
    // Append new files
    formData.files.forEach(file => {
      submissionData.append('files', file);
    });
    
    // Append existing file IDs to keep
    formData.existingFiles.forEach(file => {
      submissionData.append('existingFiles', file.id);
    });
    
    // Append CVSS data if available
    if (cvssData.score) {
      submissionData.append('cvssScore', cvssData.score);
      submissionData.append('cvssSeverity', cvssData.severity);
      submissionData.append('cvssVector', cvssData.vector);
    }

    
    await creatReport(submissionData , initialData)

    
    alert(initialData ? 'Report updated successfully!' : 'Report submitted successfully!');
    onClose();
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit report. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">
              {initialData ? 'Edit Vulnerability Report' : 'Create New Vulnerability Report'}
            </span>
            <IconButton onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        
        <DialogContent dividers className="bg-gray-50 p-0">
          <div className="p-4">
            <Card className="shadow-lg rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* CVSS Section */}
                  <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">CVSS Assessment</h3>
                      <Button
                        variant="outlined"
                        onClick={() => setCvssDialogOpen(true)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        {cvssData.score ? 'Edit CVSS' : 'Calculate CVSS'}
                      </Button>
                    </div>
                    
                    {cvssData.score ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Score</label>
                          <div className="mt-1 text-2xl font-bold">
                            <span className={
                              cvssData.score >= 9 ? 'text-red-600' :
                              cvssData.score >= 7 ? 'text-orange-600' :
                              cvssData.score >= 4 ? 'text-yellow-600' : 'text-blue-600'
                            }>
                              {cvssData.score}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Severity</label>
                          <div className="mt-1 text-lg font-medium">
                            <span className={
                              cvssData.severity === 'Critical' ? 'text-red-600' :
                              cvssData.severity === 'High' ? 'text-orange-600' :
                              cvssData.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                            }>
                              {cvssData.severity}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Vector</label>
                          <div className="mt-1 text-sm font-mono break-all">
                            {cvssData.vector}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No CVSS assessment added yet</p>
                    )}
                  </div>

                  {/* CVE Input */}
                  <div className="space-y-2">
                    <label htmlFor="cve" className="block text-sm font-medium text-gray-700">
                      CVE ID
                    </label>
                    <input
                      type="text"
                      id="cve"
                      name="cve"
                      value={formData.cve}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="CVE-YYYY-XXXXX"
                    />
                  </div>

                  {/* Path Input */}
                  <div className="space-y-2">
                    <label htmlFor="path" className="block text-sm font-medium text-gray-700">
                      Path
                    </label>
                    <input
                      type="text"
                      id="path"
                      name="path"
                      value={formData.path}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="/vulnerable/endpoint"
                    />
                  </div>

                  {/* Impact Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
                      Impact
                    </label>
                    <textarea
                      id="impact"
                      name="impact"
                      value={formData.impact}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-right"
                      placeholder="تأثیر این آسیب‌پذیری را توصیف کنید"
                      dir="rtl"
                    />
                  </div>

                  {/* Exploit Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="exploit" className="block text-sm font-medium text-gray-700">
                      Exploit Details
                    </label>
                    <textarea
                      id="exploit"
                      name="exploit"
                      value={formData.exploit}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-right"
                      placeholder="توضیح دقیق نحوه بهره‌برداری از این آسیب‌پذیری"
                      dir="rtl"
                    />
                  </div>

                  {/* Solution Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                      Solution
                    </label>
                    <textarea
                      id="solution"
                      name="solution"
                      value={formData.solution}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-right"
                      placeholder="راهکار توصیه شده برای رفع این آسیب‌پذیری"
                     dir="rtl"
                    />
                  </div>

                  {/* Tools Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="tools" className="block text-sm font-medium text-gray-700">
                      Tools Used
                    </label>
                    <textarea
                      id="tools"
                      name="tools"
                      value={formData.tools}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="List of tools used to identify/exploit this vulnerability"
                    />
                  </div>

                  {/* Reference Input */}
                  <div className="space-y-2">
                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                      References
                    </label>
                    <input
                      type="text"
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                      placeholder="URLs or references related to this vulnerability"
                    />
                  </div>

                  {/* Securing Checkboxes */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Securing Methods:</h4>
                    <div className="flex flex-col space-y-2">
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="webServerSecuring"
                            checked={formData.webServerSecuring}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Securing by Web Server settings"
                        className="text-sm text-gray-700"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="codeModificationSecuring"
                            checked={formData.codeModificationSecuring}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Securing by modification in the program code"
                        className="text-sm text-gray-700"
                      />
                    </div>
                  </div>

                  {/* WAF Radio Buttons */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Possibility of securing by WAF:</h4>
                    <RadioGroup
                      name="wafPossibility"
                      value={formData.wafPossibility}
                      onChange={handleChange}
                      className="flex space-x-4"
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                        className="text-sm text-gray-700"
                      />
                      <FormControlLabel
                        value="somewhat"
                        control={<Radio color="primary" />}
                        label="Somewhat"
                        className="text-sm text-gray-700"
                      />
                      <FormControlLabel
                        value="no"
                        control={<Radio color="primary" />}
                        label="No"
                        className="text-sm text-gray-700"
                      />
                    </RadioGroup>
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700">Upload Evidence (Images/Videos)</label>
                    
                    {/* Existing files preview (for edit mode) */}
                    {formData.existingFiles.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Files:</h4>
                        <div className="flex flex-wrap gap-4">
                          {formData.existingFiles.map((file) => (
                            <FilePreview 
                              key={file.id} 
                              file={file} 
                              onDelete={() => handleDeleteExistingFile(file.id)} 
                              isExisting={true}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* New files preview */}
                    {formData.files.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">New Files to Upload:</h4>
                        <div className="flex flex-wrap gap-4">
                          {formData.files.map((file, index) => (
                            <FilePreview 
                              key={index} 
                              file={file} 
                              onDelete={() => handleDeleteFile(index)} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Upload area */}
                    <div 
                      onClick={triggerFileInput}
                      className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer"
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload files</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileChange}
                              accept="image/*,video/*"
                              className="sr-only"
                              multiple
                            />
                          </label>
                          {/* <p className="pl-1">or drag and drop</p> */}
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, MP4 up to 1000MB
                        </p>
                      </div>
                    </div>
                  
                  
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>

        <DialogActions className="bg-gray-50 border-t px-6 py-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md transition duration-150"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition duration-150"
            startIcon={isLoading ? <CircularProgress size={20} className="text-white" /> : null}
          >
            {initialData ? 'Update Report' : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CVSS Calculator Dialog */}
    
      <CVSSv4Calculator
  open={cvssDialogOpen} 
  onClose={() => setCvssDialogOpen(false)}
  onScoreSelect={(cvssData) => {
    setCvssData(cvssData);
  }}
/>
    </>
  );
};

export default BugReportDialog;