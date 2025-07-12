import { Box, Button, MenuItem } from "@mui/material"
import { protectedRoutes, USER_ROLE } from "../../../services/router"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import MUIMenu from '@mui/material/Menu';
import { useSelector } from "react-redux";
import { authProfileSelector } from "../../../store/auth/selectors";


const NavigationItem = ({ route }) => {
    const navigate = useNavigate()

    const handleChangePage = useCallback((path) => {
        navigate(path)
    }, [])

    return <Button
        sx={{ color: '#fff' }} variant="text" onClick={() => handleChangePage(route.path)}>{route.name}</Button>
}

const NavigationItemWithMenu = ({ route }) => {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExpand = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, [])

    const handleChangePage = useCallback((parentPath, relativePath) => {
        navigate(`${parentPath}/${relativePath}`)
        handleClose()
    }, [])

    if (!route?.compactNavigation || !route?.children.length) return;

    return (
        <Box>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={event => handleExpand(event)}
                sx={{ color: '#fff', cursor: 'pointer' }}
            >
                {route.name}
            </Button>
            <MUIMenu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {route?.children.map(childRoute => <MenuItem key={`${route.path}-${childRoute.path}`} onClick={() => handleChangePage(route.path, childRoute.path)}>{childRoute.name}</MenuItem>)}

            </MUIMenu>
        </Box>
    )
}

const filterRoutesByRole = (routes, role) => {
    return routes
        .filter(route => route.role.includes(role)) // Filter routes based on role
        .map(route => ({
            ...route,
            children: route.children
                ? filterRoutesByRole(route.children, role) // Recursively filter children
                : [], // If no children, keep as an empty array
        }));
};

export const Menu = () => {

    const { role } = useSelector(authProfileSelector);
    const currentRole = USER_ROLE[role];

    const findRoutesAvailable = filterRoutesByRole(protectedRoutes, currentRole)
    
    return (
        <>
            {findRoutesAvailable.map(route =>
                !!route?.compactNavigation ?
                    <NavigationItemWithMenu key={route.name} route={route} /> :
                    <NavigationItem key={route.name} route={route} />
            )}
        </>
    )
}
