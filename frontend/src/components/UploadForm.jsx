import { useState, useEffect } from "react";
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
import { Buffer } from 'buffer';
import { useNavigate, useLocation } from "react-router-dom";
import useCreatePostMutation from '../hooks/useCreatePostMutation';
import useUpdatePostMutation from '../hooks/useUpdatePostMutation';
import FileUpload from "./FileUpload";

const initialFormData = {
  title: "",
  description: "",
  src: "",
};

function UploadForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUpload = (currentFile) => {
    setFile(currentFile);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(true);
    };
    reader.onloadend = () => {
      setLoading(false);
      setFormData((formData) => ({ ...formData, src: reader.result }));
    };
    reader.readAsDataURL(currentFile);
  };

  const handleChange = (e) => {
      setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setErrorText("Please upload file");
      setOpenError(true);
      return;
    }
    if (!file.type.startsWith("image")) {
      setFile(null);
      setFormData((formData) => ({ ...formData, src: "" }));
      setErrorText("File should be an image type");
      setOpenError(true);
      return;
    }

    if (location.state?.post) {
      updatePostMutation.mutate({ id: location.state.post._id, formData }, {
        onSuccess: () => {
          navigate("/");
        },
      });
    } else {
      createPostMutation.mutate(formData, {
        onSuccess: () => {
          console.log('navigate');
          navigate("/");
        },
      });
    }
  };

  const handleErrorClose = () => {
    setOpenError(false);
  };

  useEffect(() => {
    if (location.state?.post) {
      const { post } = location.state;
      
      const imageData = post.src.split(',');
      const mime = imageData[0].match(/:(.*?);/)[1];

      setFile(new File(Buffer.from(imageData[1], "base64"), post._id + `.${mime.split('/')[1]}`, {type: mime}));
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
              {formData.src ? (
                <img
                  src={formData.src}
                  alt={file?.name}
                  style={{ width: "auto", maxHeight: "100%", maxWidth: '100%' }}
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
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} fullWidth>
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
