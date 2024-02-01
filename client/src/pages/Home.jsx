import { useState } from "react";
import TopBar from "../components/TopBar";
import AssayPlate from "../components/AssayPlate";
import Box from "@mui/material/Box";

const Home = () => {
  const [currPlateName, setCurrPlateName] = useState("");
  const [currWellsInfo, setCurrWellsInfo] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);
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
        currPlateName={currPlateName}
        setCurrPlateName={setCurrPlateName}
        currWellsInfo={currWellsInfo}
        setCurrWellsInfo={setCurrWellsInfo}
        selectedPlate={selectedPlate}
        setSelectedPlate={setSelectedPlate}
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
        selectedPlate={selectedPlate}
        isModified={isModified}
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