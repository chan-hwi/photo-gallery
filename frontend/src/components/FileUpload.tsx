import { useState, useRef } from "react";
import { Paper, Backdrop } from "@mui/material";

interface paramType {
  children: JSX.Element;
  onUpload: (currentFile: File) => void;
};

function FileUpload({ children, onUpload } : paramType) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e : React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e : React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
        onUpload(e.target.files[0]);
    }
  }

  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{ borderStyle: "dashed", cursor: "pointer", position: "relative" }}
      onDragEnter={handleDrag}
      onClick={() => fileInputRef?.current?.click()}
    >
      {children}
      <Backdrop
        open={dragActive}
        component="div"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        sx={{
          bgcolor: 'rgba(205,201,201,0.7)',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      ></Backdrop>
      <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleChange}/>
    </Paper>
  );
}

export default FileUpload;
