import { React, useState, useMemo, useCallback , memo , useEffect} from "react";
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
  Tabs,
  Tab,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Search,

} from "@mui/icons-material";

// Sample OWASP WSTG categories (Web)
const OWASP_WSTG_CATEGORIES = {
  "Information Gathering": {
    "Conduct Search Engine Discovery": [],
    "Fingerprint Web Server": [],
    "Review Webserver Metafiles": [],
  },
  "Configuration and Deployment Management Testing": {
    "Test Network Infrastructure Configuration": [],
    "Test Application Platform Configuration": [],
  },
  // ... more web categories
};

// Sample OWASP MSTG categories (Mobile)
const OWASP_MSTG_CATEGORIES = {
  "Mobile App Authentication": {
    "Verify Password Policy": [],
    "Test Biometric Authentication": [],
  },
  "Data Storage and Privacy": {
    "Test Local Data Storage": [],
    "Check for Sensitive Data in Logs": [],
  },
};

const BugScopeModal = ({ open, onClose, userId, project, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState("web");
  const [openCategories, setOpenCategories] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("render ")
  // Memoized flattened test list for search and bulk operations
  const allTests = useMemo(() => {
    const tests = [];
    const categories = tabValue === "web" ? OWASP_WSTG_CATEGORIES : OWASP_MSTG_CATEGORIES;
    
    Object.entries(categories).forEach(([category, subTests]) => {
      Object.keys(subTests).forEach((test) => {
        tests.push({
          id: `${category}-${test}`,
          category,
          test,
        });
      });
    });
    return tests;
  }, [tabValue]);

  // Filter tests based on search query
  const filteredTests = useMemo(() => {
    if (!searchQuery) return allTests;
    const query = searchQuery.toLowerCase();
    return allTests.filter(
      (item) =>
        item.category.toLowerCase().includes(query) ||
        item.test.toLowerCase().includes(query)
    );
  }, [allTests, searchQuery]);

  // Group filtered tests by category for display
  const groupedTests = useMemo(() => {
    const groups = {};
    filteredTests.forEach(({ category, test }) => {
      if (!groups[category]) groups[category] = [];
      groups[category].push(test);
    });
    return groups;
  }, [filteredTests]);

  // Check if all tests are selected
  const allSelected = useMemo(
    () => filteredTests.length > 0 && filteredTests.every((test) => selectedTests.includes(test.id)),
    [filteredTests, selectedTests]
  );

  // Check if some tests are selected
  const someSelected = useMemo(
    () => !allSelected && filteredTests.some((test) => selectedTests.includes(test.id)),
    [allSelected, filteredTests, selectedTests]
  );

  const handleToggleCategory = useCallback((category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const handleTestToggle = useCallback((testId) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      // Deselect all filtered tests
      setSelectedTests((prev) =>
        prev.filter((id) => !filteredTests.some((test) => test.id === id))
      );
    } else {
      // Select all filtered tests
      const newSelected = new Set(selectedTests);
      filteredTests.forEach((test) => newSelected.add(test.id));
      setSelectedTests(Array.from(newSelected));
    }
  }, [allSelected, filteredTests, selectedTests]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset open categories when switching tabs
    setOpenCategories({});
  };

  const handleAssign = () => {
    // API call to save assignments would go here
    console.log("Assigned tests:", {
      userId,
      projectId: project._id,
      tests: selectedTests,
      notes,
    });
    onClose();
  };

  // Set all tests as selected by default when modal opens
  useEffect(() => {
    if (open) {
      setSelectedTests(allTests.map((test) => test.id));
    }
  }, [open, allTests]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "95%" : "80%",
          maxWidth: 800,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Assign Bug Scope
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Pentester: {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Project: {project?.projectName}
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 2 }}
          variant="fullWidth"
        >
          <Tab label="Web Tests" value="web" />
          <Tab label="Mobile Tests" value="mobile" />
        </Tabs>

        <TextField
          fullWidth
          placeholder="Search tests..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={handleSelectAll}
              />
            }
            label={allSelected ? "Deselect All" : "Select All"}
          />
          <Typography variant="caption" sx={{ ml: 2 }}>
            {selectedTests.length} tests selected
          </Typography>
        </Box>

        <List sx={{ maxHeight: "40vh", overflow: "auto" }}>
          {Object.entries(groupedTests).map(([category, tests]) => (
            <div key={category}>
              <ListItem
                button
                onClick={() => handleToggleCategory(category)}
                sx={{
                  bgcolor: openCategories[category] ? "action.hover" : "inherit",
                  pl: isMobile ? 1 : 2,
                }}
              >
                <ListItemText
                  primary={category}
                  primaryTypographyProps={{ variant: isMobile ? "body2" : "body1" }}
                />
                {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {tests.map((test) => {
                    const testId = `${category}-${test}`;
                    return (
                      <ListItem key={testId} sx={{ pl: isMobile ? 4 : 6 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedTests.includes(testId)}
                              onChange={() => handleTestToggle(testId)}
                              size={isMobile ? "small" : "medium"}
                            />
                          }
                          label={
                            <Typography variant={isMobile ? "body2" : "body1"}>
                              {test}
                            </Typography>
                          }
                          sx={{ ml: 0 }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
              <Divider />
            </div>
          ))}
        </List>

        {filteredTests.length === 0 && (
          <Typography sx={{ textAlign: "center", py: 2 }}>
            No tests found matching your search
          </Typography>
        )}

        <TextField
          label="Additional Notes"
          multiline
          rows={isMobile ? 2 : 4}
          fullWidth
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2 }}
        />

        {selectedTests.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Tests:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedTests.slice(0, isMobile ? 3 : 5).map((testId) => {
                const test = allTests.find((t) => t.id === testId);
                return (
                  <Chip
                    key={testId}
                    label={test?.test || testId.split("-")[1]}
                    onDelete={() => handleTestToggle(testId)}
                    size={isMobile ? "small" : "medium"}
                  />
                );
              })}
              {selectedTests.length > (isMobile ? 3 : 5) && (
                <Chip
                  label={`+${selectedTests.length - (isMobile ? 3 : 5)} more`}
                  size={isMobile ? "small" : "medium"}
                />
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={selectedTests.length === 0}
          >
            Assign ({selectedTests.length})
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(BugScopeModal);