import React, { useEffect, useRef, useState } from "react";

import NiceModal, { muiDialog, useModal } from "@ebay/nice-modal-react";
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
import { MdClose, MdPassword, MdSaveAlt } from "react-icons/md";
import {
  getMeControllerMeQueryKey,
  useMeControllerMe,
  useMeControllerUpdateMe,
} from "@/api";
import ChangePasswordModal from "../change-password-modal";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosConfig } from "@/axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const AccountFormFieldsSchema = z.object({
  name: z.string().min(1, "Required field"),
  bio: z.string(),
});

export type AccountFormFields = z.infer<typeof AccountFormFieldsSchema>;

export interface AccountModalProps {}

const AccountModal = NiceModal.create((props: AccountModalProps) => {
  const modal = useModal();
  const { onExited, ...muiDialogProps } = muiDialog(modal);

  const queryClient = useQueryClient();

  const { data } = useMeControllerMe({
    axios: axiosConfig,
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { control, handleSubmit, formState, reset } =
    useForm<AccountFormFields>({
      resolver: zodResolver(AccountFormFieldsSchema),
      defaultValues: {
        name: "",
        bio: "",
      },
    });

  // set defaultValues after query is complete
  const [isReset, setIsReset] = useState(false);
  useEffect(() => {
    if (!isReset && data) {
      reset({
        name: data.data.name || "",
        bio: data.data.bio || "",
      });
      setIsReset(true);
    }
  }, [data, isReset, reset]);

  const usersMeUpdateMe = useMeControllerUpdateMe({
    axios: axiosConfig,
    mutation: {
      onSuccess(data) {
        queryClient.setQueryData(getMeControllerMeQueryKey(), data);

        reset({
          name: data.data.name || "",
          bio: data.data.bio || "",
        });

        toast.success("Updated Data");
      },
      // Simulate delay
      onMutate: () => new Promise((resolve) => setTimeout(resolve, 750)),
    },
  });

  return (
    <Dialog
      component="form"
      fullWidth
      {...muiDialogProps}
      // Restart state of modal after close
      onTransitionExited={modal.remove}
      onSubmit={handleSubmit((data) => {
        usersMeUpdateMe.mutateAsync({ data });
      })}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>User Account</Box>
          <IconButton onClick={modal.hide}>
            <MdClose />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box py={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    type="text"
                    label="Name"
                    placeholder="Your Name"
                    fullWidth
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                placeholder="Your Email"
                fullWidth
                disabled
                value={data?.data.email || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bio"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    type="text"
                    label="Bio"
                    placeholder="Your Bio"
                    fullWidth
                    rows={2}
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {usersMeUpdateMe.error?.message}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" flexGrow={1}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => NiceModal.show(ChangePasswordModal)}
            endIcon={<MdPassword />}
          >
            Change Password
          </Button>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={
            !formState.isValid ||
            !formState.isDirty ||
            usersMeUpdateMe.isLoading
          }
          endIcon={
            (usersMeUpdateMe.isLoading && (
              <CircularProgress size="1em" color="inherit" />
            )) || <MdSaveAlt />
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AccountModal;
