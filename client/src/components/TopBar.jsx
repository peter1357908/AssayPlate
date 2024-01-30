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
  Dialog, DialogTitle, DialogContent, DialogActions,
  Radio, RadioGroup, FormControl, FormLabel, FormControlLabel,
  Typography,
} from "@mui/material";
import { 
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Restore as RestoreIcon
}  from "@mui/icons-material";

const PlatesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
const CreatePlatesURL = `${PlatesURL}/create`;
const ReadPlatesURL = `${PlatesURL}/read`;
const UpdatePlates = `${PlatesURL}/update`;
const DeletePlates = `${PlatesURL}/delete`;

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

const TopBar = (props) => {
  const { currPlate, setCurrPlate, isModified, setIsModified, cookies, removeCookie } = props;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [platesCache, setPlatesCache] = useState([]);

  // EFFECTS ----------------------------------------------

  // on first render or any cookie change, fetch all plates and set current plate
  // to be the first plate if possible. Redirect to login as necessary.
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
        setPlatesCache(data.plates);
        setCurrPlate(data.plates[0]);
      }
    };
    verifyCookie();
  }, [cookies]);

  // ACTIONS ----------------------------------------------

  // swap the current plate; warn about discarding changes if applicable
  const onDropdownChange = (e, value) => {
    if (currPlate && value._id === currPlate._id) { return; }
    // TODO
    // if (isModified) {
    // https://mui.com/material-ui/react-dialog/
    // }
    setCurrPlate(value);
  };

  // CreatePlate Stuff ==================
  const [createPlateDialogIsOpen, setCreatePlateDialogIsOpen] = useState(false);
  const openCreatePlateDialog = () => { setCreatePlateDialogIsOpen(true); };
  const closeCreatePlateDialog = () => { setCreatePlateDialogIsOpen(false); };

  const [newPlateName, setNewPlateName] = useState("New Plate");
  const handleNewPlateNameChange = (e) => { setNewPlateName(e.target.value); }
  
  const [sizeString, setSizeString] = useState("8,12");
  const [nRowString, setnRowString] = useState("8");
  const [nColString, setnColString] = useState("12");
  const handleSizeSelection = (e) => { setSizeString(e.target.value); };
  const handleSizeInputFocus = (e) => { 
    e.target.select();
    setSizeString("Custom");
  };

  const handlenRowInput = (e) => { setnRowString(e.target.value); }
  const handlenColInput = (e) => { setnColString(e.target.value); }

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
      toast.error(result.reason);  // should not happen during normal use
    } else {
      setCurrPlate(result.newPlate);
      setPlatesCache([...platesCache, result.newPlate]);
    }
    closeCreatePlateDialog();
  }

  // DeletePlate Stuff ==================
  const handleDeletePlate = async () => {
    const { data } = await axios.post(
      DeletePlates,
      { IDs: [currPlate._id] },
      { withCredentials: true }
    );
    if (data.unauthorized) {
      removeCookie("token");
      return navigate("/login");
    }
    if (data.failures.legnth > 0) {
      toast.error(data.failures[0].reason);  // should not happen during normal use
    } else {
      const newPlatesCache = platesCache.filter((plate) => plate._id != currPlate._id);
      setPlatesCache(newPlatesCache);
      if (newPlatesCache.length > 0) {
        setCurrPlate(newPlatesCache[0]);
      } else {
        setCurrPlate(null);
      }
    }
  }

  // Profile Menu Stuff ==================
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const openProfileMenu = (e) => { setProfileMenuAnchorEl(e.currentTarget); }
  const closeProfileMenu = () => { setProfileMenuAnchorEl(null); };

  const handleLogout = () => {
    // TODO
    // if (isModified) {
    // https://mui.com/material-ui/react-dialog/
    // }
    removeCookie("token");  // will trigger the `cookies` dependence and cause redirection
    toast.success("Logged out successfully");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "orange" }}>
    <Toolbar style={{ justifyContent: "space-between" }}>
    <Box style={{ display: "flex" }}>
    <Autocomplete 
        style={{ width: "28ch" }}
        options={platesCache}
        autoHighlight
        disableClearable
        value={currPlate}
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

      <Tooltip title="Create new plate">
        <IconButton onClick={openCreatePlateDialog} size="small">
          <AddCircleOutlineIcon fontSize="large"/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={createPlateDialogIsOpen}
        onClose={closeCreatePlateDialog}
      >
        <DialogTitle>New Plate Info</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "2ch" }}>
          <FormControl>
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
          </FormControl>
          
          <FormControl>
            <FormLabel>Size *</FormLabel>
            <RadioGroup value={sizeString} onChange={handleSizeSelection}>
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
                  inputProps={{maxLength: "2"}}
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
                  inputProps={{maxLength: "2"}}
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

      <Tooltip title="Delete current plate">
        <IconButton onClick={handleDeletePlate} size="small">
          <DeleteIcon fontSize="large"/>
        </IconButton>
      </Tooltip>
    </Box>
    
    <Box>
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>  
    </Toolbar>
    </AppBar>
  )
};

export default TopBar;