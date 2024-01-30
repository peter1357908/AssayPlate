import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material'

// a reusable dialog for confirming whether the user wants to discard
// any changes and proceed with their chosen action
const ConfirmDialog = (props) => {
  const { candidate, setCandidate, onConfirm, actionTitle, actionDescription } = props;
  return (
    <Dialog
      open={Boolean(candidate)}
      onClose={() => setCandidate(null)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{actionTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {actionDescription}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCandidate(null)}>Cancel</Button>
        <Button onClick={() => onConfirm(candidate)}>Proceed</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog