import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import BugReportDialog from '../components/doProject/bugForm/BugReportDialog';
import { fetchReports } from '../api/bugs/fetchReport';
import { useUserId } from '../hooks/useUserId';

// Static data for bug reports
const sampleBugReports = [
  {
    _id: '1',
    label: 'SQL Injection',
    wstg: 'WSTG-INPV-05',
    CVSS: '8.8',
    severity: 'High',
    CVE: 'CVE-2021-1234',
    impact: 'This vulnerability can lead to sensitive data disclosure from the database.',
    description: 'On the login page, the username parameter is vulnerable to SQL injection.',
    solutions: '1. Use prepared statements\n2. Validate inputs\n3. Limit database access',
    tools: ['Burp Suite', 'SQLmap'],
    pocs: [
      { path: 'poc1.pdf', originalname: 'SQLi_POC.pdf' },
      { path: 'screenshot1.png', originalname: 'Vulnerability_Screenshot.png' }
    ],
    state: 'Verified',
    path: '/login.php',
    exploits: "' OR '1'='1",
    refrence: 'https://owasp.org/www-community/attacks/SQL_Injection',
    vector: 'Attack through username parameter',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    securingByOptions: {
      webServerSettings: true,
      modificationInProgramCode: false
    },
    securingByWAF: 'YES'
  },
  {
    _id: '2',
    label: 'Stored XSS',
    wstg: 'WSTG-INPV-02',
    CVSS: '7.5',
    severity: 'Medium',
    impact: 'Attacker can store malicious scripts on the page that will execute for all users.',
    description: 'In the comments section, user input is stored without validation or filtering.',
    solutions: '1. Validate and filter inputs\n2. Use Content Security Policy\n3. Encode outputs',
    tools: ['Burp Suite', 'OWASP ZAP'],
    pocs: [
      { path: 'xss-poc.html', originalname: 'XSS_Attack_Sample.html' }
    ],
    state: 'Pending',
    path: '/comments',
    refrence: 'https://owasp.org/www-community/attacks/xss/',
    vector: 'Attack through comment field in the form',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N',
    securingByOptions: {
      webServerSettings: false,
      modificationInProgramCode: true
    },
    securingByWAF: 'Somewhat'
  }
];



import { 
  BugReport as BugReportIcon, 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    'New': 'bg-blue-100 text-blue-800 border-blue-300',
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Verified': 'bg-green-100 text-green-800 border-green-300'
  };
  
  const statusIcons = {
    'New': <BugReportIcon className="w-4 h-4 mr-1" />,
    'Pending': <PendingIcon className="w-4 h-4 mr-1" />,
    'Verified': <CheckCircleIcon className="w-4 h-4 mr-1" />
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
      {statusIcons[status]}
      {status}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const severityClasses = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  };
  
  const severityIcons = {
    'Low': <InfoIcon className="w-4 h-4 mr-1" />,
    'Medium': <WarningIcon className="w-4 h-4 mr-1" />,
    'High': <WarningIcon className="w-4 h-4 mr-1" />,
    'Critical': <ErrorIcon className="w-4 h-4 mr-1" />
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses[severity]}`}>
      {severityIcons[severity]}
      {severity}
    </span>
  );
};

const BugReportForm = () => {
  const { label, id, projectId, projectManager } = useParams();
  const userId = useUserId();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [openForm, setOpenForm] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const getReports = async() => {
      const result = await fetchReports(projectId, userId, projectManager, id);
      setReports(result);
      console.log("result in line 147 : " , result )
    }
    getReports();
  }, []);

  // Function to render RTL text with line breaks
  const renderRtlText = (text) => {
    if (!text) return null;
    
    return (
      <div dir="rtl" className="text-right whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
        {text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 relative">
      <div className="flex items-center mb-6">
        <BugReportIcon className="text-red-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">
          Bug Reports for: {decodeURIComponent(label)}
        </h1>
      </div>
      
      {reports.length > 0 && (
        <button
          onClick={handleOpenForm}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-6 transition-colors"
        >
          <AddIcon className="mr-2" />
          Add New Report
        </button>
      )}

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <button
            onClick={handleOpenForm}
            className="p-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            <AddIcon className="text-3xl" />
          </button>
          <p className="mt-4 text-gray-600">No reports yet. Click to add your first report.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{report.label}</h2>
                  <div className="flex space-x-2">
                    <StatusBadge status={report.state} />
                    <SeverityBadge severity={report.severity} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">CVSS:</span> {report.CVSS}
                  </div>
                  <div>
                    <span className="font-medium">CVE:</span> {report.CVE || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">WSTG:</span> {report.wstg || 'N/A'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">{report.description}</p>
                </div>
                
                <div className="space-y-4">
                  {report.impact && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Impact</h3>
                      {renderRtlText(report.impact)}
                    </div>
                  )}
                  
                  {report.solutions && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Solutions</h3>
                      {renderRtlText(report.solutions)}
                    </div>
                  )}
                  
                  {report.tools?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Tools Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {report.tools.map((tool, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.pocs?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Proof of Concepts</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {report.pocs.map((poc, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSnackbar({
                                open: true,
                                message: `File ${poc.originalname} cannot be displayed in demo mode`,
                                severity: 'info'
                              });
                            }}
                            className="flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                          >
                            <CloudUploadIcon className="text-gray-500 mr-2" />
                            <span className="truncate">{poc.originalname}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.path && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Path:</span> {report.path}
                    </div>
                  )}
                  
                  {report.exploits && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Exploit</h3>
                      {renderRtlText(report.exploits)}
                    </div>
                  )}
                  
                  {report.refrence && (
                    <div className="text-sm">
                      <span className="font-medium">Reference:</span>{' '}
                      <a href={report.refrence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {report.refrence}
                      </a>
                    </div>
                  )}
                  
                  {report.cvssVector && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">CVSS Vector:</span> {report.cvssVector}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Securing Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">Web Server Settings:</span>{' '}
                        {report.securingByOptions.webServerSettings ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">Program Code Modification:</span>{' '}
                        {report.securingByOptions.modificationInProgramCode ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">WAF Possibility:</span>{' '}
                        <span className="text-blue-600">{report.securingByWAF}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BugReportDialog open={openForm} onClose={handleCloseForm} />
      
      {snackbar.open && (
        <div className={`fixed top-4 left-4 right-4 md:right-auto z-50 flex justify-center`}>
          <div className={`px-4 py-3 rounded shadow-lg max-w-md w-full ${
            snackbar.severity === 'success' ? 'bg-green-100 text-green-800' :
            snackbar.severity === 'error' ? 'bg-red-100 text-red-800' :
            snackbar.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {snackbar.severity === 'success' && <CheckCircleIcon className="mr-2" />}
                {snackbar.severity === 'error' && <ErrorIcon className="mr-2" />}
                {snackbar.severity === 'warning' && <WarningIcon className="mr-2" />}
                {snackbar.severity === 'info' && <InfoIcon className="mr-2" />}
                <span>{snackbar.message}</span>
              </div>
              <button onClick={handleCloseSnackbar} className="ml-4 text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugReportForm;