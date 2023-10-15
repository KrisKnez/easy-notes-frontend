import React, { useEffect, useRef } from "react";

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
import { MdClose } from "react-icons/md";
import {
  getUsersMeControllerMeQueryKey,
  useUsersMeControllerMe,
  useUsersMeControllerUpdateMe,
} from "@/api";
import ChangePasswordModal from "../change-password-modal";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosConfig } from "@/axios";
import { useQueryClient } from "@tanstack/react-query";

export const AccountFormFieldsSchema = z.object({
  name: z.string().min(1, "Required field"),
  bio: z.string(),
});

export type AccountFormFields = z.infer<typeof AccountFormFieldsSchema>;

export const useAccountForm = () =>
  useForm<AccountFormFields>({
    resolver: zodResolver(AccountFormFieldsSchema),
  });

export interface AccountModalProps {}

const AccountModal = NiceModal.create((props: AccountModalProps) => {
  const modal = useModal();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState, reset } = useAccountForm();

  const { data } = useUsersMeControllerMe({
    axios: axiosConfig,
  });

  // useEffect(() => {
  //   if (data)
  //     reset({
  //       name: data.data.name || "",
  //       bio: data.data.bio || "",
  //     });
  // }, [data, reset]);

  const usersMeUpdateMe = useUsersMeControllerUpdateMe({
    axios: axiosConfig,
  });

  return (
    <Dialog
      component="form"
      fullWidth
      {...muiDialog(modal)}
      onSubmit={handleSubmit((data) =>
        usersMeUpdateMe.mutateAsync(
          { data },
          {
            onSuccess(data) {
              queryClient.setQueryData(getUsersMeControllerMeQueryKey(), data);
            },
          }
        )
      )}
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
          >
            Change Password
          </Button>
        </Stack>
        <Button type="submit" variant="contained" disabled={!formState.isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AccountModal;
