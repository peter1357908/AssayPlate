import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Signup = ({ cookies }) => {
  const navigate = useNavigate();
  console.log("before useEffect Signup");
  console.log(cookies)
  console.log(document.cookie);
  // if a token already exists, just navigate to the home page.
  useEffect(() => {
    console.log("in useEffect Signup");
    console.log(cookies)
    console.log(document.cookie);
    if (cookies.token && cookies.token != "undefined") {
      navigate("/");
    }
  }, []);

  console.log("after useEffect Signup");
  console.log(cookies)
  console.log(document.cookie);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/signup`,
        { username, password },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        toast.success(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const paperStyle = { padding: 20, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 };
  const avatarStyle = { backgroundColor: "#1bbd7e", width: 50, height: 50 };
  const buttonstyle = { margin: '20px 0' };

  return (
    <Paper elevation={10} style={paperStyle}>
      <Avatar style={avatarStyle}><PersonAddIcon /></Avatar>
      <TextField value={username} onChange={handleUsernameChange} inputProps={{maxLength: "20"}} label="Username" placeholder="Enter username" variant="outlined" autoComplete="username" margin="normal" fullWidth required/>
      <TextField value={password} onChange={handlePasswordChange} inputProps={{maxLength: "20"}} label="Password" placeholder="Enter password" type="password" variant="outlined" autoComplete="new-password" margin="dense" fullWidth required/>
      <Button type="submit" color="primary" variant="contained" onClick={handleSubmit} style={buttonstyle} fullWidth>Sign up</Button>
      <Typography>Already have an account? <Link underline="hover" component={RouterLink} to="/login">Log in</Link></Typography>
      <Divider variant="middle" flexItem />
      <Typography variant="caption">Fully stacked by <Link underline="hover" href="https://peterish.com/" target="_blank">Peter Gao</Link></Typography>
    </Paper>
  );
};

export default Signup;