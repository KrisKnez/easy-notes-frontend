import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoginMutation from "@/hooks/useLoginMutation";
import toast from "react-hot-toast";

import getErrorMessage from "@/utils/axios-error-handling/get-error-message";
import getFieldErrorMessage from "@/utils/axios-error-handling/get-field-error-message";

export const LoginFormFieldsSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email("Email is not valid"),
  password: z.string().min(1, { message: "Please enter your password" }),
});

export type LoginFormFields = z.infer<typeof LoginFormFieldsSchema>;

export const defaultLoginFormFields: LoginFormFields = {
  email: "",
  password: "",
};

export interface LoginFormProps extends Omit<BoxProps, "children"> {}

const LoginForm = (props: LoginFormProps) => {
  const { control, handleSubmit } = useForm<LoginFormFields>({
    defaultValues: defaultLoginFormFields,
    resolver: zodResolver(LoginFormFieldsSchema),
  });

  const loginMutation = useLoginMutation();

  return (
    <Box
      {...props}
      component="form"
      onSubmit={handleSubmit((data) =>
        loginMutation
          .mutateAsync({
            data,
          })
          .catch((e) => {
            const errorMessage = getErrorMessage(e);
            if (!Array.isArray(errorMessage)) toast.error(errorMessage);
          })
      )}
    >
      <Stack spacing="25px">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              type="text"
              label="Email Address"
              fullWidth
              autoComplete="email"
              autoFocus
              {...field}
              error={
                !!(error || getFieldErrorMessage("email", loginMutation.error))
              }
              helperText={
                error?.message ||
                getFieldErrorMessage("email", loginMutation.error)
              }
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              type="password"
              label="Password"
              fullWidth
              autoComplete="password"
              autoFocus
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? (
            <CircularProgress size="1.75em" />
          ) : (
            "Login"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
