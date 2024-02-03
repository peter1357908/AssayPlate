import {
  Box,
  Paper,
  Typography,
  TextField,
  AppBar, Toolbar,
  Tooltip
} from "@mui/material";
import Draggable from 'react-draggable'; 
import Well from "./Well";
import "./AssayPlate.css"

const rowLabelAlphabet = "ABCDEFGHIJKLMNOP";  // QRSTUVWXYZ

const AssayPlate = (props) => {
  const {
    currPlateName,
    setCurrPlateName,
    currWellsInfo,
    setCurrWellsInfo,
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
    setCurrPlateName(e.target.value);
  }

  // Reagent Change ===================
  const handleReagentChange = (e) => {
    setIsModified(true);
    const newWellsInfo = {...currWellsInfo};
    const reagent = e.target.value;
    const newWell = newWellsInfo.wells[currWellIndex];
    if (reagent.length > 0 && !reagent.match(/^R\d+$/)) {
      newWell.reagentIsInvalid = true;
    } else {
      newWell.reagentIsInvalid = false;
    }
    newWell.reagent = reagent;
    setCurrWellsInfo(newWellsInfo);
  }

  // Antibody Change ==================
  const handleAntibodyChange = (e) => {
    setIsModified(true);
    const newWellsInfo = {...currWellsInfo};
    const antibody = e.target.value;
    const newWell = newWellsInfo.wells[currWellIndex];
    if (!antibody && newWell.concentration != 0) {
      newWell.concentrationIsInvalid = true;
    } else {
      newWell.concentrationIsInvalid = false;
    }
    newWell.antibody = antibody;
    setCurrWellsInfo(newWellsInfo);
  }

  // Concentration Change =============
  // NOTE: concentration is stored as a string when modified, to allow
  // temporary invalid values. Before saving to cloud, the strings are
  // all converted to floats (if they are all valid).
  const handleConcentrationChange = (e) => {
    setIsModified(true);
    const newConcentrationString = e.target.value;

    const newWellsInfo = {...currWellsInfo};
    const newWell = newWellsInfo.wells[currWellIndex];
    if (!newConcentrationString.match(/^\d*\.?\d+$/) || !newWell.antibody) {
      newWell.concentrationIsInvalid = true;
    } else {
      newWell.concentrationIsInvalid = false;
    }
    newWell.concentration = newConcentrationString;
    setCurrWellsInfo(newWellsInfo);
  }

  // RENDERING --------------------------------------------
  const renderPlate = () => {
    if (!currWellsInfo) {
      return (
        <Typography>Create a plate to get started!</Typography>
      )
    }
    const { nRow, nCol, wells } = currWellsInfo;
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
      <Draggable
        position={platePos}
        onStop={(e, value)=>{setPlatePos({...value})}}
        cancel=".well-button"
      >
        <Paper id="assay-plate" elevation={10} >
          {plate.map((row, rowIndex) => (
            <Box className="assay-plate-row" key={rowIndex}>
              {row}
            </Box>
          ))}
        </Paper>
      </Draggable>
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
    {renderPlate()}
    <AppBar position="fixed" style={bottomBarStyle}>
      <Toolbar>
        <TextField
          style={{ width: "21ch" }}
          disabled={!Boolean(currPlateName)}
          value={currPlateName ? currPlateName : "(no plate selected)"}
          onChange={handleNameChange}
          inputProps={{ maxLength: "20" }}
          variant="outlined"
          size="small"
          autoComplete="off"
          label="Plate Name"
          error={currWellsInfo && currPlateName.length < 1}
          required
        />

        <Box style={{ flexGrow: 1 }} />

        <Tooltip arrow title={"\"R\" followed by numbers"}>
        <TextField
          style={{ width: "21ch" }}
          disabled={!Boolean(currWellsInfo)}
          value={currWellsInfo ? currWellsInfo.wells[currWellIndex].reagent : "(no well selected)"}
          onChange={handleReagentChange}
          inputProps={{ maxLength: "200" }}
          variant="outlined"
          size="small"
          autoComplete="off"
          label="Reagent"
          error={currWellsInfo && currWellsInfo.wells[currWellIndex].reagentIsInvalid}
        />
        </Tooltip>

        <Tooltip arrow title="any string">
        <TextField
          style={{ width: "21ch" }}
          disabled={!Boolean(currWellsInfo)}
          value={currWellsInfo ? currWellsInfo.wells[currWellIndex].antibody : "(no well selected)"}
          onChange={handleAntibodyChange}
          inputProps={{ maxLength: "200" }}
          variant="outlined"
          size="small"
          autoComplete="off"
          label="Antibody"
        />
        </Tooltip>

        <Tooltip arrow title="can be positive if antibody is present; otherwise 0">
        <TextField
          style={{ width: "21ch" }}
          disabled={!Boolean(currWellsInfo)}
          value={currWellsInfo ? currWellsInfo.wells[currWellIndex].concentration : "(no well selected)"}
          onChange={handleConcentrationChange}
          inputProps={{ maxLength: "20" }}
          variant="outlined"
          size="small"
          autoComplete="off"
          label="Concentration"
          error={currWellsInfo && currWellsInfo.wells[currWellIndex].concentrationIsInvalid}
        />
        </Tooltip>
      </Toolbar>
    </AppBar>
    </>
  );
};

export default AssayPlate;