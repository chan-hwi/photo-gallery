"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { useQuery } from 'react-query';
import { Buffer } from "buffer";
import { useSearchParams, useRouter } from 'next/navigation';
import useCreatePostMutation from "@/hooks/useCreatePostMutation";
import useUpdatePostMutation from "@/hooks/useUpdatePostMutation";
import FileUpload from "./FileUpload";
import TagTextField from "../Forms/TagTextField";
import type { PostType, TagType } from "types/models";

type formDataType = Pick<PostType, "title" | "description" | "src"> & { tags: TagType[] };

const initialFormData : formDataType = {
  title: "",
  description: "",
  src: "",
  tags: []
};

type Props = {
  post: PostType | null;
}

function UploadForm({ post } : Props) {
  const [formData, setFormData] = useState<formDataType>(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleUpload = (currentFile : File) => {
    setFile(currentFile);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(true);
    };
    reader.onloadend = () => {
      setLoading(false);
      setFormData((formData : formDataType | null) => (({ ...formData, src: reader.result }) as formDataType));
    };
    reader.readAsDataURL(currentFile);
  };

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData((formData : formDataType) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }) as formDataType);
  };

  const handleChangeTag = useCallback((newValue : TagType[] | ((newtag: TagType[]) => TagType[])) => {
    setFormData((formData : formDataType) => ({ ...formData, tags: (typeof newValue === 'function' ? newValue(formData.tags) : newValue) }) as formDataType);
  }, []);

  const handleSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      setErrorText("Please upload file");
      setOpenError(true);
      return;
    }
    if (!file.type.startsWith("image")) {
      setFile(null);
      setFormData((formData : formDataType | null) => ({ ...formData, src: "" }) as formDataType);
      setErrorText("File should be an image type");
      setOpenError(true);
      return;
    }

    if (post) {
      updatePostMutation.mutate(
        { id: post._id, formData },
        {
          onSuccess: () => {
            router.push("/");
          },
        }
      );
    } else {
      createPostMutation.mutate(formData, {
        onSuccess: () => {
          router.push("/");
        },
      });
    }
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  useEffect(() => {
    if (post) {
      const imageData = post.src.split(",");
      const mime = imageData[0].match(/:(.*?);/)![1];

      setFile(
        new File(
          [Buffer.from(imageData[1], "base64")],
          post._id + `.${mime.split("/")[1]}`,
          { type: mime }
        )
      );
      setFormData(post);
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      maxWidth="sm"
      sx={{ mx: "auto", mt: 2 }}
    >
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <FileUpload onUpload={handleUpload}>
            <Stack
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="20rem"
              gap={2}
            >
              {formData?.src ? (
                <img
                  src={formData.src}
                  alt={file?.name}
                  style={{ width: "auto", maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : (
                <>
                  <Avatar>
                    <UploadIcon />
                  </Avatar>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <Typography variant="body1">
                      Drag & drop or click to upload your image
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </FileUpload>
        </Grid>
        <Grid item sm={12}>
          <TextField
            label="Title"
            name="title"
            onChange={handleChange}
            value={formData?.title}
            fullWidth
            required
          ></TextField>
        </Grid>
        <Grid item sm={12}>
          <TextField
            label="Description"
            name="description"
            onChange={handleChange}
            value={formData?.description}
            fullWidth
            multiline
            minRows={10}
          ></TextField>
        </Grid>
        <Grid item sm={12}>
          <TagTextField
            creatable
            value={formData?.tags}
            setValue={handleChangeTag}
          />
        </Grid>
        <Grid item sm={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorText}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UploadForm;
