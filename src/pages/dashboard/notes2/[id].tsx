import {
  getMeNotesControllerFindAllUserNotesQueryKey,
  getMeNotesControllerFindOneUserNoteQueryKey,
  useMeNotesControllerFindOneUserNote,
  useMeNotesControllerUpdateUserNote,
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

const NotesByIdPage: NextPageWithLayout = (props: Props) => {
  // Router
  const router = useRouter();

  // Query Client
  const queryClient = useQueryClient();

  const updateMeNote = useMeNotesControllerUpdateUserNote({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeNotesControllerFindOneUserNoteQueryKey(
            router.query.id as string
          )
        );
      },
    },
  });

  const { data } = useMeNotesControllerFindOneUserNote(
    router.query.id as string,
    {
      axios: axiosConfig,
    }
  );

  if (!data) {
    return null;
  }

  return (
    <NoteCard
      key={data?.data.id}
      data={{
        title: data?.data.title || "",
        content: data?.data.content || "",
      }}
      onSave={(data) =>
        updateMeNote
          .mutateAsync({
            id: router.query.id as string,
            data,
          })
          .then((result) => {
            toast.success("Successfully updated note");
          })
          .catch(() => toast.error("Error creating note"))
      }
    />
  );
};

NotesByIdPage.getLayout = (page) => {
  return <NotesLayout>{page}</NotesLayout>;
};

NotesByIdPage.authn = {
  mustBe: "loggedIn",
};

export default NotesByIdPage;
