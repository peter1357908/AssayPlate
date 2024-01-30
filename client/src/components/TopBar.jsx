import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Autocomplete, TextField, Box, Tooltip, IconButton, Menu, MenuItem, ListItemIcon, AppBar, Toolbar } from '@mui/material';
import { Logout as LogoutIcon, AccountCircle as AccountCircleIcon }  from '@mui/icons-material';

const platesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
const platesSpecificURL = `${platesURL}/specific`;

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
        platesURL,
        { withCredentials: true }
      );
      if (data.message) {
        removeCookie("token");
        return navigate("/login");
      }
      setUsername(data.username);
      if (data.plates) {
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

  const handleLogout = () => {
    // TODO
    // if (isModified) {
    // https://mui.com/material-ui/react-dialog/
    // }
    removeCookie("token");  // will trigger the `cookies` dependence and cause redirection
    toast.success("Logged out successfully");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleButtonClickPlaceholder = () => {
    // Handle button click logic
    toast.info('Button clicked!');
  };
  
  // RENDERS ----------------------------------------------

  return (
    <AppBar position="static"><Toolbar sx={{ width: "100%" }}>
      <Autocomplete 
        style={{ width: 280 }}
        options={platesCache}
        autoHighlight
        disableClearable
        getOptionKey={(plate) => plate._id}
        getOptionLabel={(plate) => plate.plateName}
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
      <button onClick={handleButtonClickPlaceholder}>Button 1</button>
      <button onClick={handleButtonClickPlaceholder}>Button 2</button>
      
      <Tooltip title={username}>
        <IconButton
          onClick={handleProfileIconClick}
          size="small"
        >
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