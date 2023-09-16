import { Box, CircularProgress, CssBaseline, Stack } from "@mui/material";
import React from "react";

const LoadingLayout = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Stack>
  );
};

export default LoadingLayout;
