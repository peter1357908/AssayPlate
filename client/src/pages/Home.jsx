import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [usernameState, setUsername] = useState("");
  const platesURL = `${import.meta.env.VITE_SERVER_URL}/plates`;
  useEffect(() => {
    // this convoluted definition is all because we want to await the axios.post...
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const plates = await axios.get(
        platesURL,
        { withCredentials: true }
      );
      const { status, username } = data;
      setUsername(username);
      return status
        ? toast(`Hello, ${username}!`, { position: "top-right" })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };
  return (
    <>
      <div className="home_page">
        <h4>
          Welcome, <span>{usernameState}</span>!
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
    </>
  );
};

export default Home;