import { Route, Routes } from "react-router-dom";
import { Login, Signup } from "./pages";
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import { useCookies } from "react-cookie";

function App() {
  const [cookies, removeCookie] = useCookies(["token"]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home cookies={cookies} removeCookie={removeCookie} />} />
        <Route path="/login" element={<Login cookies={cookies} />} />
        <Route path="/signup" element={<Signup cookies={cookies} />} />
      </Routes>
      <ToastContainer theme="dark" autoClose={2000} position="bottom-center"/>
    </div>
  );
}

export default App;