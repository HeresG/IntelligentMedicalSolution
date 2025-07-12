import React, { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import api from '../../services/axiosConfig';
import { Grid2, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { DateUtils } from '../../utilities/DateUtils';

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const navigate = useNavigate();

    const match = useMatches(['/utilizatori']);
    const isOnUsersPage = match.length === 1;

    useEffect(() => {
        if (!isOnUsersPage) return
        api('/personal/users').then(res => {
            setUsers(res.data)
        })
            .catch(error => {
                console.error(error.message);
            })
    }, [isOnUsersPage])


    const handleEditUser = (userId) => navigate(userId.toString())


    const handleDeleteClick = useCallback((userId) => {
        setUserIdToDelete(userId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteUser = useCallback(() => {
        api.delete('/auth/user/' + userIdToDelete)
            .then(res => {
                const { id } = res.data.data;
                setUsers(users.filter(u => u.id !== id));
                setDeleteModalOpen(false);
            })
            .catch(e => console.error(e));
    }, [userIdToDelete, users]);

    const handleCloseModal = () => setDeleteModalOpen(false);



    if (!isOnUsersPage) return <Outlet />
    return (
        <>
            <ConfirmationModal title="Doriti sa stergeti utilizatorul?" isOpen={isDeleteModalOpen} handleClose={handleCloseModal} handleConfirm={handleDeleteUser} />

            <PageContainer paddingVertical={2}>
                <PageHeader pageName="Utilizatori" caption="Lista cu utilizatorii aplicatiei" />
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell >Nume utilizator</TableCell>
                                        <TableCell>Rol</TableCell>
                                        <TableCell align="right">Nr. de telefon</TableCell>
                                        <TableCell align="right">Data inregistrarii</TableCell>
                                        <TableCell align="right">Actiuni</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((client) => (
                                        <React.Fragment key={client.id}>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >

                                                <TableCell>{client.email}</TableCell>
                                                <TableCell>
                                                    {!!client.personalData ?
                                                        client.personalData?.firstName + " " + client.personalData?.lastName :
                                                        "Necompletat"
                                                    }
                                                </TableCell>
                                                <TableCell>{client.role}</TableCell>
                                                <TableCell align="right"> {!!client.personalData ?
                                                    client.personalData?.phoneNumber :
                                                    "Necompletat"
                                                } </TableCell>
                                                <TableCell align="right">{DateUtils.formatDateTime(client.createdAt)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditUser(client.id)}
                                                    >
                                                        {<EditIcon />}
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteClick(client.id)}
                                                    >
                                                        {<DeleteIcon color="error" />}
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>

                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid2>
                </Grid2>
            </PageContainer>
        </>
    )
}
