import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material'

// a reusable dialog for confirming whether the user wants to discard
// any changes and proceed with their chosen action
const ConfirmDialog = (props) => {
  const { candidate, setCandidate, onConfirm, actionDescription } = props;
  return (
    <Dialog
      open={Boolean(candidate)}
      onClose={() => setCandidate(null)}
    >
      <DialogTitle>Discard changes?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Do you wish to discard the changes and proceed with {actionDescription}?
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