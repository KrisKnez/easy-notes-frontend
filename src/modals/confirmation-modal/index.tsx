import { useUsersMeControllerChangePassword } from "@/api";
import { axiosConfig } from "@/axios";
import getAllFieldErrorMessages from "@/utils/axios-error-handling/get-all-field-error-messages";
import NiceModal, { muiDialog, useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdClose, MdSaveAlt } from "react-icons/md";
import { isValid, z } from "zod";

export interface ConfirmationModalProps {
  title: string;
  description: string;

  icon: React.ReactNode;
  iconColor: BoxProps["color"];

  actionLabel: string;
  actionColor: ButtonProps["color"];
  actionOnClick: () => void;
}

const ConfirmationModal = NiceModal.create((props: ConfirmationModalProps) => {
  const {
    title,
    description,

    icon,
    iconColor,

    actionLabel,
    actionColor,
  } = props;

  const modal = useModal();
  const { onExited, ...muiDialogProps } = muiDialog(modal);

  return (
    <Dialog
      {...muiDialogProps}
      maxWidth="xs"
      onTransitionExited={modal.remove}
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <IconButton onClick={modal.hide}>
            <MdClose />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center">
          <Box fontSize={64} color={iconColor}>
            {icon}
          </Box>
          <Typography variant="h5" textAlign="center">
            {title}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              maxWidth: {
                xs: "200px",
                sm: "400px",
              },
            }}
          >
            {description}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          flexGrow={1}
          alignItems="center"
          justifyContent="flex-start"
          direction="row"
        >
          <Button onClick={() => modal.hide()}>Cancel</Button>
        </Stack>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            modal.resolve();
            modal.hide();
          }}
        >
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ConfirmationModal;
