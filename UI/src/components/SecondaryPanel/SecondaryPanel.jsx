import { Box } from '@mui/material'
import React from 'react'

export const SecondaryPanel = ({children, sx}) => {
  return (
    <Box sx={{ backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em', borderRadius: '1em', ...sx}}>
        {children}
    </Box>
  )
}
