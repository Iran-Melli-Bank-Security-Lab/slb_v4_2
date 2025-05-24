import {  useState, useMemo, useCallback, memo, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  TextField,
  Chip,
  useTheme,
  InputAdornment,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Search,
  SelectAll,
  Deselect,
} from "@mui/icons-material";
import { getOwasp } from "../../../api/owasp/web/getOwasp";
import { getBugScopes } from "../../../api/users/getBugScopesIds";

const WebTestItem = memo(({ testLabel, isSelected, onToggle, wstg }) => (
  <ListItem sx={{ pl: 4 }}>
    <FormControlLabel
      control={
        <Checkbox
          checked={isSelected}
          onChange={onToggle}
        />
      }
      label={
        <Box>
          <Typography>{testLabel}</Typography>
          {wstg && (
            <Typography variant="caption" color="text.secondary">
              {wstg}
            </Typography>
          )}
        </Box>
      }
    />
  </ListItem>
));

const BugScopeModal = ({ open, onClose, userId, project }) => {
  const theme = useTheme();
  const [openCategories, setOpenCategories] = useState({});
  const [selectedTests, setSelectedTests] = useState(new Set());
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [rawBugScopes, setRawBugScopes] = useState([]);
 

const flattenTests = useCallback((items, parentLabel = "") => {
  return items.reduce((acc, item) => {
    const fullLabel = `${parentLabel}${parentLabel ? " > " : ""}${item.label}`;
    const testObj = {
      id: item.id, // <== ensure we use .id like bugScopes
      label: fullLabel,
      wstg: item.wstg || "",
    };

    if (item.children?.length > 0) {
      return [...acc, ...flattenTests(item.children, fullLabel)];
    }

    return [...acc, testObj];
  }, []);
}, []);

  const formattedCategories = useMemo(() => {
    return categories.reduce((acc, category) => {
      const tests = flattenTests(category.children).reduce((testAcc, test) => {
        testAcc[test.label] = test;
        return testAcc;
      }, {});
      acc[category.label] = tests;
      return acc;
    }, {});
  }, [categories, flattenTests]);

  
useEffect(() => {
  if (!open || !project?._id || !userId) return;

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [owaspRes, bugScopesRes] = await Promise.all([
        getOwasp(),
        getBugScopes(project._id, userId, null),
      ]);

      setCategories(owaspRes.result || []);
      setRawBugScopes(bugScopesRes?.bugScopes || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, [open, project?._id, userId]);

useEffect(() => {
  if (!rawBugScopes.length || !Object.keys(formattedCategories).length) return;

  const allBugIds = [];
  const extractBugIds = (nodes) => {
    for (const node of nodes) {
      if (node.id) allBugIds.push(node.id);
      if (node.children?.length > 0) extractBugIds(node.children);
    }
  };
  extractBugIds(rawBugScopes);
console.log("bugScope IDs", allBugIds);

  const updated = new Set();

  Object.entries(formattedCategories).forEach(([category, tests]) => {
    Object.entries(tests).forEach(([testLabel, test]) => {
 
      if (test.id && allBugIds.includes(test.id)) {
          console.log("✅ matched test ID:", test.id);

        updated.add(`${category}-${testLabel}`);
      }else {
        console.log("test : " ,test )
          // console.log("❌ not matched:", test.id, allBugIds);

      }
    });
  });


  setSelectedTests(updated);
}, [formattedCategories, rawBugScopes]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return formattedCategories;

    const query = searchQuery.toLowerCase();
    return Object.entries(formattedCategories).reduce((acc, [category, tests]) => {
      const filteredTests = Object.entries(tests).reduce((testAcc, [testLabel, test]) => {
        if (testLabel.toLowerCase().includes(query)) {
          testAcc[testLabel] = test;
        }
        return testAcc;
      }, {});

      if (Object.keys(filteredTests).length > 0 || category.toLowerCase().includes(query)) {
        acc[category] = filteredTests;
      }
      return acc;
    }, {});
  }, [searchQuery, formattedCategories]);

  const handleSelectAll = useCallback(() => {
    setSelectedTests(prev => {
      const newSelected = new Set(prev);
      Object.entries(filteredCategories).forEach(([category, tests]) => {
        Object.keys(tests).forEach(testLabel => {
          newSelected.add(`${category}-${testLabel}`);
        });
      });
      return newSelected;
    });
  }, [filteredCategories]);

  const handleDeselectAll = useCallback(() => {
    setSelectedTests(prev => {
      const newSelected = new Set(prev);
      Object.entries(filteredCategories).forEach(([category, tests]) => {
        Object.keys(tests).forEach(testLabel => {
          newSelected.delete(`${category}-${testLabel}`);
        });
      });
      return newSelected;
    });
  }, [filteredCategories]);

  const handleToggleCategory = useCallback((category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const handleTestToggle = useCallback((category, testLabel) => {
    const testId = `${category}-${testLabel}`;
    setSelectedTests(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(testId)) {
        newSelected.delete(testId);
      } else {
        newSelected.add(testId);
      }
      return newSelected;
    });
  }, []);

  const handleToggleCategoryTests = useCallback((category) => {
    setSelectedTests(prev => {
      const newSelected = new Set(prev);
      const categoryTests = Object.keys(filteredCategories[category] || {});
      const allSelected = categoryTests.every(testLabel => 
        newSelected.has(`${category}-${testLabel}`)
      );

      categoryTests.forEach(testLabel => {
        const testId = `${category}-${testLabel}`;
        if (allSelected) {
          newSelected.delete(testId);
        } else {
          newSelected.add(testId);
        }
      });

      return newSelected;
    });
  }, [filteredCategories]);

  const handleAssign = useCallback(() => {
    const selectedTestsArray = Array.from(selectedTests);
    console.log("Assigned tests:", selectedTestsArray);
    onClose();
  }, [selectedTests, onClose]);

  if (loading) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">Loading OWASP categories...</Typography>
        </Box>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="error">
            Error loading OWASP categories
          </Typography>
          <Typography>{error}</Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Assign Bug Scope
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Pentester: {userId} | Project: {project?.projectName}
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<SelectAll />}
            onClick={handleSelectAll}
            size="small"
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            startIcon={<Deselect />}
            onClick={handleDeselectAll}
            size="small"
          >
            Deselect All
          </Button>
        </Box>

        <Typography variant="h6" sx={{ mt: 1 }}>
          OWASP Web Security Testing Guide (WSTG)
        </Typography>

        <List>
          {Object.entries(filteredCategories).map(([category, tests]) => {
            const isCategoryOpen = !!openCategories[category];
            const testEntries = Object.entries(tests);
            const hasTests = testEntries.length > 0;
            const allTestsSelected = hasTests && 
              testEntries.every(([testLabel]) => 
                selectedTests.has(`${category}-${testLabel}`)
              );
            const someTestsSelected = hasTests && 
              !allTestsSelected && 
              testEntries.some(([testLabel]) => 
                selectedTests.has(`${category}-${testLabel}`)
              );

            return (
              <div key={category}>
                <ListItem
                  button
                  onClick={() => handleToggleCategory(category)}
                  sx={{
                    bgcolor: isCategoryOpen ? "action.hover" : "inherit",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allTestsSelected}
                        indeterminate={someTestsSelected}
                        onChange={() => handleToggleCategoryTests(category)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label={category}
                    sx={{ flexGrow: 1 }}
                  />
                  {hasTests && (isCategoryOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                <Collapse in={isCategoryOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {testEntries.map(([testLabel, test]) => {
                      const testId = `${category}-${testLabel}`;
                      return (
                        <WebTestItem
                          key={testId}
                          testLabel={testLabel}
                          isSelected={selectedTests.has(testId)}
                          onToggle={() => handleTestToggle(category, testLabel)}
                          wstg={test.wstg}
                        />
                      );
                    })}
                  </List>
                </Collapse>
                <Divider />
              </div>
            );
          })}
        </List>

        <TextField
          label="Additional Notes"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 3 }}
        />

        {selectedTests.size > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              Selected Tests ({selectedTests.size}):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {Array.from(selectedTests)
                .slice(0, 6)
                .map((test) => {
                  const [category, ...testParts] = test.split("-");
                  const testLabel = testParts.join("-");
                  return (
                    <Chip
                      key={test}
                      label={testLabel}
                      onDelete={() => {
                        setSelectedTests(prev => {
                          const newSelected = new Set(prev);
                          newSelected.delete(test);
                          return newSelected;
                        });
                      }}
                      size="small"
                    />
                  );
                })}
              {selectedTests.size > 6 && (
                <Chip
                  label={`+${selectedTests.size - 6} more`}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={selectedTests.size === 0}
          >
            Assign Selected Tests
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(BugScopeModal);