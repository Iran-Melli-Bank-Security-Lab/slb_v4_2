import React, { createContext, useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { buildTree, expandTree } from "../api/treeview";

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const { projectId, userId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [bugScope, setBugScope] = useState([]);
    const [currentBug, setCurrentBug] = useState(null);
    const [showBugForm, setShowBugForm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [progress, setProgress] = useState(0);
    const serverIp = process.env.REACT_APP_SERVER_IP;

    useEffect(() => {
        const calculateProgress = () => {
            const totalBugs = bugScope.length;
            const passedBugs = bugScope.filter(bug => bug.status === 'Passed').length;
            const failedBugs = bugScope.filter(bug => bug.status === 'Failed').length;
            setProgress(((passedBugs + failedBugs) / totalBugs) * 100);
        };
        calculateProgress();
    }, [bugScope]);

    useEffect(() => {
        const getBugScope = async () => {
            const result = await axiosPrivate.get(`${serverIp}project/bugscope/${projectId}/${userId}`);
            const b = expandTree(buildTree(result.data));
            const bugs = b.map(bug => ({ ...bug, details: bug.details || [] }));
            setBugScope(bugs);
        };
        getBugScope();
    }, [axiosPrivate, projectId, userId]);

    const fetchBugDetails = async (bugId, index) => {
        const result = await axiosPrivate.get(`${serverIp}project/foundbug/${projectId}/${userId}/${bugId}`);
        const bugDetails = result.data;
        const updatedBugScope = [...bugScope];

        updatedBugScope[index].details = bugDetails.map(detail => {
            return {
                ...detail,
                POCs: detail.pocs ? detail.pocs.map(poc =>
                ({
                    url: `${process.env.REACT_APP_SERVER_IP}${poc.path}`,
                    originalname: poc.originalname,
                    type: poc.type
                }))
                    : []
            };
        });

        setBugScope(updatedBugScope);

        if (bugDetails.length > 0) {
            setShowForm(true);
            formik.setValues(updatedBugScope[index].details[0]);
        }
    };

    return (
        <ProjectContext.Provider value={{
            description,
            setDescription,
            status,
            setStatus,
            loading,
            setLoading,
            bugScope,
            setBugScope,
            currentBug,
            setCurrentBug,
            showBugForm,
            setShowBugForm,
            showForm,
            setShowForm,
            searchQuery,
            setSearchQuery,
            progress,
            setProgress,
            fetchBugDetails
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
