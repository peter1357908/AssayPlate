import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Paper, Avatar, TextField, Button, Typography, Link } from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";

const Login = () => {
  const navigate = useNavigate();
  
  // if a token already exists, just navigate to the home page.
  const [cookies] = useCookies([]);
  useEffect(() => {
    if (cookies.token && cookies.token != "undefined") {
      navigate("/");
    }
  }, []);
  
  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });
  const { username, password } = inputValue;
  const handleUsernameChange = (e) => {
    setInputValue({
      username: e.target.value,
      password,
    });
  };
  const handlePasswordChange = (e) => {
    setInputValue({
      username,
      password: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        toast.success(message, { position: "bottom-center" });
        navigate("/");
      } else {
        toast.error(message, { position: "bottom-center" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const paperStyle = { padding: 20, width: 300, display: "flex", flexDirection: "column", alignItems: "center" };
  const avatarStyle = { backgroundColor: "#1bbd7e", width: 50, height: 50 };
  const buttonstyle = { margin: '20px 0' };

  return (
    <Paper elevation={10} style={paperStyle}>
      <Avatar style={avatarStyle}><LockPersonIcon /></Avatar>
      <TextField value={username} onChange={handleUsernameChange} inputProps={{maxLength: "20"}} label="Username" placeholder="Enter username" variant="outlined" autoComplete="username" margin="normal" fullWidth required/>
      <TextField value={password} onChange={handlePasswordChange} inputProps={{maxLength: "20"}} label="Password" placeholder="Enter password" type="password" variant="outlined" autoComplete="current-password" margin="dense" fullWidth required/>
      <Button type="submit" color="primary" variant="contained" onClick={handleSubmit} style={buttonstyle} fullWidth>Log in</Button>
      <Typography>No account yet? <Link component={RouterLink} to="/signup">Sign up</Link></Typography>
    </Paper>
  );
};

export default Login;