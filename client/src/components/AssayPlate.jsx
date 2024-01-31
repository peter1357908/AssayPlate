import {
  Box,
  Paper,
  Typography,
  TextField,
  AppBar, Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CenterFocusStrong as CenterFocusStrongIcon,
} from "@mui/icons-material";
import Draggable from 'react-draggable'; 
import Well from "./Well";
import "./AssayPlate.css"

const rowLabelAlphabet = "ABCDEFGHIJKLMNOP";  // QRSTUVWXYZ

const AssayPlate = (props) => {
  const {
    currPlate,
    setCurrPlate,
    setIsModified,
    platePos,
    setPlatePos,
    currWellIndex,
    setCurrWellIndex,
  } = props;
  
  // ACTIONS ----------------------------------------------

  // Name Change ======================
  const handleNameChange = (e) => {
    setIsModified(true);
    setCurrPlate({
      ...currPlate,
      plateName: e.target.value
    });
  }

  // Reagent Change ===================


  // Antibody Change ==================

  // Concentration Change =============

  // RENDERING --------------------------------------------
  const renderPlate = () => {
    if (!currPlate) {
      return (
        <Typography>Create a plate to get started!</Typography>
      )
    }
    const { nRow, nCol, wells } = currPlate;
    const columnLabels = [<Box className="grid-cell-box" key="0" />];  // (0,0) is empty
    for (let col=1; col <= nCol; col++) {
      columnLabels.push(
        <Box className="grid-cell-box" key={col}>{col}</Box>
      );
    }
    const plate = [columnLabels];  // rows of wells

    let i = 0;
    for (let row=0; row < nRow; row++) {
      let rowContent = [<Box className="grid-cell-box" key="row-label">{rowLabelAlphabet.charAt(row)}</Box>];
      for (let col=0; col < nCol; col++) {
        rowContent.push(
          <Well
            well={wells[i]}
            isCurrWell={i === currWellIndex}
            i={i}
            setCurrWellIndex={setCurrWellIndex}
            key={i}
          />
        );
        i++;
      }
      plate.push(rowContent);
    }

    return (
      <Paper id="assay-plate" elevation={10} >
        {plate.map((row, rowIndex) => (
          <Box className="assay-plate-row" key={rowIndex}>
            {row.map((component, componentIdex) => (component))}
          </Box>
        ))}
      </Paper>
    );
  };

  const bottomBarStyle = {
    padding: "0.2em 0",
    top: "auto",
    bottom: 0,
    backgroundColor: "mintcream",
  };

  return (
    <>
    <Draggable
      position={platePos}
      onStop={(e, value)=>{setPlatePos({...value})}}
    >
      {renderPlate()}
    </Draggable>
    
    <AppBar position="fixed" style={bottomBarStyle}>
      <Toolbar>
        <TextField
          style={{ width: "20ch" }}
          disabled={!Boolean(currPlate)}
          value={currPlate ? currPlate.plateName : "(no plate selected)"}
          onChange={handleNameChange}
          inputProps={{ maxLength: "20" }}
          variant="outlined"
          size="small"
          autoComplete="off"
          label="Plate Name"
          error={currPlate && currPlate.plateName < 1}
          required
        />
      </Toolbar>
    </AppBar>
    </>
  );
};

export default AssayPlate;