import React from "react";
import { NextPageWithLayout } from "../_app";
import DashboardLayout from "@/layouts/dashboard";
import { Grid, Stack } from "@mui/material";
import ContactCard from "@/components/contact-card";
import { useQueryClient } from "@tanstack/react-query";
import { axiosConfig } from "@/axios";
import toast from "react-hot-toast";
import {
  getMeContactsControllerFindAllUserContactsQueryKey,
  useMeContactsControllerCreateUserContact,
  useMeContactsControllerFindAllUserContacts,
  useMeContactsControllerRemoveUserContact,
  useMeContactsControllerUpdateUserContact,
} from "@/api";
import Dashboard2Layout from "@/layouts/dashboard2";

const ContactsPage: NextPageWithLayout = () => {
  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data } = useMeContactsControllerFindAllUserContacts({
    axios: axiosConfig,
    query: {
      retry(failureCount, error) {
        toast.error(error.message || "Unknown Error");

        return true;
      },
    },
  });

  // Mutations
  const createUserContact = useMeContactsControllerCreateUserContact({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeContactsControllerFindAllUserContactsQueryKey()
        );
      },
    },
  });
  const removeUserContact = useMeContactsControllerRemoveUserContact({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeContactsControllerFindAllUserContactsQueryKey()
        );
      },
    },
  });
  const updateUserContact = useMeContactsControllerUpdateUserContact({
    axios: axiosConfig,
    mutation: {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(
          getMeContactsControllerFindAllUserContactsQueryKey()
        );
      },
    },
  });

  return (
    <Stack width="100%" alignItems="center" spacing={4}>
      <ContactCard
        onSave={(data) =>
          createUserContact
            .mutateAsync({
              data: {
                ...data,
                dateOfBirth: data.dateOfBirth
                  ? new Date(data.dateOfBirth).toISOString()
                  : undefined,
              },
            })
            .then(() => toast.success("Successfully created contact"))
            .catch(() => toast.error("Error creating contact"))
        }
      />
      <Grid container spacing={4}>
        {data?.data.map((contact) => (
          <Grid item key={contact.id} xs={12} md={6} lg={4}>
            <ContactCard
              sx={{
                width: "100%",
                height: "100%",
              }}
              data={contact}
              onSave={(data) =>
                updateUserContact
                  .mutateAsync({
                    id: contact.id.toString(),
                    data: {
                      ...data,
                      dateOfBirth: data.dateOfBirth
                        ? new Date(data.dateOfBirth).toISOString()
                        : undefined,
                    },
                  })
                  .then(() => toast.success("Successfully updated contact"))
                  .catch(() => toast.error("Error updating contact"))
              }
              onDelete={() =>
                removeUserContact
                  .mutateAsync({
                    id: contact.id.toString(),
                  })
                  .then(() => toast.success("Successfully deleted contact"))
                  .catch(() => toast.error("Error deleting contact"))
              }
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

ContactsPage.getLayout = (page) => {
  return <Dashboard2Layout title="Contacts">{page}</Dashboard2Layout>;
};

ContactsPage.authn = {
  mustBe: "loggedIn",
};

export default ContactsPage;
