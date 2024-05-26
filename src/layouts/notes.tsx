import {
  getMeNotesControllerFindAllUserNotesQueryKey,
  useMeNotesControllerCreateUserNote,
  useMeNotesControllerFindAllUserNotes,
  useMeNotesControllerRemoveUserNote,
  useMeNotesControllerUpdateUserNote,
} from "@/api";
import { axiosConfig } from "@/axios";
import FaCCuseHover from "@/components/facc-use-hover";
import NoteCard from "@/components/note-card";
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
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdAddComment, MdDelete, MdSearch } from "react-icons/md";
import Dashboard3Layout from "./dashboard3";
import Link from "next/link";
import ConfirmationModal from "@/modals/confirmation-modal";
import NiceModal from "@ebay/nice-modal-react";
import { useDebounce } from "@uidotdev/usehooks";

export interface NotesLayoutProps {
  children: React.ReactNode;
}

const NotesLayout = (props: NotesLayoutProps) => {
  const { children } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data } = useMeNotesControllerFindAllUserNotes(
    {},
    {
      axios: axiosConfig,
      query: {
        retry(failureCount, error) {
          toast.error(error.message || "Unknown Error");

          return true;
        },
      },
    }
  );

  // Mutations
  const createMeNote = useMeNotesControllerCreateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const removeMeNote = useMeNotesControllerRemoveUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const updateMeNotes = useMeNotesControllerUpdateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });

  const [searchNotesTerm, setSearchNotesTerm] = useState("");
  const searchNotesTermDebounce = useDebounce(searchNotesTerm, 750);

  // const { data: searchNotesResult, isLoading: searchNotesIsLoading } =
  //   useMeNotesControllerSearchUserNotes(
  //     {
  //       term: searchNotesTermDebounce,
  //     },
  //     {
  //       axios: axiosConfig,
  //       query: {
  //         // Do not query if empty string
  //         enabled: Boolean(searchNotesTermDebounce),
  //       },
  //     }
  //   );

  // const waitForSearch =
  //   Boolean(searchNotesTerm) &&
  //   (searchNotesTerm !== searchNotesTermDebounce || searchNotesIsLoading);

  return (
    <Dashboard3Layout>
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
                <Box component={Link} href="/dashboard/notes2" width="100%">
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    startIcon={<MdAddComment />}
                  >
                    Start New Note
                  </Button>
                </Box>
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
                  value={searchNotesTerm}
                  onChange={(e) => setSearchNotesTerm(e.target.value)}
                />
              </ListItem>

              {waitForSearch && "Loading..."}

              {(Boolean(searchNotesTerm)
                ? searchNotesResult?.data
                : data?.data
              )?.map((note) => (
                <FaCCuseHover key={note.id}>
                  {(ref, hovering) => (
                    <Link
                      href={`/dashboard/notes2/${note.id}`}
                      style={{ all: "unset" }}
                    >
                      <ListItem
                        ref={ref}
                        disablePadding
                        secondaryAction={
                          (hovering || isMobile) && (
                            <IconButton
                              // Stop Ripple from propagating to ListItemButton
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              onClick={() =>
                                NiceModal.show(ConfirmationModal, {
                                  title: "Delete Note",
                                  description:
                                    "Are you sure you want to delete this note?",
                                  icon: <MdDelete />,
                                  iconColor: "#e74c3c",
                                  actionLabel: "Delete",
                                  actionColor: "error",
                                  actionOnClick: () => console.log("test"),
                                })
                                  .then(() => {
                                    removeMeNote
                                      .mutateAsync({
                                        id: note.id.toString(),
                                      })
                                      .then(() =>
                                        toast.success(
                                          "Successfully removed note"
                                        )
                                      )
                                      .catch(() =>
                                        toast.error("Error removing note")
                                      );
                                  })
                                  .catch((err) => console.log(err))
                              }
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
                    </Link>
                  )}
                </FaCCuseHover>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8} lg={9.5}>
          {/* <NoteCard
            onSave={(data) =>
              createMeNote
                .mutateAsync({
                  data,
                })
                .then(() => toast.success("Successfully created note"))
                .catch(() => toast.error("Error creating note"))
            }
          /> */}
          {children}
        </Grid>
      </Grid>
    </Dashboard3Layout>
  );
};

export default NotesLayout;
