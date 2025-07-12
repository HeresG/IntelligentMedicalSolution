import { Box, Typography } from '@mui/material'
import React from 'react'

export const PageHeader = ({pageName, caption}) => {
  return (
    <Box sx={{mt: 2, mb: 2}}>
        <Typography variant="h2">{pageName}</Typography>
        {caption && <Typography variant="h6">{caption}</Typography>}
    </Box>
  )
}
