
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Paper, InputAdornment, Box } from '@mui/material';
import api from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import { DividerWithText } from '../components/DividerWithText/DividerWithText';
import { useState } from 'react';

const validationSchema = yup.object({
    email: yup.string().email('Te rugam sa introduci o adresa de email valida').required('Adresa de email este obligatorie'),
    password: yup.string().min(6, 'Parola trebuie sa contina minimum 6 caractere').required('Parola este obligatorie'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Parolele nu se potrivesc')
        .required('Parola de confirmare este obligatorie'),
});

export const Signup = () => {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await api.post('/auth/signup', values);
                localStorage.setItem('token', response.data.token);
                navigate("/")
            } catch (error) {
                if (error?.response?.status === 400) {
                    setErrorMessage(error?.response?.data?.error || "")
                }
                console.error(error)
            }
        },
    });


    return (
        <Paper>
            <Container maxWidth="sm" sx={{
                paddingY: theme => theme.spacing(4),
                paddingX: theme => theme.spacing(2),
                borderRadius: theme => theme.shape.borderRadius,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'

            }}>

                <Typography variant="h4" align='center' component="h1" gutterBottom>
                    Inregistrare
                </Typography>
                {errorMessage && <Box sx={{ border: '1px solid', borderColor: theme => theme.palette.error.main, paddingX: 4, paddingY: 2, mb: 2 }}><Typography color="error">{errorMessage}</Typography></Box>}
                <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Adresa de email"
                        variant="outlined"
                        placeholder='example@gmail.com'
                        fullWidth
                        margin="normal"
                        {...formik.getFieldProps('email')}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailOutlinedIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label="Parola"
                        placeholder='****'
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...formik.getFieldProps('password')}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOpenOutlinedIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <TextField
                        label="Confirma parola"
                        placeholder='****'
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...formik.getFieldProps('confirmPassword')}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOpenOutlinedIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Inregistrare
                    </Button>
                    <DividerWithText text="sau" />
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/')}
                    >
                        Am deja cont
                    </Button>
                </form>
            </Container>
        </Paper>

    );
};
