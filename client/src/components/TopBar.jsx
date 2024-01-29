import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Autocomplete, TextField, Typography } from '@mui/material';

const platesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
const platesSpecificURL = `${platesURL}/specific`;

const TopBar = (props) => {
  const { currPlate, setCurrPlate, isModified, setIsModified } = props;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
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
    console.log(value._id);
    if (currPlate && event.target.value === currPlate._id) { return; }
    // if (isModified) {

    // }

    // for (let plate of platesCache) {
    //   if (plate._id === event.target.value) {
    //     setCurrPlate(plate);
    //     break;
    //   }
    // }
  };

  const logout = () => {
    removeCookie("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleButtonClick = () => {
    // Handle button click logic
    toast.info('Button clicked!');
  };
  
  // RENDERS ----------------------------------------------

  return (
    <div className="top-bar">
      <Autocomplete 
        style={{ width: 250 }}
        options={platesCache}
        autoHighlight
        disableClearable
        getOptionKey={(plate) => plate._id}
        getOptionLabel={(plate) => plate.plateName}
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
      <button onClick={handleButtonClick}>Button 1</button>
      <button onClick={handleButtonClick}>Button 2</button>

      <Typography>{username}</Typography>
      <button id="logout" onClick={logout}>LOGOUT</button>
    </div>
  )
};

export default TopBar;