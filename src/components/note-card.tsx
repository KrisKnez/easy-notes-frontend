import {
  Box,
  BoxProps,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export interface NoteCardData {
  title: string;
  content: string;
}

export interface NoteCardProps extends BoxProps {
  data?: NoteCardData;
  onSave?: (data: NoteCardData) => void;
  onDelete?: () => void;
}

const NoteCard = (props: NoteCardProps) => {
  const { data, onSave, onDelete, ...restProps } = props;

  const [currentData, setCurrentData] = useState<NoteCardData>(
    data || {
      title: "",
      content: "",
    }
  );

  console.log(JSON.stringify(data), JSON.stringify(currentData));


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
      <Card
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            <Box
              component="input"
              type="text"
              placeholder="New Note Title"
              required
              sx={{
                all: "inherit",
              }}
              value={currentData.title}
              onChange={(e) =>
                setCurrentData((currentData) => ({
                  ...currentData,
                  title: e.target.value,
                }))
              }
            />
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
            }}
          >
            <Box
              component="textarea"
              placeholder="Note Content"
              sx={{
                all: "inherit",
                width: "100%",
                minHeight: "100%",
              }}
              rows={6}
              required
              value={currentData.content}
              ref={(e: HTMLTextAreaElement) => {
                if (e?.style) {
                  e.style.height = "auto"; // Reset the height to auto
                  e.style.height = `${e.scrollHeight}px`; // Set the height to match the content's height
                }
              }}
              onChange={(e) => {
                setCurrentData((currentData) => ({
                  ...currentData,
                  content: e.target.value,
                }));
                e.target.style.height = "auto"; // Reset the height to auto
                e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to match the content's height
              }}
            />
          </Typography>
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
            disabled={
              JSON.stringify(data) === JSON.stringify(currentData) ||
              currentData.title === "" ||
              currentData.content === ""
            }
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default NoteCard;
