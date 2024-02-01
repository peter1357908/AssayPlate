import { Route, Routes } from "react-router-dom";
import { Login, Signup } from "./pages";
import Home from "./pages/Home";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, removeCookie] = useCookies(["token"]);

  return (
    <Routes>
      <Route path="/" exact element={<Home cookies={cookies} removeCookie={removeCookie} />} />
      <Route path="/login" element={<Login cookies={cookies} />} />
      <Route path="/signup" element={<Signup cookies={cookies} />} />
    </Routes>
  );
}

export default App;