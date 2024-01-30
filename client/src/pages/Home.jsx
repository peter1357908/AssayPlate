import { useState } from "react";
import TopBar from "../components/TopBar";
import AssayPlate from "../components/AssayPlate";
import Box from "@mui/material/Box";

const Home = (props) => {
  const [currPlate, setCurrPlate] = useState({});
  const [isModified, setIsModified] = useState(false);

  const sharedProps = {
    currPlate, setCurrPlate, isModified, setIsModified
  };

  return (
    <Box style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
      }}>
      <TopBar {...sharedProps} {...props} />
      <AssayPlate {...sharedProps} />
    </Box>
  );
};

export default Home;