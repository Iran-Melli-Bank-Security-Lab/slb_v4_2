import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import BugReportDialog from "../components/doProject/bugForm/BugReportDialog";
import { fetchReports } from "../api/bugs/fetchReport";
import { useUserId } from "../hooks/useUserId";

import {
  BugReport as BugReportIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { deleteReportById } from "../api/bugs/deleteReportById";

const StatusBadge = ({ status }) => {
  const statusClasses = {
    New: "bg-blue-100 text-blue-800 border-blue-300",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Verified: "bg-green-100 text-green-800 border-green-300",
  };

  const statusIcons = {
    New: <BugReportIcon className="w-4 h-4 mr-1" />,
    Pending: <PendingIcon className="w-4 h-4 mr-1" />,
    Verified: <CheckCircleIcon className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]}`}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const severityClasses = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  };

  const severityIcons = {
    Low: <InfoIcon className="w-4 h-4 mr-1" />,
    Medium: <WarningIcon className="w-4 h-4 mr-1" />,
    High: <WarningIcon className="w-4 h-4 mr-1" />,
    Critical: <ErrorIcon className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses[severity]}`}
    >
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

  const [openForm, setOpenForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  //delete report 
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleDeleteClick =async (report) => {
    setReportToDelete(report);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      // Call your API to delete the report
      await deleteReportById(reportToDelete._id);
      // Refresh the reports list
      const result = await fetchReports(projectId, userId, projectManager, id);
      setReports(result);
      toast.success("Report deleted successfully");
    } catch (error) {
      toast.error("Failed to delete report");
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setReportToDelete(null);
  };


  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingReport(null);
  };

   const getReports = async () => {
    try {
      setIsLoading(true);
      const result = await fetchReports(projectId, userId, projectManager, id);
      setReports(result);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
    };
  useEffect(() => {
   
    getReports();
  }, []);

  const handleEditClick = (report) => {
    setEditingReport(report);
    setOpenForm(true);
  };
  // Function to render RTL text with line breaks
  const renderRtlText = (text) => {
    if (!text) return null;

    return (
      <div
        dir="rtl"
        className="text-right whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200"
      >
        {text.split("\n").map((line, i) => (
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
          <p className="mt-4 text-gray-600">
            No reports yet. Click to add your first report.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {report.label}
                  </h2>
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
                    <span className="font-medium">CVE:</span>{" "}
                    {report.CVE || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">WSTG:</span>{" "}
                    {report.wstg || "N/A"}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{report.description}</p>
                </div>

                <div className="space-y-4">
                  {report.impact && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Impact
                      </h3>
                      {renderRtlText(report.impact)}
                    </div>
                  )}

                  {report.solutions && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Solutions
                      </h3>
                      {renderRtlText(report.solutions)}
                    </div>
                  )}

                  {report.tools?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Tools Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {report.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.pocs?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Proof of Concepts
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {report.pocs.map((poc, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              toast.info(
                                `File ${poc.originalname} cannot be displayed in demo mode`
                              );
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
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Exploit
                      </h3>
                      {renderRtlText(report.exploits)}
                    </div>
                  )}

                  {report.refrence && (
                    <div className="text-sm">
                      <span className="font-medium">Reference:</span>{" "}
                      <a
                        href={report.refrence}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {report.refrence}
                      </a>
                    </div>
                  )}

                  {report.cvssVector && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">CVSS Vector:</span>{" "}
                      {report.cvssVector}
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Securing Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">
                          Web Server Settings:
                        </span>{" "}
                        {report.securingByOptions.webServerSettings ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">
                          Program Code Modification:
                        </span>{" "}
                        {report.securingByOptions.modificationInProgramCode ? (
                          <span className="text-green-600">Yes</span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-medium">WAF Possibility:</span>{" "}
                        <span className="text-blue-600">
                          {report.securingByWAF}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add footer with timestamps and edit button */}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  {/* Horizontal stack for timestamps */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {report.created_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <span className="font-medium text-gray-700">
                            Created:{" "}
                          </span>
                          <span>
                            {format(
                              new Date(report.created_at),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {report.updated_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <div>
                          <span className="font-medium text-gray-700">
                            Updated:{" "}
                          </span>
                          <span>
                            {format(
                              new Date(report.updated_at),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Edit button aligned to the right */}
                  {/* Edit and Delete buttons aligned to the right */}
<div className="flex gap-2">
  <button
    onClick={() => handleEditClick(report)}
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 transform hover:scale-105"
  >
    <svg
      className="-ml-1 mr-2 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
    Edit Report
  </button>
  <button
    onClick={() => handleDeleteClick(report)}
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-150 transform hover:scale-105"
  >
    <svg
      className="-ml-1 mr-2 h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    Delete
  </button>
</div>



                </div>
              </div>
            </div>
          ))}
        </div>
      )}

{/* Delete Confirmation Modal */}
{deleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
      <div className="flex items-center mb-4">
        <WarningIcon className="text-red-500 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
      </div>
      <p className="mb-6 text-gray-600">
        Are you sure you want to delete this report? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancelDelete}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      <BugReportDialog
        open={openForm}
        onClose={handleCloseForm}
        initialData={editingReport}
        onSuccess={getReports}
      />
    </div>
  );
};

export default BugReportForm;
