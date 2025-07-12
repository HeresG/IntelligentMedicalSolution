import { Container } from '@mui/material'
import React from 'react'

export const PageContainer = ({children, paddingVertical = 0}) => {
  return (
    <Container
        maxWidth={false}
        sx={{
          maxWidth: '1820px',
          width: '100%',
          margin: '0 auto',
          padding: `${paddingVertical}em 2em`, 
        }}
      >
      {children}
      </Container>
   
  )
}


