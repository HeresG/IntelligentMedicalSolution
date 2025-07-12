import { Backdrop, Button, Container, Divider, Grid2, Modal, Paper, Typography } from '@mui/material'

export const ConfirmationModal = ({ children, isOpen, handleClose, title = "Sigur doresti sa continui?", handleConfirm }) => {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
        >
            <Paper sx={{
                width: '100%',
                maxWidth: 800,
                margin: "0 auto",
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '1em'
            }}>
                <Grid2 container sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1em',
                    flexDirection: 'column'

                }}>
                    <Grid2 size="grow" >
                        <Typography id="spring-modal-title" variant="h6" component="h2">
                            {title}
                        </Typography>

                    </Grid2>
                    <Grid2 sx={{ width: '100%', mt: 2, mb:2 }}>
                        <Divider />
                    </Grid2>
                    {children && <><Grid2>
                       {children}
                    </Grid2>
                    <Grid2 sx={{ width: '100%', mt: 2, mb:2 }}>
                        <Divider />
                    </Grid2></>}
                    <Grid2 size="auto" sx={{
                         display: 'flex',
                         width: '100%',
                         flexDirection: 'flex-end',
                         columnGap: '2em'
                     }}>
                        <Button variant="contained" size="large" color="secondary" onClick={handleClose}>Inapoi</Button>
                        <Button variant="contained" size="large" color="error" onClick={handleConfirm}>Confirma</Button>
                    </Grid2>

                </Grid2>

            </Paper>
        </Modal>
    )
}
