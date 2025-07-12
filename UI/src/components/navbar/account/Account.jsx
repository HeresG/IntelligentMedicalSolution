import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { authProfileSelector } from "../../../store/auth/selectors"
import { randomRGB } from "../../../utilities/rgbRandomHex"
import { useMemo, useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom"
import { USER_ROLE } from "../../../services/router"

export const Account = () => {
    const navigate = useNavigate()
    const { personal: personalData, role } = useSelector(authProfileSelector)


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose()
        localStorage.removeItem('token')
        navigate("/")
    }

    const getInitialFromNames = () => {
        if (personalData?.firstName && personalData?.lastName) {
            return personalData.firstName[0].toUpperCase() + "" + personalData.lastName[0].toUpperCase()
        }
        return "N/A"
    }

    const getRandomHexColor = () => useMemo(() => randomRGB(), [])


    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Avatar
                    style={{
                        backgroundColor: getRandomHexColor(),
                        border: "2px solid white",
                        height: "60px",
                        width: "60px",
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',

                        }}>
                        {role === USER_ROLE.DOCTOR && <Typography sx={{p:0, m:0, lineHeight: .5}} variant="body2">
                            Dr.
                        </Typography>}
                        <Typography sx={{p:0, m:0}} variant="h6">
                            {getInitialFromNames()}
                        </Typography>
                    </Box>
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>


    )
}
