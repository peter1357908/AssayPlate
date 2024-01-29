import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const platesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
const platesSpecificURL = `${platesURL}/specific`;

const TopBar = (props) => {
  const { currPlate, setCurrPlate, isModified, setIsModified } = props;
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['token']);
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
      console.log(data);
      if (data.message) {
        removeCookie("token");
        return navigate("/login");
      }
      setUsername(data.username);
      toast(`Hello, ${data.username}!`, { position: "top-right" });
      if (data.plates) {
        setPlatesCache(data.plates);
        setCurrPlate(data.plates[0]);
      }
    };
    verifyCookie();
  }, [cookies]);

  // ACTIONS ----------------------------------------------

  // swap the current plate; warn about discarding changes if applicable
  const onDropdownChange = (event) => {
    if (isModified) {

    }

    setSelectedItem(event.target.value);
  };

  const logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  const handleButtonClick = () => {
    // Handle button click logic
    toast.info('Button clicked!');
  };
  
  // RENDERS ----------------------------------------------

  const renderDropdownOptions = () => {
    if (!platesCache) {
      return [<option value="" disabled>No plate yet!</option>]
    }
    
    const options = [];

    return platesCache.map((plate) => (
      <option value={plate._id}>{plate.plateName}</option>
    ));
  };

  return (
    <div className="top-bar">
      {/* <div className="dropdown-container">
        <label htmlFor="dropdown">Showing plate:</label>
        <select id="dropdown" value={selectedOption} onChange={handleDropdownChange}>
        
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          <option value="Option 3">Option 3</option>
        </select>
      </div>
      <button onClick={handleButtonClick}>Button 1</button>
      <button onClick={handleButtonClick}>Button 2</button> */}

      <label htmlFor="logout">{username}</label>
      <button id="logout" onClick={logout}>LOGOUT</button>
    </div>
  )
};

export default TopBar;