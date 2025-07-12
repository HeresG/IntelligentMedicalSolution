import { Box, Typography } from '@mui/material'
import logo from '../../assets/logo.png'

export const Logo = () => {
  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: '1em'
    }}>
        <img src={logo} height={50} alt="Inteligent Medical Solution Color Logo"/>
        <Typography color="secondary" variant="body1">Inteligent Medical Solution</Typography>
    </Box>
  )
}
