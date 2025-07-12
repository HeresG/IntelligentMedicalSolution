import { Box } from '@mui/material'
import { Navbar } from '../navbar/Navbar'

export const ProtectedLayout = ({children}) => {
  return (
    <Box>
       <Navbar />
        {/* Aici trebuie adaugat meniul pentru utilizatori conectati */}
        {children}
    </Box>
  )
}
