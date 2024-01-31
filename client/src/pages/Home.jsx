import { useState } from "react";
import TopBar from "../components/TopBar";
import AssayPlate from "../components/AssayPlate";
import Box from "@mui/material/Box";

const Home = (cookieStuff) => {
  const [currPlateName, setCurrPlateName] = useState("");
  const [currWellsInfo, setCurrWellsInfo] = useState(null);
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
        currPlateName={currPlateName}
        setCurrPlateName={setCurrPlateName}
        currWellsInfo={currWellsInfo}
        setCurrWellsInfo={setCurrWellsInfo}
        isModified={isModified}
        setIsModified={setIsModified}
        setPlatePos={setPlatePos}
        setCurrWellIndex={setCurrWellIndex}
      />
      <AssayPlate
        currPlateName={currPlateName}
        setCurrPlateName={setCurrPlateName}
        currWellsInfo={currWellsInfo}
        setCurrWellsInfo={setCurrWellsInfo}
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