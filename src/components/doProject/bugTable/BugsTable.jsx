
import  { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import styled, { keyframes } from 'styled-components';
import { useUserId } from "../../../hooks/useUserId";
import { getBugs } from '../../../api/bugs/getBugs';
import { updateBugStatus } from '../../../api/bugs/updateBugStatus';
import { useNavigate } from 'react-router'; 


const slideDown = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 1000px; opacity: 1; }
`;

// Styled Components
const Container = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 1600px;  // Increased from 1500px
  margin: 2rem auto;
  padding: 1rem 1rem;  // Increased side padding
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
`;

const Title = styled.h1`
  color: #0f172a;
  font-weight: 700;
  margin: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-width: 600px;  // Increased from 500px
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background-color: white;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  
  &:hover {
    border-color: #cbd5e1;
  }
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  background: #f1f5f9;
  border-radius: 8px;
  height: 10px;
  margin: 1.5rem 0;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 8px;
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  text-align: right;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

const BulkActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: #4f46e5;
    color: white;
    
    &:hover {
      background: #4338ca;
    }
  }
  
  &.secondary {
    background: #f1f5f9;
    color: #334155;
    
    &:hover {
      background: #e2e8f0;
    }
  }
  
  &.success {
    background: #dcfce7;
    color: #166534;
    
    &:hover {
      background: #bbf7d0;
    }
  }
  
  &.danger {
    background: #fee2e2;
    color: #b91c1c;
    
    &:hover {
      background: #fecaca;
    }
  }
`;

const ItemContainer = styled.div`
  margin-bottom: 0.5rem;
  background: ${props => props.depth === 0 ? 'white' : 'transparent'};
  border-radius: ${props => props.depth === 0 ? '12px' : '0'};
  padding: ${props => props.depth === 0 ? '0.5rem' : '0'};
  box-shadow: ${props => props.depth === 0 ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  width: 100%;
  transition: all 0.3s ease;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: ${props => props.hasChildren ? 'pointer' : 'default'};
`;

const ExpandButton = styled.button`
  width: 0px;
  height: 0px;
  border: none;
  background: #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
    padding : 20px
  &:hover {
    background: #cbd5e1;
  }
`;

const ExpandSpacer = styled.span`
  width: 38px;
  margin-right: 1rem;
`;

const ItemLabel = styled.span`
  flex-grow: 1;
  padding: 0 1rem;  // Increased padding
  white-space: normal;
  overflow: visible;
  word-break: break-word;
  min-width: 400px;  // Minimum width for better label display
  max-width: 800px;  // Maximum width to prevent excessive stretching
`;

const ItemControls = styled.div`
  width: 600px;  // Increased from 600px
  flex-shrink: 0;
  display: flex;
  gap: 1.5rem;  // Increased gap between radio groups
  align-items: center;
  margin-left: auto;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.25rem;  // Slightly increased gap
  align-items: center;
  flex-wrap: wrap;  // Allow wrapping if needed
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #475569;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #334155;
  }
  
  input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:checked {
      border-color: ${props => 
        props.value === 'pass' ? '#16a34a' : 
        props.value === 'failed' ? '#dc2626' :
        props.value === 'notAccessible' ? '#d97706' :
        '#7c3aed'};
      background: ${props => 
        props.value === 'pass' ? '#dcfce7' : 
        props.value === 'failed' ? '#fee2e2' :
        props.value === 'notAccessible' ? '#fef3c7' :
        '#f3e8ff'};
      box-shadow: inset 0 0 0 5px ${props => 
        props.value === 'pass' ? '#16a34a' : 
        props.value === 'failed' ? '#dc2626' :
        props.value === 'notAccessible' ? '#d97706' :
        '#7c3aed'};
    }
  }
`;

const ChildrenContainer = styled.div`
  animation: ${slideDown} 0.3s ease-out;
  overflow: hidden;
  margin-left: 1.5rem;
`;

const BugTable = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [progress, setProgress] = useState(0);
  const [data , setData] = useState(); 

  const { id: projectId , projectManager} = useParams();
  const userId = useUserId();

  const navigate = useNavigate() 

  useEffect(() => {
  const fetchBugs = async () => {
    try {
      const data = await getBugs(projectId, userId , projectManager );
      const bugTree = data[0].bugScopes; 
      console.log("bugTree : ", bugTree);
      
      // Initialize selectedItems based on the status of each item
      const initialSelectedItems = {};
      
      const processItems = (items) => {
        items.forEach(item => {
          // Only set status if it's one of the valid options
          if (['pass', 'failed', 'notAccessible', 'notApplicable'].includes(item.status)) {
            initialSelectedItems[item.id] = item.status;
          }
          
          // Process children recursively
          if (item.children && item.children.length > 0) {
            processItems(item.children);
          }
        });
      };
      
      processItems(bugTree);
      
      setData(bugTree);
      setSelectedItems(initialSelectedItems);
      
    } catch (error) {
      console.error('Failed to fetch bug status:', error);
    } 
  };
  
  fetchBugs();
}, [projectId, userId]);


  useEffect(() => {
  // Get all leaf nodes (actual testable items)
  const testableItems = flattenData(data)?.filter(item => !item.children || item.children.length === 0);
  const totalItems = testableItems.length;

  // Count completed items (any status selection except 'notAttempted')
  const completedItems = testableItems?.filter(
    item => selectedItems[item.id] && 
           ['pass', 'failed', 'notApplicable', 'notAccessible'].includes(selectedItems[item.id])
  ).length;

  const newProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  setProgress(newProgress);
}, [selectedItems, data]);
  
   
  const flattenData = (items) => {
    let flatItems = [];
    items?.forEach(item => {
      flatItems.push(item);
      if (item.children) {
        flatItems = [...flatItems, ...flattenData(item.children)];
      }
    });
    return flatItems;
  };

  const filterData = (items, searchTerm, statusFilter) => {
    return items
      ?.map(item => {
        const newItem = {...item};
        if (newItem.children) {
          newItem.children = filterData(newItem.children, searchTerm, statusFilter);
        }
        return newItem;
      })
      ?.filter(item => {
        const hasMatchingChildren = item.children && item.children.length > 0;
        const matchesSearch = searchTerm === '' || 
          item.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
          (selectedItems[item.id] || 'notAttempted') === statusFilter;
        
        return (matchesSearch && matchesStatus) || hasMatchingChildren;
      });
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

const handleRadioChange = async (item, value) => {
  const { id, label , wstg  } = item;


  
  console.log("################################ item ************************************* : " , item )
  const newSelectedItems = {
    ...selectedItems,
    [id]: value
  };

  setSelectedItems(newSelectedItems);

  try {
    await updateBugStatus(projectId, userId, id, value);
    // If status is 'failed', navigate to bugReportForm with data
   
   // If "failed", open new tab with query params
    if (value === 'failed') {
      const encodedLabel = encodeURIComponent(label);
      const url = `/bugReportForm/${id}/${wstg}/${encodedLabel}/${projectId}/${projectManager}`;
      window.open(url, '_blank');
    }

  } catch (error) {
    console.error("Error updating bug status:", error);
    // Revert the change if the API call fails
    setSelectedItems(prev => ({
      ...prev,
      [id]: prev[id] // revert to previous value
    }));
  }
};


const handleSelectAll = async () => {
  try {
    // Get all testable items (leaf nodes)
    const testableItems = flattenData(data).filter(item => !item.children?.length);
    
    // Identify items that need updating (no status or notAttempted)
    const itemsToUpdate = testableItems.filter(item => {
      const currentStatus = selectedItems[item.id];
      return !currentStatus || currentStatus === 'notAttempted';
    });

    if (itemsToUpdate.length === 0) {
      return; // Nothing to update
    }

    // Create the bulk update payload
    const updates = itemsToUpdate.map(item => ({
      bugId: item.id,
      status: 'pass'
    }));

    // Optimistic UI update
    const newSelectedItems = { ...selectedItems };
    itemsToUpdate.forEach(item => {
      newSelectedItems[item.id] = 'pass';
    });
    setSelectedItems(newSelectedItems);

    // Send bulk update to backend using fetch
    const URL = `${import.meta.env.VITE_API_URL}/api/projects/bulk/update/bug/status`
    const response = await fetch(URL , {
      method: 'POST',
       credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        userId,
        updates
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update statuses');
    }

    const result = await response.json();
    console.log('Bulk update successful:', result);
    
  } catch (error) {
    console.error("Error in select all:", error);
    // Revert optimistic update on error
    setSelectedItems(prev => ({ ...prev }));
  }
};


  const handleDeselectAll = () => {
    setSelectedItems({});
  };

  const renderItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const currentSelection = selectedItems[item.id] || 'notAttempted';
    
    return (
      <ItemContainer key={item.id} depth={depth}>
        <ItemHeader 
          hasChildren={hasChildren} 
          onClick={() => hasChildren && toggleExpand(item.id)}
        >
          {hasChildren ? (
            <ExpandButton>
              {isExpanded ? '▼' : '►'}
            </ExpandButton>
          ) : (
            <ExpandSpacer />
          )}
          
          <ItemLabel depth={depth}>
            {item.label}
          </ItemLabel>
          
          <ItemControls>
            {!hasChildren && (
              <RadioGroup>
                <RadioLabel value="pass">
                  <input
                    type="radio"
                    name={`select-${item.id}`}
                    checked={currentSelection === 'pass'}
                    onChange={() => handleRadioChange(item, 'pass')}
                  />
                  Pass
                </RadioLabel>
                <RadioLabel value="failed">
                  <input
                    type="radio"
                    name={`select-${item.id}`}
                    checked={currentSelection === 'failed'}
                    onChange={() => handleRadioChange(item, 'failed')}
                  />
                  Failed
                </RadioLabel>
                <RadioLabel value="notAccessible">
                  <input
                    type="radio"
                    name={`select-${item.id}`}
                    checked={currentSelection === 'notAccessible'}
                    onChange={() => handleRadioChange(item, 'notAccessible')}
                  />
                  Not Accessible
                </RadioLabel>
                <RadioLabel value="notApplicable">
                  <input
                    type="radio"
                    name={`select-${item.id}`}
                    checked={currentSelection === 'notApplicable'}
                    onChange={() => handleRadioChange(item, 'notApplicable')}
                  />
                  Not Applicable
                </RadioLabel>
              </RadioGroup>
            )}
          </ItemControls>
        </ItemHeader>
        
        {hasChildren && isExpanded && (
          <ChildrenContainer>
            {item.children.map(child => renderItem(child, depth + 1))}
          </ChildrenContainer>
        )}
      </ItemContainer>
    );
  };

  return (
    <Container>
      <Header>
       
        <ControlsContainer>
          <SearchInput 
            type="text" 
            placeholder="Search tests..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pass">Pass</option>
            <option value="failed">Failed</option>
            <option value="notAccessible">Not Accessible</option>
            <option value="notApplicable">Not Applicable</option>
          </FilterSelect>
        </ControlsContainer>
      </Header>
      
      <ProgressContainer>
        <ProgressBar progress={progress} />
      </ProgressContainer>
      <ProgressText>{progress}% Completed</ProgressText>
      
      <BulkActions>
        <Button className="success" onClick={handleSelectAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12H16M12 8V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Select All (Pass)
        </Button>
        <Button className="secondary" onClick={handleDeselectAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L8 16M8 8L16 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Clear All
        </Button>
      </BulkActions>
      
      <div>
        {filterData(data, searchTerm, statusFilter)?.map(item => renderItem(item))}
      </div>
    </Container>
  );
};

export default BugTable