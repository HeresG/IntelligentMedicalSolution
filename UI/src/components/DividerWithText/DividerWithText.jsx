import { Box, Divider, Typography } from '@mui/material'

export const DividerWithText = ({text}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography sx={{ padding: '0 8px' }}>{text}</Typography>
            <Divider sx={{ flexGrow: 1 }} />
        </Box>
    )
}
