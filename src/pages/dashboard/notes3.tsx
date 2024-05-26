import React from "react";
import { NextPageWithLayout } from "../_app";
import { useHover } from "@uidotdev/usehooks";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NoteCard from "@/components/note-card2";
import { useQueryClient } from "@tanstack/react-query";
import {
  getUsersMeNotesControllerFindAllUserNotesQueryKey,
  useUsersMeNotesControllerCreateUserNote,
  useUsersMeNotesControllerFindAllUserNotes,
  useUsersMeNotesControllerRemoveUserNote,
  useUsersMeNotesControllerUpdateUserNote,
} from "@/api";
import { axiosConfig } from "@/axios";
import { toast } from "react-hot-toast";
import Dashboard3Layout from "@/layouts/dashboard3";
import FaCCuseHover from "@/components/facc-use-hover";
import { MdAddComment, MdDelete, MdSearch } from "react-icons/md";

const NotesPage: NextPageWithLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data } = useUsersMeNotesControllerFindAllUserNotes({
    axios: axiosConfig,
    query: {
      retry(failureCount, error) {
        toast.error(error.message || "Unknown Error");

        return true;
      },
    },
  });

  // Mutations
  const createUsersMeNote = useUsersMeNotesControllerCreateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const removeUsersMeNote = useUsersMeNotesControllerRemoveUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const updateUsersMeNotes = useUsersMeNotesControllerUpdateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });

  return (
    <Grid container flexGrow={1}>
      <Grid item xs={12} sm={4} lg={2.5}>
        <Paper
          sx={{
            height: "100%",
          }}
        >
          <List>
            {/* New Note Button */}
            <ListItem>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                startIcon={<MdAddComment />}
              >
                Start New Note
              </Button>
            </ListItem>

            {/* Search Note Input */}
            <ListItem>
              <TextField
                fullWidth
                placeholder="Search notes"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>

            {data?.data.map((note) => (
              <FaCCuseHover key={note.id}>
                {(ref, hovering) => (
                  <ListItem
                    ref={ref}
                    disablePadding
                    secondaryAction={
                      (hovering || isMobile) && (
                        <IconButton
                          // size="small"
                          // Stop Ripple from propagating to ListItemButton
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MdDelete />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemButton>
                      <ListItemText primary={note.title} />
                    </ListItemButton>
                  </ListItem>
                )}
              </FaCCuseHover>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={8} lg={9.5}>
        <NoteCard
          onSave={(data) =>
            createUsersMeNote
              .mutateAsync({
                data,
              })
              .then(() => toast.success("Successfully created note"))
              .catch(() => toast.error("Error creating note"))
          }
        />
      </Grid>
    </Grid>
  );
};

NotesPage.getLayout = (page) => {
  return <Dashboard3Layout>{page}</Dashboard3Layout>;
};

NotesPage.authn = {
  mustBe: "loggedIn",
};

export default NotesPage;
