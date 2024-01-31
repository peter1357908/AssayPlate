import { useState } from "react";
import TopBar from "../components/TopBar";
import AssayPlate from "../components/AssayPlate";
import Box from "@mui/material/Box";

const Home = (cookieStuff) => {
  const [currPlate, setCurrPlate] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [platePos, setPlatePos] = useState({ x: 0, y: 0 });
  const [currWellIndex, setCurrWellIndex] = useState(0);

  return (
    <Box style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      }}>
      <TopBar
        {...cookieStuff}
        currPlate={currPlate}
        setCurrPlate={setCurrPlate}
        isModified={isModified}
        setIsModified={setIsModified}
        setPlatePos={setPlatePos}
        setCurrWellIndex={setCurrWellIndex}
      />
      <AssayPlate
        currPlate={currPlate}
        setCurrPlate={setCurrPlate}
        setIsModified={setIsModified}
        platePos={platePos}
        setPlatePos={setPlatePos}
        currWellIndex={currWellIndex}
        setCurrWellIndex={setCurrWellIndex}
      />
    </Box>
  );
};

export default Home;