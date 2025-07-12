import { Box, Button, Checkbox, FormControlLabel, Grid2, InputAdornment, Modal, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HomeIcon from '@mui/icons-material/Home';
import api from '../../services/axiosConfig';
import { useDispatch } from 'react-redux';
import { setAuthPersonalData } from '../../store/auth/action';
import * as Yup from 'yup';
import { displayGender } from '../../pages/datePersonale';

const validationSchema = Yup.object({
    cnp: Yup.string()
        .length(13, 'CNP-ul trebuie să fie exact 13 caractere')
        .matches(/^\d{13}$/, 'CNP-ul trebuie să conțină doar cifre')
        .required('CNP-ul este obligatoriu'),
    firstName: Yup.string()
        .min(2, 'Prenumele trebuie să aibă cel puțin 2 caractere')
        .required('Prenumele este obligatoriu'),
    lastName: Yup.string()
        .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
        .required('Numele este obligatoriu'),
    address: Yup.string()
        .min(6, 'Adresa trebuie să aibă cel puțin 6 caractere')
        .required('Adresa este obligatorie'),
    phoneNumber: Yup.string()
        .min(10, 'Numărul de telefon trebuie să aibă cel puțin 10 caractere')
        .required('Numărul de telefon este obligatoriu')
});

export const PersonalDataModal = ({ isOpen = false, setModalOpen }) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            cnp: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            details: {
                fumator: false,
                sarcinaActiva: false,
                diabet: false,
                nrSarciniAnterioare: 0,
            }
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await api.post('/personal', values)
                dispatch(setAuthPersonalData(response.data.data))
                setModalOpen(false);
            } catch (error) {
                console.error(error)
                if (error.status === 400) {
                    if (error.response.data.message === "CNP-ul introdus exista deja in baza de date.") {
                        formik.setErrors({ cnp: error.response.data.message })
                    }
                }
            }
        },
    })
    return (
        <Modal open={isOpen}>
            <Paper sx={{
                maxWidth: 800,
                width: 'auto',
                margin: "0 auto",
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '1em'
            }}>
                <Typography variant='h6' align='center' sx={{ marginBottom: "1em" }}>Pentru a finaliza procesul de creare a contului, te rugam sa introduci informatiile urmatoare.</Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Grid2 container columnGap={2}>
                        <Grid2 size={{
                            xs: 12,
                            md: 7
                        }}>
                            <TextField
                                sx={{
                                }}
                                label="Nume de familie"
                                variant="outlined"
                                placeholder='Nume de familie'
                                fullWidth
                                margin="normal"
                                {...formik.getFieldProps('lastName')}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            /> <TextField
                                label="Prenume"
                                variant="outlined"
                                placeholder='Prenume'
                                fullWidth
                                margin="normal"
                                {...formik.getFieldProps('firstName')}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            /> <TextField
                                label="CNP"
                                variant="outlined"
                                placeholder='Cod Numeric Personal'
                                fullWidth
                                margin="normal"
                                {...formik.getFieldProps('cnp')}
                                error={formik.touched.cnp && Boolean(formik.errors.cnp)}
                                helperText={formik.touched.cnp && formik.errors.cnp}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FingerprintIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField
                                label="Numar de telefon"
                                placeholder='0770100100'
                                type="text"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...formik.getFieldProps('phoneNumber')}
                                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalPhoneIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField
                                label="Adresa"
                                placeholder='Str. Lucian Blaga, nr. 4, Mun. Baia Mare, Judet Maramures'
                                type="text"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...formik.getFieldProps('address')}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <HomeIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Grid2>
                        <Grid2 sx={{ marginTop: 2 }} size={{
                            xs: 12,
                            md: "grow"
                        }}>
                            <Box sx={{
                                border: theme => `1px solid #acb8be`,
                                borderRadius: '.2em',
                                padding: '.4em',
                            }}>

                                <Typography variant="body2">Detalii </Typography>
                                <Grid2 container rowGap={2}>
                                    <Grid2 size={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...formik.getFieldProps('details.fumator')}
                                                    checked={formik.values.details.fumator}
                                                />
                                            }
                                            label="Fumător"
                                        />
                                    </Grid2>

                                    {displayGender(formik.values.cnp) === "F" && <Grid2 size={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...formik.getFieldProps('details.sarcinaActiva')}
                                                    checked={formik.values.details.sarcinaActiva}
                                                />
                                            }
                                            label="Sarcină activă"
                                        />
                                    </Grid2>}

                                    <Grid2 size={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...formik.getFieldProps('details.diabet')}
                                                    checked={formik.values.details.diabet}
                                                />
                                            }
                                            label="Diabet"
                                        />
                                    </Grid2>
                                    {
                                        displayGender(formik.values.cnp) === "F" && <Grid2 size={12}>
                                            <TextField type="number"
                                                {...formik.getFieldProps('details.nrSarciniAnterioare')} label="Numar de sarcini anterioare" fullWidth />
                                        </Grid2>
                                    }
                                </Grid2>
                            </Box>
                        </Grid2>
                    </Grid2>



                    <Button type='submit' fullWidth size='large' variant='contained' color='primary' sx={{ marginTop: 2 }}>Incarca datele</Button>
                </form>
            </Paper>
        </Modal>
    )
}
