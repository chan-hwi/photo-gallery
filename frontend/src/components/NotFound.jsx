import React from 'react'
import { Typography, Box, Stack } from '@mui/material';

function NotFound() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
        <Stack display="flex" justifyContent="center">
            <Typography variant="h3">404 Not Found</Typography>
        </Stack>

    </Box>
  )
}

export default NotFound