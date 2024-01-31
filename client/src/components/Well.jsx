import {
  Box, IconButton
} from '@mui/material'
import { 
  Circle as CircleIcon,
  CircleOutlined as CircleOutlinedIcon,
  Biotech as BiotechIcon,
} from "@mui/icons-material";

const Well = (props) => {
  const { well, setCurrWell } = props;

  return (
    <Box className="grid-cell-box">
      <IconButton className="well-button">
        {well.reagent ? <CircleIcon className="well-icon" /> : <CircleOutlinedIcon className="well-icon" />}
        {well.antibody && <BiotechIcon className="antibody-icon" />}
      </IconButton>
    </Box>
  )
}

export default Well