import NiceModal, { muiDialog, useModal } from "@ebay/nice-modal-react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { MdClose } from "react-icons/md";

// TODO: Finish Modal

export interface ChangePasswordModalProps {}

const ChangePasswordModal = NiceModal.create(
  (props: ChangePasswordModalProps) => {
    const modal = useModal();

    return (
      <Dialog {...muiDialog(modal)} maxWidth="xs">
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Change Password</Box>
            <IconButton onClick={modal.hide}>
              <MdClose />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Grid container spacing={1} py={1}>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Current Password"
                  placeholder="Your Current password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="New Password"
                  placeholder="Your New Password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Repeat Password"
                  placeholder="Repeat New Password"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ChangePasswordModal;
