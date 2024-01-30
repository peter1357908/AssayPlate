import {
  Box,
  Typography,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const rowLabels = "ABCDEFGHIJKLMNOP";  // QRSTUVWXYZ

const AssayPlate = (props) => {
  const { currPlate, setCurrPlate, isModified, setIsModified } = props;
  

  // render the current plate
  // const renderCells = () => {
  //   const cells = [];
  //   for (let row = 0; row < numRows; row++) {
  //     for (let col = 0; col < numCols; col++) {
  //       cells.push(
  //         <circle
  //           key={`${row}-${col}`}
  //           cx={col * 30}
  //           cy={row * 30}
  //           r={10}
  //           fill={colors[row][col]}
  //           onClick={() => handleCellClick(row, col)}
  //           style={{ cursor: 'pointer' }}
  //         />
  //       );
  //     }
  //   }
  //   return cells;
  // };
  
  // ACTIONS ----------------------------------------------
  const handleNameChange = (e) => {
    setIsModified(true);
    setCurrPlate({
      ...currPlate,
      plateName: e.target.value
    });
  }

  // STYLING ----------------------------------------------
  const boxStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  };

  return (
    <Box style={boxStyle}>
      <TextField
        style={{ width: "20ch" }}
        disabled={!Boolean(currPlate)}
        value={currPlate ? currPlate.plateName : "(no plate selected)"}
        onChange={handleNameChange}
        inputProps={{ maxLength: "20" }}
        variant="outlined"
        size="small"
        autoComplete="off"
      />
    </Box>
  );
};

export default AssayPlate;