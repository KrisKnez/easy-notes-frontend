import {
  Box,
  BoxProps,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";

export interface ContactCardData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  instagram?: string;
  note?: string;
}

export interface ContactCardProps extends BoxProps {
  data?: ContactCardData;
  onSave?: (data: ContactCardData) => void;
  onDelete?: () => void;
}

const ContactCard = (props: ContactCardProps) => {
  const { data, onSave, onDelete, ...restProps } = props;

  const [currentData, setCurrentData] = useState<ContactCardData>(
    data || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      instagram: "",
      note: "",
    }
  );

  return (
    <Box
      {...restProps}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        onSave?.(currentData);
      }}
    >
      <Card sx={{ maxWidth: 475 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                fullWidth
                value={currentData.firstName || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    firstName: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                fullWidth
                value={currentData.lastName || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    lastName: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="email"
                name="email"
                placeholder="Email"
                fullWidth
                value={currentData.email || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    email: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="tel"
                name="phone"
                placeholder="Phone"
                fullWidth
                value={currentData.phone || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    phone: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                name="dateOfBirth"
                placeholder="Date of Birth"
                fullWidth
                value={
                  currentData.dateOfBirth
                    ? dayjs(currentData.dateOfBirth).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                name="instagram"
                placeholder="@Instagram"
                fullWidth
                value={currentData.instagram || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    instagram: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                name="note"
                placeholder="Note"
                fullWidth
                multiline
                rows={2}
                value={currentData.note || ""}
                onChange={(e) =>
                  setCurrentData((currentData) => ({
                    ...currentData,
                    note: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: "flex-end",
          }}
        >
          {data && (
            <>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={onDelete}
              >
                Delete
              </Button>
              <Box flexGrow={1} />
              <Button
                size="small"
                variant="outlined"
                color="info"
                onClick={() => setCurrentData(data)}
                disabled={JSON.stringify(data) === JSON.stringify(currentData)}
              >
                Undo
              </Button>
            </>
          )}
          <Button
            size="small"
            variant="contained"
            type="submit"
            disabled={JSON.stringify(data) === JSON.stringify(currentData)}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ContactCard;
