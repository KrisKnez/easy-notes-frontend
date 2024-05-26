import {
  getMeNotesControllerFindAllUserNotesQueryKey,
  useMeNotesControllerCreateUserNote,
} from "@/api";
import { axiosConfig } from "@/axios";
import NoteCard from "@/components/note-card2";
import NotesLayout from "@/layouts/notes";
import { NextPageWithLayout } from "@/pages/_app";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";

type Props = {};

const NotesPage: NextPageWithLayout = (props: Props) => {
  // Router
  const router = useRouter();

  // Query Client
  const queryClient = useQueryClient();

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

  return (
    <NoteCard
      onSave={(data) =>
        createMeNote
          .mutateAsync({
            data,
          })
          .then((result) => {
            toast.success("Successfully created note");
            router.push(`/dashboard/notes2/${result.data.id}`);
          })
          .catch(() => toast.error("Error creating note"))
      }
    />
  );
};

NotesPage.getLayout = (page) => {
  return <NotesLayout>{page}</NotesLayout>;
};

NotesPage.authn = {
  mustBe: "loggedIn",
};

export default NotesPage;
