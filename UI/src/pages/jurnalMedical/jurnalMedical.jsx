import { useEffect, useState } from 'react'
// import { PageContainer } from '../components/PageContainer/PageContainer'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { Box, Button, Collapse, Divider, Grid2, IconButton, List, ListItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import BiotechIcon from '@mui/icons-material/Biotech';
import MedicationIcon from '@mui/icons-material/Medication';
import CloseIcon from '@mui/icons-material/Close';
import { AddMedicineForm } from '../../components/AddMedicineForm/AddMedicineForm'
import { v4 as uuidv4 } from 'uuid';
import api from '../../services/axiosConfig';
import { DateUtils } from '../../utilities/DateUtils'
import { AddAnalyzeForm } from '../../components/AddAnalyzeForm/AddAnalyzeForm'
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyzes, getMedicamentation } from '../../store/journal/selectors';
import { resetJournal, setInitialAnalyzes, setInitialMeds } from '../../store/journal/action';
import { personalDataSelector } from '../../store/auth/selectors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { Outlet, useMatches, useNavigate } from 'react-router-dom';

export const JurnalMedical = () => {
    const [uploadNewAnalyzes, setUploadNewAnalyzes] = useState(false)
    const [uploadMedicalJournal, setMedicalJournal] = useState(false)
    const dispatch = useDispatch();
    const { activeMeds, retroMeds } = useSelector(getMedicamentation);
    const { submitted } = useSelector(getAnalyzes);


    const match = useMatches(['/jurnal-medical']);

    const userId = useSelector(personalDataSelector)?.userId

    useEffect(() => {
        if (!userId) return;
        api("/medicamentatie/" + userId)
            .then(res => {
                const medicamentatii = res.data;
                const isValid = Array.isArray(medicamentatii) && medicamentatii?.every(el => el.startDate && el.endDate)

                if (!isValid) {
                    throw new Error("Error data type")
                }
                dispatch(setInitialMeds(medicamentatii))
            })
            .catch(e => console.error(e))
    }, [userId])

    useEffect(() => {
        if (!userId) return;
        api("/analize/" + userId)
            .then(res => {
                dispatch(setInitialAnalyzes(res.data))
            })
    }, [userId])


    useEffect(() => {
        return () => dispatch(resetJournal())
    }, [])



    const handleOpenAnalyzeOrJournal = (type) => {
        if (type === 'ANALYZE') {
            setUploadNewAnalyzes(true)
            setMedicalJournal(false)
        }
        if (type === 'JOURNAL') {
            setMedicalJournal(true)
            setUploadNewAnalyzes(false)
        }
    }

    if(match.length > 1 && !!match[1]?.params?.analyzeId){
        return <Outlet />
    }

    return (
        <>
            <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0' }}>
                <PageContainer>
                    <Grid2 container alignItems="center" spacing={2}>
                        <Grid2 size="grow">
                            <PageHeader pageName="Jurnal Medical" caption="Revizuie datele istoricului tau medical" />
                        </Grid2>
                        <Grid2 size="auto">
                            <Button sx={{
                                backgroundColor: theme => theme.palette.primary.main,
                                color: 'white',
                                padding: '.8em 1.4em',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                columnGap: '1em'
                            }} onClick={() => handleOpenAnalyzeOrJournal('ANALYZE')}>
                                <BiotechIcon sx={{ fontSize: '34px' }} />
                                <Typography variant='h6' fontWeight={400}>
                                    Incarca analize noi
                                </Typography>
                            </Button>


                        </Grid2>
                        <Grid2 size="auto">
                            <Button sx={{
                                backgroundColor: theme => theme.palette.primary.main,
                                color: 'white',
                                padding: '.8em 1.4em',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                columnGap: '1em'
                            }} onClick={() => handleOpenAnalyzeOrJournal('JOURNAL')}>
                                <MedicationIcon sx={{ fontSize: '34px' }} />
                                <Typography variant='h6' fontWeight={400}>
                                    Incarca tratament
                                </Typography>
                            </Button>
                        </Grid2>
                    </Grid2>
                </PageContainer>
            </Box>


            <PageContainer paddingVertical={2}>
                {uploadNewAnalyzes &&
                    <Paper sx={{ mb: 4, p: 2, backgroundColor: theme => theme.palette.primary.light + "15" }}>
                        <Grid2 container >
                            <Grid2 size={12}>
                                <Grid2 container alignItems="center" display="flex" sx={{ mb: 2 }}>
                                    <Grid2 size="grow">
                                        <Typography>
                                            Incarca analizele - Te rog sa introduci detalii despre ultimele analize
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size="auto">
                                        <Button variant="text" size='large' color="secondary" onClick={() => setUploadNewAnalyzes(false)} endIcon={<CloseIcon />}>
                                            Inchide
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                            <Grid2 size={12}>
                                <AddAnalyzeForm />
                            </Grid2>
                        </Grid2>
                    </Paper>}
                {uploadMedicalJournal &&
                    <Paper sx={{ mb: 4, p: 2, backgroundColor: theme => theme.palette.primary.light + "15" }}>
                        <Grid2 container>
                            <Grid2 size={12}>
                                <Grid2 container alignItems="center" display="flex" sx={{ mb: 2 }}>
                                    <Grid2 size="grow">
                                        <Typography>
                                            Adauga un tratament nou
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size="auto">
                                        <Button variant="text" size='large' color="secondary" onClick={() => setMedicalJournal(false)} endIcon={<CloseIcon />}>
                                            Inchide
                                        </Button>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                            <Grid2 size={12}>
                                <AddMedicineForm />
                            </Grid2>
                        </Grid2>
                    </Paper>}
                <Grid2 container spacing={2}>
                    <Grid2 size={{
                        xs: 12,
                        xl: 4
                    }}>
                        <AnalyzeBoard submitted={submitted} title="Analizele mele" />
                    </Grid2>
                    <Grid2 size={{
                        xs: 12,
                        xl: 4
                    }}>
                        <MedicBoard medicamentatie={activeMeds} title="Tratament activ" />
                    </Grid2>
                    <Grid2 size={{
                        xs: 12,
                        xl: 4
                    }}>
                        <MedicBoard medicamentatie={retroMeds} title="Tratament anterior" />

                    </Grid2>

                </Grid2>
            </PageContainer>
        </>

    )
}

const AnalyzeBoard = ({ submitted, title }) => {


    return (
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>
            <Typography variant='h6' fontWeight={400}>{title}</Typography>
            <List sx={{
                height: 320,
                overflowY: 'scroll',
            }}>

                {submitted.length ? submitted.map((analyze, index) => (
                    <AnalyzeCard key={analyze.id} analyze={analyze} amount={submitted.length} index={index} />
                )) : <Box sx={{
                    width: 1,
                    height: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    <Typography>Nu exista analize active</Typography>
                </Box>
                }
            </List>
        </Paper>
    )
}

const AnalyzeCard = ({ analyze, amount, index }) => {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const datePersonale = useSelector(personalDataSelector);
    const { submitted } = useSelector(getAnalyzes);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteAnalyze = (analyzeId) => {
        api.delete('/analize/' + datePersonale.userId + "/" + analyzeId)
            .then(res => {
                if (res.status === 200) {
                    const filtered = submitted.filter(a => a.id !== analyze.id);
                    dispatch(setInitialAnalyzes(filtered))
                }
            })
            .catch(err => console.error(err))
            .finally(_ => setConfirmingDelete(false))
    }


    return (
        <ListItem
            key={uuidv4()}
            sx={{
                marginBottom: index === amount - 1 ? 0 : '.4em',
                p: 0,

                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: "space-between",
                '&:hover .hover-box-main': {
                    width: '89.5%',
                    borderRadius: '5px 0px 0px 5px',
                    backgroundColor: theme => `${theme.palette.primary.main}15`,
                    border: theme => `2px solid ${theme.palette.primary.main}20`
                },
                '&:hover .hover-box-action': {
                    width: '10%',
                    opacity: 1,
                    transform: 'translateX(0)',
                }
            }}
        >
            <Box
                className="hover-box-main"
                sx={{
                    p: 1,
                    border: theme => `2px solid #3c3c3c20`,
                    backgroundColor: theme => `${theme.palette.primary.main}05`,
                    transition: 'all .1s',
                    borderRadius: '5px',
                    width: '100%',
                }}
            >
                <Grid2 container>
                    <Grid2 size={12}>
                        <Grid2 container alignItems="center" direction="row" columnGap={2} justifyContent="space-between">
                            <Grid2 size="grow">
                                <Typography sx={{ my: 1 }}>{analyze.analyzeTitle}</Typography>
                            </Grid2>
                            <Grid2 size="auto">
                                {!analyze.assignedDoctor ?
                                    <Tooltip placement='top' title="In curand unul dintre doctorii nostri va prelua analiza dumneavostra">
                                        <Box sx={{
                                            borderRadius: '5px',
                                            px: '0.4em',
                                            cursor: "pointer",
                                            display: "flex",
                                            columnGap: ".5em",
                                            alignItems: "center"
                                        }}>
                                            <Typography variant='body2'>Nepreluat</Typography>
                                            <InfoIcon sx={{ color: "#3c3c3c40" }} />
                                        </Box>
                                    </Tooltip> :
                                    <Box sx={{
                                        borderRadius: '5px',
                                        px: '0.4em',
                                        display: "flex",
                                        columnGap: ".5em",
                                        alignItems: "center"
                                    }}>
                                        <Typography variant='body2'>{"Preluat de Dr. " + analyze.assignedDoctor?.personalData?.firstName + " " + analyze.assignedDoctor?.personalData?.lastName}</Typography>

                                    </Box>
                                }
                            </Grid2>

                        </Grid2>
                    </Grid2>

                    <Grid2 size={12}>
                        <Divider />
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant='body2' sx={{ my: 1 }}>Efectuare analize: {DateUtils.formatDate(analyze.testingDate)}</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant='body2' sx={{ my: 1 }}>Centru medical: {analyze.institution}</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography variant='body2' sx={{ my: 1 }}>Creat: {DateUtils.formatDate(analyze.createdAt)}</Typography>
                    </Grid2>
                </Grid2>
            </Box>
            <Box
                className="hover-box-action"
                sx={{
                    border: `2px solid #3c3c3c20`,
                    borderRadius: '0px 5px 5px 0px',
                    width: 0,
                    height: '100%',
                    opacity: 0,
                    overflow: 'hidden',
                    transform: 'translateX(-10px)',
                    transition: 'all .1s',
                    "&:hover": {
                        border: theme => `2px solid ${theme.palette.primary.main}20`
                    }
                }}
            >
                <Grid2 container flexDirection="column" alignItems="center">
                    <Grid2 size={12}>
                        <Tooltip placement='right' title="Deschide analiza intr-o fereastra noua">
                            <IconButton 
                            onClick={() => navigate('/jurnal-medical/' + analyze.id)}
                            sx={{
                                border: theme => `2px solid transparent`,
                                borderRadius: "0px",
                                width: '100%',
                                height: '100%',
                            }}>
                                <OpenInNewIcon sx={{ backgroundColor: "transparent", borderRadius: 0 }} />
                            </IconButton>
                        </Tooltip>
                    </Grid2>
                    <Grid2 size={12}>
                        <ConfirmationModal title='Doriti sa stergeti analiza aceasta?' isOpen={confirmingDelete} handleClose={() => setConfirmingDelete(false)} handleConfirm={() => handleDeleteAnalyze(analyze.id)}>
                            <Typography>{analyze.analyzeTitle}</Typography>
                        </ConfirmationModal>
                        <Tooltip placement='right' title="Sterge analiza">
                            <IconButton
                                onClick={() => setConfirmingDelete(true)}
                                sx={{
                                    border: theme => `2px solid transparent`,
                                    borderRadius: "0px",
                                    width: '100%',
                                    height: '100%'
                                }}>
                                <DeleteIcon sx={{ backgroundColor: "transparent", borderRadius: 0 }} />
                            </IconButton>
                        </Tooltip>
                    </Grid2>
                </Grid2>
            </Box>

        </ListItem>
    )
}

const MedicBoard = ({ medicamentatie, title }) => {
    const [openRows, setOpenRows] = useState({});
    const toggleRow = (id) => {
        setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
    }


    return (
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>
            <Typography variant='h6' fontWeight={400}>{title}</Typography>
            <List sx={{
                height: 320,
                overflowY: 'scroll',
            }}>
                {medicamentatie.length ?
                    medicamentatie.map((med, index) => (
                        <ListItem key={uuidv4()} sx={{
                            border: theme => `2px solid #3c3c3c20`,
                            borderRadius: '5px',
                            backgroundColor: theme => `${theme.palette.primary.main}05`,
                            marginBottom: index === medicamentatie.length - 1 ? 0 : '.4em',
                            transition: '.1s',
                            '&:hover': {
                                backgroundColor: theme => `${theme.palette.primary.main}10`,
                                border: theme => `2px solid ${theme.palette.primary.main}50`,
                                transition: '.1s',
                            }
                        }}>
                            <Box sx={{ width: 1 }}>
                                <Grid2 container>
                                    <Grid2 size={12}>
                                        <Typography sx={{ my: 1 }}>{med.name}</Typography>

                                        <Divider />
                                        <Grid2 container alignItems="center">
                                            <Grid2 size="grow">
                                                <Typography variant='body2' sx={{ my: 1 }}>{DateUtils.formatDate(med.startDate)} - {DateUtils.formatDate(med.endDate)}</Typography>
                                            </Grid2>
                                            {new Date(med.startDate) > new Date() && <Grid2>
                                                <Paper sx={{
                                                    border: theme => `1px solid ${theme.palette.primary.main}70`,
                                                    borderRadius: '5px',
                                                    px: '0.4em',
                                                }}>
                                                    <Typography variant='body2'>Neinceput</Typography>
                                                </Paper>
                                            </Grid2>}
                                        </Grid2>
                                        <Table sx={{ p: 0 }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ p: 0, width: "calc(100% - 50px)", border: "none" }}><Typography variant='body2'>{med?.medicamenteLinks.length || 0} medicamente</Typography> </TableCell>
                                                    <TableCell sx={{ p: 0, width: "50px", border: "none" }}>
                                                        <IconButton sx={{ border: theme => `1px solid ${theme.palette.primary.main}20`, borderRadius: "50px" }} onClick={() => toggleRow(med.id)}>
                                                            <ExpandMoreIcon sx={{ transform: openRows[med.id] && "rotate(180deg)" }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <Collapse in={openRows[med?.id]} timeout="auto" unmountOnExit>
                                                <TableBody>
                                                    {med?.medicamenteLinks.map(m => <TableRow key={m.medicament.name}>
                                                        <TableCell sx={{ width: '100%', p: 0, border: "none" }}><Typography variant='body2'>{m.quantity} x {m.medicament.name}</Typography></TableCell>
                                                    </TableRow>)}
                                                </TableBody>
                                            </Collapse>


                                        </Table>
                                    </Grid2>

                                </Grid2></Box>
                        </ListItem>
                    ))
                    : <Box sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <Typography>Nu exista tratament activ</Typography>
                    </Box>
                }


            </List>
        </Paper >
    )
}
