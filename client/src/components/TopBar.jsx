import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Autocomplete,
  TextField,
  Box,
  Tooltip,
  Button, IconButton,
  Menu, MenuItem, ListItemIcon,
  AppBar, Toolbar,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  Radio, RadioGroup, FormControl, FormLabel, FormControlLabel,
  Typography,
} from "@mui/material";
import { 
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  CloudDownload as CloudDownloadIcon,
  Save as SaveIcon,
  RestorePage as RestorePageIcon,
  ControlCamera as ControlCameraIcon,
} from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";

const PlatesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
const CreatePlatesURL = `${PlatesURL}/create`;
const ReadPlatesURL = `${PlatesURL}/read`;
const UpdatePlatesURL = `${PlatesURL}/update`;
const DeletePlatesURL = `${PlatesURL}/delete`;

const TopBar = (props) => {
  const {
    currPlate,
    setCurrPlate,
    isModified,
    setIsModified,
    cookies,
    removeCookie,
    setPlatePos,
  } = props;
  
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [platesCache, setPlatesCache] = useState([]);

  // EFFECTS ----------------------------------------------

  // on first render or any cookie change, fetch all plates and set current plate
  // to be the first plate if possible. Redirect to login as necessary.
  const [selectedPlate, setSelectedPlate] = useState(null);
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token || cookies.token === "undefined") {
        return navigate("/login");
      }
      const { data } = await axios.get(
        PlatesURL,
        { withCredentials: true }
      );
      if (data.unauthorized) {
        removeCookie("token");
        return navigate("/login");
      }
      setUsername(data.username);
      if (data.plates.length > 0) {
        setIsModified(false);
        setPlatesCache(data.plates);
        setSelectedPlate(data.plates[0]);
        setCurrPlate({...data.plates[0]});
      }
    };
    verifyCookie();
  }, [cookies]);

  // ACTIONS ----------------------------------------------

  // Plate Selection Dropdown =========
  const [dropdownChangeCandidate, setDropdownChangeCandidate] = useState(null);
  const onDropdownChange = (e, value) => {
    if (selectedPlate && value._id === selectedPlate._id) { return; }

    if (isModified) {
      setDropdownChangeCandidate(value);
    } else {
      handleDropdownChange(value);
    }
  };
  const handleDropdownChange = (value) => {
    setSelectedPlate(value);
    setCurrPlate({...value});
    setIsModified(false);
    setDropdownChangeCandidate(null);
  };

  // CreatePlate ======================
  const [showCreatePlateDialog, setShowCreatePlateDialog] = useState(false);
  const openCreatePlateDialog = () => { setShowCreatePlateDialog(true); };
  const closeCreatePlateDialog = () => { setShowCreatePlateDialog(false); };

  const [newPlateName, setNewPlateName] = useState("New Plate");
  const handleNewPlateNameChange = (e) => { setNewPlateName(e.target.value); };
  
  const [sizeString, setSizeString] = useState("8,12");
  const [nRowString, setnRowString] = useState("8");
  const [nColString, setnColString] = useState("12");
  const handleSizeSelection = (e) => { setSizeString(e.target.value); };
  const handleSizeInputFocus = (e) => { 
    e.target.select();
    setSizeString("Custom");
  };

  const handlenRowInput = (e) => { setnRowString(e.target.value); };
  const handlenColInput = (e) => { setnColString(e.target.value); };

  const handleCreatePlate = async () => {
    if (newPlateName.length < 1) {
      toast.error("Plate Name is required.");
      return
    }

    let nRow, nCol;
    if (sizeString === "Custom") {
      nRow = parseInt(nRowString);
      nCol = parseInt(nColString);
    } else {
      [ nRow, nCol ] = sizeString.split(",").map((num) => parseInt(num));
    }
    if (!nRow || nRow < 1 || nRow > 16) {
      toast.error("Number of rows must be an integer between 1 and 16, inclusive.");
      return
    }
    if (!nCol || nCol < 1 || nCol > 24) {
      toast.error("Number of columns must be an integer between 1 and 24, inclusive.");
      return
    }
    const { data } = await axios.post(
      CreatePlatesURL,
      { plates: [{
        plateName: newPlateName,
        nRow,
        nCol,
      }] },
      { withCredentials: true }
    );
    if (data.unauthorized) {
      removeCookie("token");
      return navigate("/login");
    }
    const result = data.output[0];
    if (!result.isCreated) {
      // should not happen during normal use
      return toast.error(result.reason);
    }

    setIsModified(false);
    setSelectedPlate(result.newPlate);
    setCurrPlate({...result.newPlate});
    setPlatesCache([...platesCache, result.newPlate]);
    closeCreatePlateDialog();
  };

  // SyncPlate ========================
  
  // helper for SyncPlate, UpdatePlate. Expect a fresh copy
  // e.g., shouldn't pass in `currPlate` directly
  // does NOT update `currPlate`, because only SyncPlate needs it
  const updateCachedPlate = (updatedPlateCache) => {
    const newPlatesCache = platesCache.map((plate) => {
      if (plate._id != updatedPlateCache._id) {
        return {...plate};
      } else {
        return updatedPlateCache;
      }
    });
    setPlatesCache(newPlatesCache);
    setSelectedPlate(updatedPlateCache);
    setIsModified(false);
  };

  const [syncTarget, setSyncTarget] = useState(null);
  const onSyncPlate = () => {
    // the button should be disabled if no plate is selected
    if (isModified) {
      setSyncTarget(selectedPlate);
    } else {
      handleSyncPlate(selectedPlate);
    }
  };
  const handleSyncPlate = async (targetPlate) => {
    const { data } = await axios.post(
      ReadPlatesURL,
      { IDs: [targetPlate._id] },
      { withCredentials: true }
    );
    if (data.unauthorized) {
      removeCookie("token");
      return navigate("/login");
    }
    const result = data.output[0];
    if (result.reason) {
      // should not happen during normal use
      return toast.error(result.reason);
    }
    updateCachedPlate(result);
    setCurrPlate({...result});
    setSyncTarget(null);
  };

  // SavePlate ========================
  const handleSavePlate = async () => {
    // NOTE: the button should be disabled if the plate is unmodified
    // Also assumes that input validation is done at the AssayPlate level
    const { data } = await axios.post(
      UpdatePlatesURL,
      { plates: [currPlate] },
      { withCredentials: true }
    );
    console.log(data);
    if (data.unauthorized) {
      removeCookie("token");
      return navigate("/login");
    }
    if (data.failures.length > 0) {
      // should not happen during normal use
      return toast.error(data.failures[0].reason);
    }
    updateCachedPlate({...currPlate});
  };

  // RestorePlate =======================
  const [restoreTarget, setRestoreTarget] = useState(null);
  const onRestorePlate = () => {
    setRestoreTarget(selectedPlate);
  };
  const handleRestorePlate = async (targetPlate) => {
    // NOTE: the button should be disabled if the plate is unmodified
    setCurrPlate({...targetPlate});
    setIsModified(false);
    setRestoreTarget(null);
  };

  // DeletePlate ======================
  const [deletionTarget, setDeletionTarget] = useState(null);
  const onDeletePlate = () => { setDeletionTarget(selectedPlate); };
  const handleDeletePlate = async (targetPlate) => {
    const { data } = await axios.post(
      DeletePlatesURL,
      { IDs: [targetPlate._id] },
      { withCredentials: true }
    );
    if (data.unauthorized) {
      removeCookie("token");
      return navigate("/login");
    }
    if (data.failures.length > 0) {
      // should not happen during normal use
      return toast.error(data.failures[0].reason);
    }

    const newPlatesCache = platesCache.filter((plate) => plate._id != targetPlate._id);
    setPlatesCache(newPlatesCache);
    setIsModified(false);
    setDeletionTarget(null);
    if (newPlatesCache.length > 0) {
      setSelectedPlate(newPlatesCache[0]);
      setCurrPlate({...newPlatesCache[0]});
    } else {
      setSelectedPlate(null);
      setCurrPlate(null);
    }
  };

  // Profile Menu ======================
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const openProfileMenu = (e) => { setProfileMenuAnchorEl(e.currentTarget); }
  const closeProfileMenu = () => { setProfileMenuAnchorEl(null); };

  // Logout ============================
  const [logoutDialogDummy, setLogoutDialogDummy] = useState(null);
  const onLogout = () => {
    if (isModified) {
      setLogoutDialogDummy({});
    } else {
      setLogoutDialogDummy(null);
      handleLogout({});
    }
  };
  const handleLogout = (dummy) => {
    removeCookie("token");  // will trigger the `cookies` dependence and cause redirection
    toast.success("Logged out successfully");
  };

  const topBarStyle = {
    padding: "0.2em 0",
    backgroundColor: "orange",
  };

  return (
    <AppBar position="fixed" style={topBarStyle}>
    <Toolbar style={{ gap: "0.2em" }}>
    <Autocomplete 
      style={{ width: "28ch" }}
      options={platesCache}
      autoHighlight
      disableClearable
      value={selectedPlate}
      onChange={onDropdownChange}
      getOptionKey={(plate) => plate._id}
      getOptionLabel={(plate) => plate.plateName || ""}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.plateName} ({option.nRow}x{option.nCol})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a plate"
          variant="standard"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off"
          }}
        />
      )}
    />
    <ConfirmDialog 
      candidate={dropdownChangeCandidate}
      setCandidate={setDropdownChangeCandidate}
      onConfirm={handleDropdownChange}
      actionTitle="Unsaved changes in current plate"
      actionDescription={dropdownChangeCandidate ? `Do you wish to discard the changes and change to "${dropdownChangeCandidate.plateName}"?` : "Loading..."}
    />

    <Tooltip title="Create new plate">
      <IconButton onClick={openCreatePlateDialog} size="small">
        <AddCircleOutlineIcon fontSize="large"/>
      </IconButton>
    </Tooltip>
    <Dialog
      open={showCreatePlateDialog}
      onClose={closeCreatePlateDialog}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>New Plate Info</DialogTitle>
      <DialogContent style={{ display: "flex", flexDirection: "column", gap: "2ch" }}>
        {isModified && <DialogContentText>You have unsaved changes in the current plate! Creating a new plate now will discard those changes.</DialogContentText>}
        <TextField
          value={newPlateName}
          variant="standard"
          onChange={handleNewPlateNameChange}
          inputProps={{ maxLength: "20" }}
          autoFocus
          onFocus={e => {e.target.select();}}
          required
          size="small"
          autoComplete="off"
          placeholder="Enter name for new plate"
          label="Plate Name"
        />
        
        <FormControl>
          <FormLabel>Size *</FormLabel>
          <RadioGroup
            value={sizeString}
            onChange={handleSizeSelection}>
            <Box>
              <FormControlLabel value="8,12" control={<Radio />} label="8 x 12" />
              <FormControlLabel value="16,24" control={<Radio />} label="16 x 24" />
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel value="Custom" control={<Radio />} label="Custom:" />
              <TextField
                style={{ width: "2ch", marginRight: "1ch" }}
                onFocus={handleSizeInputFocus}
                value={nRowString}
                onChange={handlenRowInput}
                inputProps={{ maxLength: "2" }}
                variant="standard"
                size="small"
                autoComplete="off"
                required
              />
              <Typography>x</Typography>
              <TextField
                style={{ width: "2ch", marginLeft: "1ch" }}
                onFocus={handleSizeInputFocus}
                value={nColString}
                onChange={handlenColInput}
                inputProps={{ maxLength: "2" }}
                variant="standard"
                size="small"
                autoComplete="off"
                required
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCreatePlateDialog}>Cancel</Button>
        <Button onClick={handleCreatePlate}>Create</Button>
      </DialogActions>
    </Dialog>

    <Tooltip title="Sync current plate with the cloud's copy">
      <span><IconButton disabled={!Boolean(selectedPlate)} onClick={onSyncPlate} size="small">
        <CloudDownloadIcon fontSize="large"/>
      </IconButton></span>
    </Tooltip>
    <ConfirmDialog
      candidate={syncTarget}
      setCandidate={setSyncTarget}
      onConfirm={handleSyncPlate}
      actionTitle="Unsaved changes in current plate"
      actionDescription="Do you wish to discard the changes and sync current plate's info with the cloud's copy?"
    />

    <Tooltip title="Save current plate and upload to cloud">
      <span><IconButton disabled={!isModified} onClick={handleSavePlate} size="small">
        <SaveIcon fontSize="large"/>
      </IconButton></span>
    </Tooltip>

    <Tooltip title="Restore current plate to last save">
      <span><IconButton disabled={!isModified} onClick={onRestorePlate} size="small">
        <RestorePageIcon fontSize="large"/>
      </IconButton></span>
    </Tooltip>
    <ConfirmDialog 
      candidate={restoreTarget}
      setCandidate={setRestoreTarget}
      onConfirm={handleRestorePlate}
      actionTitle="Confirm Restoration"
      actionDescription="Restore the current plate to its previous save? This cannot be undone."
    />

    <Tooltip title="Delete current plate">
      <span><IconButton disabled={!Boolean(selectedPlate)} onClick={onDeletePlate} size="small">
        <DeleteIcon fontSize="large"/>
      </IconButton></span>
    </Tooltip>
    <ConfirmDialog 
      candidate={deletionTarget}
      setCandidate={setDeletionTarget}
      onConfirm={handleDeletePlate}
      actionTitle="Confirm Deletion"
      actionDescription={deletionTarget ? `Delete plate "${deletionTarget.plateName}"? This cannot be undone.` : "Loading..."}
    />

    <Tooltip title="Reset plate position">
      <IconButton onClick={() => {setPlatePos({ x: 0, y: 0 })}} size="small">
        <ControlCameraIcon fontSize="large"/>
      </IconButton>
    </Tooltip>

    <Box sx={{ flexGrow: 1 }} />

    <Tooltip title={`User: ${username}`}>
      <IconButton onClick={openProfileMenu} size="small">
        <AccountCircleIcon fontSize="large" />
      </IconButton>
    </Tooltip>
    <Menu
      anchorEl={profileMenuAnchorEl}
      open={Boolean(profileMenuAnchorEl)}
      onClose={closeProfileMenu}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
      <ConfirmDialog 
        candidate={logoutDialogDummy}
        setCandidate={setLogoutDialogDummy}
        onConfirm={handleLogout}
        actionTitle="Unsaved changes in current plate"
        actionDescription="Do you wish to discard the changes and log out?"
    />
    </Menu> 
    </Toolbar>
    </AppBar>
  )
};

export default TopBar;