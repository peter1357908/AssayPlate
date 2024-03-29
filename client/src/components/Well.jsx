import {
  Box, IconButton, Badge
} from '@mui/material'
import { 
  Circle as CircleIcon,
  CircleOutlined as CircleOutlinedIcon,
  Biotech as BiotechIcon,
} from "@mui/icons-material";

const Well = (props) => {
  const { well, isCurrWell, i, setCurrWellIndex } = props;

  return (
    <Box className="grid-cell-box">
      <Badge color="error" badgeContent="!" overlap="circular" invisible={!well.concentrationIsInvalid && !well.reagentIsInvalid}>
        <IconButton className="well-button" onClick={()=>{setCurrWellIndex(i);}}>
          {isCurrWell && <CircleOutlinedIcon className="curr-well-highlight" />}
          {well.reagent ? <CircleIcon className="well-icon" /> : <CircleOutlinedIcon className="well-icon" />}
          {well.antibody && <BiotechIcon className="antibody-icon" />}
        </IconButton>
      </Badge>
    </Box>
  );
}

export default Well