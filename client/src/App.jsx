import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  return (
    <Routes>
      <Route path="/" exact element={<Home cookies={cookies} removeCookie={removeCookie} />} />
      <Route path="/login" element={<Login cookies={cookies} setCookie={setCookie} />} />
      <Route path="/signup" element={<Signup cookies={cookies} setCookie={setCookie} />} />
    </Routes>
  );
}

export default App;