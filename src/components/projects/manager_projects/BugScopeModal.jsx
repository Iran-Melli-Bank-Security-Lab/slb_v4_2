import { React, useState, useMemo, useCallback, memo, useEffect } from "react";
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
  IconButton,
  TextField,
  Chip,
  useMediaQuery,
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

// Sample OWASP WSTG categories (should come from API in production)
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
  "Identity Management Testing": {
    "Test Role Definitions": [],
    "Test User Registration Process": [],
  },
  "Authentication Testing": {
    "Test Credential Strength": [],
    "Test for Default Credentials": [],
  },
  "Authorization Testing": {
    "Test Directory Traversal File Include": [],
    "Test for Bypassing Authorization Schema": [],
    "Test for Privilege Escalation": [],
  },
};

const BugScopeModal = ({ open, onClose, userId, project }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openCategories, setOpenCategories] = useState({});
  const [selectedTests, setSelectedTests] = useState([]);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return OWASP_WSTG_CATEGORIES;

    const filtered = {};
    Object.entries(OWASP_WSTG_CATEGORIES).forEach(([category, tests]) => {
      const filteredTests = {};
      Object.entries(tests).forEach(([test, subTests]) => {
        if (test.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredTests[test] = subTests;
        }
      });

      if (
        Object.keys(filteredTests).length > 0 ||
        category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filtered[category] = filteredTests;
      }
    });

    return filtered;
  }, [searchQuery]);

  // Select all tests in the current filtered view
  const handleSelectAll = useCallback(() => {
    const allTests = [];
    Object.entries(filteredCategories).forEach(([category, tests]) => {
      Object.keys(tests).forEach((test) => {
        allTests.push(`${category}-${test}`);
      });
    });
    setSelectedTests(Array.from(new Set([...selectedTests, ...allTests])));
  }, [filteredCategories, selectedTests]);

  // Deselect all tests in the current filtered view
  const handleDeselectAll = useCallback(() => {
    const filteredTestIds = [];
    Object.entries(filteredCategories).forEach(([category, tests]) => {
      Object.keys(tests).forEach((test) => {
        filteredTestIds.push(`${category}-${test}`);
      });
    });
    setSelectedTests(
      selectedTests.filter((id) => !filteredTestIds.includes(id))
    );
  }, [filteredCategories, selectedTests]);

  // Toggle category expansion
  const handleToggleCategory = useCallback((category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Toggle individual test selection
  const handleTestToggle = useCallback((category, test) => {
    const testId = `${category}-${test}`;
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  }, []);

  // Toggle all tests in a category
  const handleToggleCategoryTests = useCallback(
    (category) => {
      const categoryTests = Object.keys(filteredCategories[category] || {}).map(
        (test) => `${category}-${test}`
      );

      const allSelected = categoryTests.every((test) =>
        selectedTests.includes(test)
      );

      setSelectedTests((prev) =>
        allSelected
          ? prev.filter((id) => !categoryTests.includes(id))
          : Array.from(new Set([...prev, ...categoryTests]))
      );
    },
    [filteredCategories, selectedTests]
  );

  const handleAssign = () => {
   
    onClose();
  };

  // Mobile-friendly list item component
  const MobileTestItem = ({ category, test }) => (
    <ListItem
      button
      onClick={() => handleTestToggle(category, test)}
      sx={{ pl: 2 }}
    >
      <Checkbox
        edge="start"
        checked={selectedTests.includes(`${category}-${test}`)}
        tabIndex={-1}
        disableRipple
      />
      <ListItemText primary={test} sx={{ wordBreak: "break-word" }} />
    </ListItem>
  );

  // Web list item component
  const WebTestItem = ({ category, test }) => (
    <ListItem sx={{ pl: 4 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedTests.includes(`${category}-${test}`)}
            onChange={() => handleTestToggle(category, test)}
          />
        }
        label={test}
      />
    </ListItem>
  );

  return (
    <>
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
            OWASP {isMobile ? "" : "Web Security Testing Guide (WSTG)"}
          </Typography>

          {isMobile ? (
            // Mobile-friendly list view
            <List>
              {Object.entries(filteredCategories).map(([category, tests]) => (
                <div key={category}>
                  <ListItem
                    button
                    onClick={() => handleToggleCategory(category)}
                    sx={{
                      bgcolor: openCategories[category]
                        ? "action.hover"
                        : "inherit",
                    }}
                  >
                    <Checkbox
                      edge="start"
                      checked={Object.keys(tests).every((test) =>
                        selectedTests.includes(`${category}-${test}`)
                      )}
                      indeterminate={
                        Object.keys(tests).some((test) =>
                          selectedTests.includes(`${category}-${test}`)
                        ) &&
                        !Object.keys(tests).every((test) =>
                          selectedTests.includes(`${category}-${test}`)
                        )
                      }
                      onChange={() => handleToggleCategoryTests(category)}
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={category} />
                    {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openCategories[category]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {Object.keys(tests).map((test) => (
                        <MobileTestItem
                          key={test}
                          category={category}
                          test={test}
                        />
                      ))}
                    </List>
                  </Collapse>
                  <Divider />
                </div>
              ))}
            </List>
          ) : (
            <List>
              {Object.entries(filteredCategories).map(([category, tests]) => (
                <div key={category}>
                  <ListItem
                    button
                    onClick={() => handleToggleCategory(category)}
                    sx={{
                      bgcolor: openCategories[category]
                        ? "action.hover"
                        : "inherit",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Object.keys(tests).every((test) =>
                            selectedTests.includes(`${category}-${test}`)
                          )}
                          indeterminate={
                            Object.keys(tests).some((test) =>
                              selectedTests.includes(`${category}-${test}`)
                            ) &&
                            !Object.keys(tests).every((test) =>
                              selectedTests.includes(`${category}-${test}`)
                            )
                          } // ✅ Closed properly now
                          onChange={() => handleToggleCategoryTests(category)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label={category}
                      sx={{ flexGrow: 1 }}
                    />

                    {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openCategories[category]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {Object.keys(tests).map((test) => (
                        <WebTestItem
                          key={test}
                          category={category}
                          test={test}
                        />
                      ))}
                    </List>
                  </Collapse>
                  <Divider />
                </div>
              ))}
            </List>
          )}

          <TextField
            label="Additional Notes"
            multiline
            rows={isMobile ? 2 : 4}
            fullWidth
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 3 }}
          />

          {selectedTests.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Selected Tests ({selectedTests.length}):
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {selectedTests.slice(0, isMobile ? 3 : 6).map((test) => (
                  <Chip
                    key={test}
                    label={test.split("-")[1]}
                    onDelete={() =>
                      setSelectedTests(selectedTests.filter((t) => t !== test))
                    }
                    size="small"
                  />
                ))}
                {selectedTests.length > (isMobile ? 3 : 6) && (
                  <Chip
                    label={`+${selectedTests.length - (isMobile ? 3 : 6)} more`}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAssign}
              disabled={selectedTests.length === 0}
            >
              Assign Selected Tests
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default memo(BugScopeModal);
