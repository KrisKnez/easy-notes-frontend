import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import React, {
  MutableRefObject,
  Ref,
  RefObject,
  useEffect,
  useRef,
} from "react";
import { Controller, UseFormReturn, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoginMutation from "@/hooks/useLoginMutation";
import toast from "react-hot-toast";

import getErrorMessage from "@/utils/axios-error-handling/get-error-message";
import getFieldErrorMessage from "@/utils/axios-error-handling/get-field-error-message";
import getAllFieldErrorMessages from "@/utils/axios-error-handling/get-all-field-error-messages";
import { MdCheck, MdLogin } from "react-icons/md";

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

export type LoginFormInstance = UseFormReturn<LoginFormFields, any, undefined>;

export interface LoginFormProps extends Omit<BoxProps, "children"> {
  formRef?: MutableRefObject<LoginFormInstance>;
}

const LoginForm = (props: LoginFormProps) => {
  const { formRef } = props;

  const form: LoginFormInstance = useForm<LoginFormFields>({
    defaultValues: defaultLoginFormFields,
    resolver: zodResolver(LoginFormFieldsSchema),
  });
  if (formRef) formRef.current = form;
  const { control, handleSubmit, setError } = form;

  const loginMutation = useLoginMutation();

  useEffect(() => {
    if (loginMutation.error) {
      getAllFieldErrorMessages(loginMutation.error)?.forEach((fieldMessage) =>
        setError(fieldMessage.field as any, { message: fieldMessage.message })
      );
    }
  }, [loginMutation.error, setError]);

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
              label="Email"
              placeholder="Your Email"
              fullWidth
              autoComplete="email"
              autoFocus
              {...field}
              error={!!error}
              helperText={error?.message}
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
              placeholder="Your Password"
              fullWidth
              autoComplete="password"
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
          endIcon={
            (loginMutation.isLoading && (
              <CircularProgress size="1em" color="inherit" />
            )) ||
            (loginMutation.isSuccess && <MdCheck />) || <MdLogin />
          }
        >
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
