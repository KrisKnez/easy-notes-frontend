import React from "react";
import { NextPageWithLayout } from "../_app";
import DashboardLayout from "@/layouts/dashboard";
import Dashboard2Layout from "@/layouts/dashboard2";
import { Grid, Stack } from "@mui/material";
import NoteCard from "@/components/note-card";
import { useQueryClient } from "@tanstack/react-query";
import {
  getUsersNotesControllerFindAllUserNotesQueryKey,
  useUsersNotesControllerCreateUserNote,
  useUsersNotesControllerFindAllUserNotes,
  useUsersNotesControllerRemoveUserNote,
  useUsersNotesControllerUpdateUserNote,
} from "@/api";
import { axiosConfig } from "@/axios";
import { toast } from "react-hot-toast";

const NotesPage: NextPageWithLayout = () => {
  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data } = useUsersNotesControllerFindAllUserNotes({
    axios: axiosConfig,
    query: {
      retry(failureCount, error) {
        toast.error(error.message || "Unknown Error");

        return true;
      },
    },
  });

  // Mutations
  const createUserNote = useUsersNotesControllerCreateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const removeUserNote = useUsersNotesControllerRemoveUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });
  const updateUserNote = useUsersNotesControllerUpdateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getUsersNotesControllerFindAllUserNotesQueryKey()
        );
      },
    },
  });

  return (
    <Stack width="100%" alignItems="center" spacing={4}>
      <NoteCard
        onSave={(data) =>
          createUserNote
            .mutateAsync({
              data,
            })
            .then(() => toast.success("Successfully created note"))
            .catch(() => toast.error("Error creating note"))
        }
      />
      <Grid container spacing={4}>
        {data?.data.map((note) => (
          <Grid item key={note.id} xs={12} md={6} lg={4}>
            <NoteCard
              sx={{
                width: "100%",
                height: "100%",
              }}
              data={{ title: note.title, content: note.content }}
              onSave={(data) =>
                updateUserNote
                  .mutateAsync({
                    id: note.id.toString(),
                    data: {
                      title: data.title,
                      content: data.content,
                    },
                  })
                  .then(() => toast.success("Successfully updated note"))
                  .catch(() => toast.error("Error updating note"))
              }
              onDelete={() =>
                removeUserNote
                  .mutateAsync({
                    id: note.id.toString(),
                  })
                  .then(() => toast.success("Successfully deleted note"))
                  .catch(() => toast.error("Error deleting note"))
              }
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

NotesPage.getLayout = (page) => {
  // return <DashboardLayout title="Notes">{page}</DashboardLayout>;
  return <Dashboard2Layout>{page}</Dashboard2Layout>;
};

NotesPage.authn = {
  mustBe: "loggedIn",
};

export default NotesPage;
