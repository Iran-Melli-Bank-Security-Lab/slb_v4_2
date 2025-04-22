import React, { createContext, useState } from 'react';

export const BugContext = createContext();

const BugProvider = ({ children }) => {
  const [bugData, setBugData] = useState(null);
  const [bugForms, setBugForms] = useState([]);
  const [activeBugId, setActiveBugId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cvssCalculatorOpen, setCvssCalculatorOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);

  return (
    <BugContext.Provider
      value={{
        bugData,
        setBugData,
        bugForms,
        setBugForms,
        activeBugId,
        setActiveBugId,
        dialogOpen,
        setDialogOpen,
        cvssCalculatorOpen,
        setCvssCalculatorOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        bugToDelete,
        setBugToDelete,
      }}
    >
      {children}
    </BugContext.Provider>
  );
};

export default BugProvider;
