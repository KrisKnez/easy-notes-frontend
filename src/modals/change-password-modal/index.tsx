import { useMeControllerChangePassword } from "@/api";
import { axiosConfig } from "@/axios";
import getAllFieldErrorMessages from "@/utils/axios-error-handling/get-all-field-error-messages";
import NiceModal, { muiDialog, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdClose, MdSaveAlt } from "react-icons/md";
import { isValid, z } from "zod";

export const ChangePasswordFieldsSchema = z.object({
  currentPassword: z.string().min(1, "Required field"),
  newPassword: z.string().min(1, "Required field"),
  repeatNewPassword: z.string().min(1, "Required field"),
});

export type ChangePasswordFields = z.infer<typeof ChangePasswordFieldsSchema>;

export interface ChangePasswordModalProps {}

const ChangePasswordModal = NiceModal.create(
  (props: ChangePasswordModalProps) => {
    const modal = useModal();
    const { onExited, ...muiDialogProps } = muiDialog(modal);

    const { control, handleSubmit, setError } = useForm<ChangePasswordFields>({
      resolver: zodResolver(ChangePasswordFieldsSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        repeatNewPassword: "",
      },
    });

    const usersMeChangePassword = useMeControllerChangePassword({
      axios: axiosConfig,
      mutation: {
        onSuccess() {
          modal.hide();
          toast.success("Successfully changed password");
        },
        onError(error, variables, context) {
          getAllFieldErrorMessages(error)?.forEach((fieldMessage) =>
            setError(fieldMessage.field as any, {
              message: fieldMessage.message,
            })
          );
        },
      },
    });

    return (
      <Dialog
        {...muiDialogProps}
        maxWidth="xs"
        component="form"
        onTransitionExited={modal.remove}
        onSubmit={handleSubmit((data) => {
          usersMeChangePassword.mutate({ data });
        })}
      >
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
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="password"
                      label="Current Password"
                      placeholder="Your Current password"
                      fullWidth
                      // RHF
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="password"
                      label="New Password"
                      placeholder="Your New Password"
                      fullWidth
                      // RHF
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="repeatNewPassword"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="password"
                      label="Repeat Password"
                      placeholder="Repeat New Password"
                      fullWidth
                      // RHF
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || usersMeChangePassword.isLoading}
            endIcon={
              (usersMeChangePassword.isLoading && (
                <CircularProgress size="1em" color="inherit" />
              )) || <MdSaveAlt />
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ChangePasswordModal;
