import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Autocomplete,
  TextField,
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Restore as RestoreIcon
}  from '@mui/icons-material';

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
  const onDropdownChange = (event, value) => {
    if (currPlate && value._id === currPlate._id) { return; }
    // TODO
    // if (isModified) {
    // https://mui.com/material-ui/react-dialog/
    // }
    setCurrPlate(value);
  };

  const handleCreatePlate = async () => {
    const { data } = await axios.post(
      CreatePlatesURL,
      { plates: [{
        plateName: "new plate",
        nRow: 2,
        nCol: 3
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
  }

  const handleDeleteCurrPlate = async () => {
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

  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO
    // if (isModified) {
    // https://mui.com/material-ui/react-dialog/
    // }
    removeCookie("token");  // will trigger the `cookies` dependence and cause redirection
    toast.success("Logged out successfully");
  };
  
  // RENDERS ----------------------------------------------

  return (
    <AppBar position="static"><Toolbar>
      <Autocomplete 
        style={{ width: 280 }}
        options={platesCache}
        autoHighlight
        disableClearable
        value={currPlate}
        getOptionKey={(plate) => plate._id}
        getOptionLabel={(plate) => plate.plateName || ""}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.plateName} ({option.nRow}x{option.nCol})
          </Box>
        )}
        onChange={onDropdownChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a plate"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off'
            }}
          />
        )}
      />

      <Tooltip title="Create new plate">
        <IconButton onClick={handleCreatePlate} size="small">
          <AddCircleOutlineIcon fontSize="large"/>
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete current plate">
        <IconButton onClick={handleDeleteCurrPlate} size="small">
          <DeleteIcon fontSize="large"/>
        </IconButton>
      </Tooltip>
      
      <Tooltip title={`User: ${username}`}>
        <IconButton onClick={handleProfileIconClick} size="small">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Toolbar></AppBar>
  )
};

export default TopBar;