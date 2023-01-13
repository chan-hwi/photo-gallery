import React from 'react'
import { Paper, TextField, Button } from '@mui/material';

function CommentForm({ value, onChange, onSubmit, style }) {
  return (
    <Paper elevation={2} sx={{ p: 1 }} {...style} >
        <TextField
          label="Comment"
          placeholder="Leave your comment here"
          multiline
          minRows={3}
          fullWidth
          sx={{ height: "100%" }}
          value={value}
          onChange={onChange}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Paper>
  )
}

export default CommentForm