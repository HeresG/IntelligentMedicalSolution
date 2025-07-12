import { personalDataSelector } from "../store/auth/selectors"
import { useDispatch, useSelector } from "react-redux"
import { PersonalDataForm } from "../components/PersonalDataForm/PersonalDataForm"
import { setAuthPersonalData } from "../store/auth/action"
import api from "../services/axiosConfig"
import { useEffect, useState } from "react"
import { PageContainer } from "../components/PageContainer/PageContainer"
import { PageHeader } from "../components/PageHeader/PageHeader"
import { Box, Button, Checkbox, FormControlLabel, Grid2, IconButton, Paper, Typography } from "@mui/material"
import { generatePersonalDetailsFromCNP } from "../utilities/generators"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';

export const displayBirthDate = (cnp) => {
  try {
    const { birthDate } = generatePersonalDetailsFromCNP(cnp);

    const day = birthDate.getDate();
    const month = birthDate.getMonth();
    const year = birthDate.getFullYear();

    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() < month ||
      (today.getMonth() === month && today.getDate() < day)
    ) {
      age--;
    }

    const months = [
      "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];

    return `${day} ${months[month]} ${year} (${age})`;

  } catch (e) {
    return "";
  }
};


export const displayGender = (cnp) => {
  try {
    return generatePersonalDetailsFromCNP(cnp).gender;
  } catch (e) {
    return ""
  }
}



export const DatePersonale = () => {
  const [isEditingOpen, setEditingOpen] = useState(false);
  const dispatch = useDispatch();
  const datePersonale = useSelector(personalDataSelector);


  useEffect(() => {
    if (!datePersonale?.userId) return;
    api.get('/personal/user/' + datePersonale?.userId).then(res =>
      dispatch(setAuthPersonalData(res.data.data)))
  }, [datePersonale?.userId])

  const handleSubmit = async (values) => {
    try {
      const { data } = await api.put('/personal/user/' + datePersonale?.userId, values)
      dispatch(setAuthPersonalData(data.data));
    } catch (e) {
      throw new Error(e.message);
    }
    finally {
      setEditingOpen(false)
    }
  };

  const handleEditData = () => {
    setEditingOpen(!isEditingOpen)
  }
  <Button onClick={handleEditData}>{isEditingOpen ? "Inapoi" : "Editeaza datele"}</Button>


  return (
    <>
      <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0' }}>

        <PageContainer>
          <Grid2 container alignItems="center" spacing={2}>
            <Grid2 size="grow">
              <PageHeader pageName="Date personale" caption="Revizuie datele tale personale" />

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
              }} onClick={() => handleEditData()}>
                <EditIcon sx={{ fontSize: '34px' }} />
                <Typography variant='h6' fontWeight={400}>
                  {!isEditingOpen ? "Editeaza datele" : "Inapoi"}
                </Typography>
              </Button>
            </Grid2>
          </Grid2>

        </PageContainer>
      </Box>
      <Box sx={{ mt: 2 }}>
        <PageContainer>
          {isEditingOpen ? <PersonalDataForm datePersonale={datePersonale} handleSubmit={handleSubmit} /> : <DisplayPersonalData />
          }
        </PageContainer>
      </Box>
    </>
  )

}

const DisplayPersonalData = () => {
  const datePersonale = useSelector(personalDataSelector);
  const [isCnpShown, setCnpShown] = useState(false);


  return (
    <Box>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <Grid2 container columnGap={2}>
            <Grid2 size={{
              xs: 12,
              md: 7
            }}>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Prenume:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{datePersonale?.firstName || ""}</Typography>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Nume:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{datePersonale?.lastName || ""}</Typography>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>CNP:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Grid2 container alignItems="center" ><Grid2 size="auto">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          color="primary"
                          onClick={() => setCnpShown(!isCnpShown)}
                        >
                          {isCnpShown ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton></Grid2>
                        <Grid2><Typography sx={{ fontWeight: 600 }}>{isCnpShown ? datePersonale?.cnp : "*".repeat(10) + datePersonale?.cnp.slice(11, 13)}</Typography></Grid2>

                      </Grid2>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Varsta:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{displayBirthDate(datePersonale?.cnp)}</Typography>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Sex:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{displayGender(datePersonale?.cnp)}</Typography>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Numar de telefon:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{datePersonale?.phoneNumber || ""}</Typography>
                    </Grid2>
                  </Grid2>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Grid2 container>
                    <Grid2 size={6}>
                      <Typography>Adresa:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                      <Typography sx={{ fontWeight: 600 }}>{datePersonale?.address || ""}</Typography>
                    </Grid2>
                  </Grid2>

                </Box>
              </Paper>
            </Grid2>
            <Grid2 size={{
              xs: 12,
              md: "grow"
            }}>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>
                <Typography variant="body2">Detalii </Typography>
                <Grid2 container>
                  <Grid2 size={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={Boolean(datePersonale?.details?.fumator)}
                        />
                      }
                      label="Fumător"
                    /></Grid2>
                  {(displayGender(datePersonale?.cnp) == "F") && <Grid2 size={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={Boolean(datePersonale?.details?.sarcinaActiva)}
                        />
                      }
                      label="Sarcină activă"
                    /></Grid2>}
                  <Grid2 size={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled
                          checked={Boolean(datePersonale?.details?.diabet)}
                        />
                      }
                      label="Diabet"
                    /></Grid2>
                  {(displayGender(datePersonale?.cnp) == "F") &&
                    <Grid2 size={12} sx={{ mt: 2 }}>
                      <Typography>Nr. sarcini anterioare: {datePersonale?.details?.nrSarciniAnterioare}</Typography>
                    </Grid2>}
                </Grid2>

              </Paper>

            </Grid2>
          </Grid2>

        </Grid2>
      </Grid2>
    </Box>
  )
}
