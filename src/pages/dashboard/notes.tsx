import React from "react";
import { NextPageWithLayout } from "../_app";
import Dashboard2Layout from "@/layouts/dashboard2";
import { Grid, Stack } from "@mui/material";
import NoteCard from "@/components/note-card";
import { useQueryClient } from "@tanstack/react-query";
import {
  getMeNotesControllerFindAllUserNotesQueryKey,
  useMeNotesControllerCreateUserNote,
  useMeNotesControllerFindAllUserNotes,
  useMeNotesControllerRemoveUserNote,
  useMeNotesControllerUpdateUserNote,
} from "@/api";
import { axiosConfig } from "@/axios";
import { toast } from "react-hot-toast";

const NotesPage: NextPageWithLayout = () => {
  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data } = useMeNotesControllerFindAllUserNotes(
    {
      orderBy: ["updatedAt:desc"],
    },
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

  return (
    <Stack width="100%" alignItems="center" spacing={4}>
      <NoteCard
        onSave={(data) =>
          createMeNote
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
                updateMeNotes
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
                removeMeNote
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
  return <Dashboard2Layout>{page}</Dashboard2Layout>;
};

NotesPage.authn = {
  mustBe: "loggedIn",
};

export default NotesPage;
