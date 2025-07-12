import { useMatches } from "react-router-dom";
import api from "../../services/axiosConfig"
import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, Collapse, Divider, Grid2, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { displayBirthDate, displayGender } from "../datePersonale";
import { DateUtils } from "../../utilities/DateUtils";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import { ConfirmationModal } from "../../components/ConfirmationModal/ConfirmationModal";
import { ParametersRegisteredValues } from "../../components/ParametersRegisteredValues";
import { AnalyzeDetails } from "../../components/AnalyzeDetails";
import { AnalyzeComplitions } from "../../components/AnalyzeCompletions";


export const Pacient = () => {
  const match = useMatches(['/pacienti', '/pacienti/:clientId']);
  const clientId = match[match.length - 1].params.clientId;

  const [name, setName] = useState("")
  const [pacientPersonalData, setPacientPersonalData] = useState({
    cnp: "",
    phoneNumber: "",
    address: ""
  })
  const [analize, setAnalize] = useState([])
  const [isAnalizeLoading, setAnalizeLoading] = useState(false);

  const [medicamentatie, setMedicamentatie] = useState([])
  const [isMedLoading, setMedLoading] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    api('/personal/clients/' + clientId).then(res => {
      try {
        const { data } = res;
        setName(data?.personalData?.firstName + " " + data?.personalData?.lastName || "")
        setPacientPersonalData({
          cnp: data?.personalData?.cnp || "",
          phoneNumber: data?.personalData?.phoneNumber || "",
          address: data?.personalData?.address || "",
          details: data?.personalData?.details || null
        })
      } catch (e) {
        console.error("Eroare setare pacienti")
      }
    })
  }, [clientId])

  useEffect(() => {
    setMedLoading(true)
    api('/medicamentatie/' + clientId)
      .then(res => setMedicamentatie(res.data))
      .catch(err => console.error(err))
      .finally(_ => setMedLoading(false))
  }, [clientId])

  useEffect(() => {
    setAnalizeLoading(true)
    api('analize/' + clientId)
      .then(res => {
        setAnalize(res.data.map(a => ({ ...a, mlResults: !!a?.mlResults.length ? a?.mlResults : !!a?.diagnosis ? [] : null })))
      })
      .catch(err => console.error(err))
      .finally(_ => setAnalizeLoading(false))
  }, [clientId])


  return (
    <>
      <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0', mb: 4 }}>
        <PageContainer>
          <Grid2 container alignItems="center" spacing={2}>
            <Grid2 size="grow">
              <PageHeader pageName={name} />
            </Grid2>
          </Grid2>
        </PageContainer>

      </Box>
      <PageContainer>
        <Grid2 container rowSpacing={4} columnSpacing={6} justifyContent="stretch">
          <Grid2 size={{
            xs: 12,
            lg: "grow"
          }}>
            <PacientPersonalData personalData={pacientPersonalData} />
          </Grid2>
          <Grid2 size={{
            xs: 12,
            lg: "grow"
          }}>
            <PacientPersonalDataDetails personalData={pacientPersonalData} />
          </Grid2>
          {!!medicamentatie.length && <Grid2 size={12}>
            <Medicamentatie medicamentatie={medicamentatie} />
          </Grid2>}
          {!!analize.length && <Grid2 size={12}>
            <Analize analize={analize} setAnalize={setAnalize} isAnalizeLoading={isAnalizeLoading} />
          </Grid2>}
        </Grid2>
      </PageContainer>
    </>
  )
}

const Analize = ({ analize, setAnalize, isAnalizeLoading }) => {
  const [currentAnalyze, setCurrentAnalyze] = useState(0);
  const [isMLLoading, setMLLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const analyzeData = analize[currentAnalyze]

  const setNext = () => {
    if (currentAnalyze === analize.length - 1) return;
    setCurrentAnalyze(prev => prev + 1)
  }

  const setPrev = () => {
    if (currentAnalyze === 0) return;
    setCurrentAnalyze(prev => prev - 1);
  }

  const handleAssignDoctorToPacient = () => {
    api.post('/analize/assignDoctor', {
      analyzeId: analyzeData.id
    })
      .then(res => {
        const indexCurrent = analize.findIndex(a => a.id === analyzeData.id);

        if (indexCurrent === -1) return;

        const newAnalyze = {
          ...analyzeData,
          assignedDoctor: res.data
        };

        const updatedAnalize = [
          ...analize.slice(0, indexCurrent),
          newAnalyze,
          ...analize.slice(indexCurrent + 1)
        ];

        setAnalize(updatedAnalize)

      })
      .catch(er => console.error(er))
      .finally(_ => setIsConfirmationModalOpen(false))
  }


  const handleBeginMLAnalyze = (analyzeId) => {
    setMLLoading(true);

    api.post("/analize/mlstart", { analyzeId })
      .then(res => {
        const indexCurrent = analize.findIndex(a => a.id === analyzeData.id);

        if (indexCurrent === -1) return;

        const newAnalyze = {
          ...analyzeData,
          mlResults: res.data || []
        };

        const updatedAnalize = [
          ...analize.slice(0, indexCurrent),
          newAnalyze,
          ...analize.slice(indexCurrent + 1)
        ];

        setAnalize(updatedAnalize)
      })
      .catch(error => {
        console.error("Eroare ML:", error);
        const indexCurrent = analize.findIndex(a => a.id === analyzeData.id);

        if (indexCurrent === -1) return;

        const newAnalyze = {
          ...analyzeData,
          mlResults: []
        };

        const updatedAnalize = [
          ...analize.slice(0, indexCurrent),
          newAnalyze,
          ...analize.slice(indexCurrent + 1)
        ];

        setAnalize(updatedAnalize)
      })
      .finally(() => setMLLoading(false));
  };



  return (
    <Paper sx={{ overflow: "hidden" }}>
      {
        isAnalizeLoading ?
          <Skeleton variant="rounded" animation="wave" sx={{ backgroundColor: '#3c3c3c10', width: '100%', height: '400px' }} /> :
          <Grid2 container direction="column" rowGap={1} sx={{ p: 2 }}>
            <Grid2 size={12}>
              <Grid2 container alignItems="center">

                <Grid2 size={8}>
                  <Typography variant="body1">Analize</Typography>
                </Grid2>

                <Grid2 size={4}>
                  <Grid2 container justifyContent="flex-end" columnGap={2}>

                    <IconButton disabled={currentAnalyze === 0} onClick={setPrev} color="primary">
                      <ArrowBackIosNewIcon />
                    </IconButton>


                    <IconButton disabled={currentAnalyze === analize.length - 1} onClick={setNext} color="primary">
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Grid2>
                </Grid2>

              </Grid2>
            </Grid2>
            <Grid2 size={12}>
              <Divider />
            </Grid2>
            <Grid2 size={12} sx={{ my: 2 }}>
              <Grid2 container alignItems="center">
                <Grid2 size="grow"><Typography sx={{ fontStyle: "italic" }} variant="h4">"{analyzeData?.analyzeTitle || ""}"</Typography></Grid2>
                <Grid2 size="auto">
                  <ConfirmationModal title="Doriti sa preluati analiza?" isOpen={isConfirmationModalOpen} handleClose={() => setIsConfirmationModalOpen(false)} handleConfirm={handleAssignDoctorToPacient} />
                  <Button disabled={!!analyzeData?.assignedDoctor} variant="contained" onClick={() => setIsConfirmationModalOpen(true)} size="large">{analyzeData?.assignedDoctor ? analyzeData?.diagnosis ? "Analiza trimisa" : "Analiza preluata" : "Preia pacientul"}</Button>
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={12}>
              <Grid2 container spacing={4}>
                <Grid2 size={{
                  xs: 12,
                  lg: 6
                }}>
                  <Grid2 size={12}>
                    <Typography>Detalii</Typography>
                  </Grid2>
                  <Grid2 size={6} sx={{ mb: 1 }}>
                    <Divider />
                  </Grid2>
                  <Grid2 size={12}>
                    <AnalyzeDetails 
                      testingDate={analyzeData?.testingDate}
                      createdAt={analyzeData?.createdAt}
                      institution={analyzeData?.institution}
                      doctor={analyzeData?.doctor}
                    />
                  </Grid2>
                </Grid2>

                <Grid2 size={{
                  xs: 12,
                  lg: 6
                }}>
                  <Grid2 size={12} sx={{ mb: 1 }}>
                    <Typography>Valori</Typography>
                  </Grid2>
                  <Grid2 size={12}>
                    <ParametersRegisteredValues analyzeCategories={analyzeData?.categories} analyzeResults={analyzeData?.results} />
                  </Grid2>
                </Grid2>
                <Grid2 size={{
                  xs: 12,
                  lg: 6
                }}>
                  <Grid2 size={12}>
                    <Typography>Completarile pacientului</Typography>
                  </Grid2>
                  <Grid2 size={6} sx={{ mb: 1 }}>
                    <Divider />
                  </Grid2>
                  <Grid2 size={12}>
                    <AnalyzeComplitions notes={analyzeData?.notes} file={analyzeData?.file}/>
                  </Grid2>
                </Grid2>
                <Grid2 size={12}>
                  <Divider />
                </Grid2>
                <Grid2 size={12}>

                  <Typography align="center" variant="h6">
                    {(!analyzeData?.mlResults && analyzeData?.assignedDoctor && !analyzeData?.diagnosis) && "Nu exista analiza inteligenta"}
                    {(!analyzeData?.mlResults && !analyzeData?.assignedDoctor && !analyzeData?.diagnosis) && "Pentru a initia analiza AI, va rugam sa preluati pacientul"}

                  </Typography>
                  {!analyzeData?.mlResults ?
                    <Box sx={{ width: '100%', height: '120px', display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                      {isMLLoading ?
                        <CircularProgress size={50} /> :
                        <Button disabled={!analyzeData?.assignedDoctor} sx={{ py: '1em', px: '2em' }} onClick={() => handleBeginMLAnalyze(analyzeData?.id)} variant="contained">Incepe analiza AI</Button>
                      }

                    </Box> : <ResultForm analyzeData={analyzeData} analize={analize} setAnalize={setAnalize} />}
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>

      }
    </Paper>

  )
}

const ResultForm = ({ analyzeData, analize, setAnalize }) => {
  const formik = useFormik({
    initialValues: {
      doctorNote: analyzeData?.diagnosis?.doctorNote || "",
      mlResults: analyzeData?.mlResults.map(r => ({
        resultName: r.resultName,
        confirmed: r.confirmed,
        includeInReport: r.includeInReport
      }))
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      api.post("/analize/diagnosis/" + analyzeData.id, values)
        .then(res => {
          const indexCurrent = analize.findIndex(a => a.id === analyzeData.id);

          if (indexCurrent === -1) return;

          const newAnalyze = {
            ...analyzeData,
            diagnosis: res.data,
            mlResults: values.mlResults
          };

          const updatedAnalize = [
            ...analize.slice(0, indexCurrent),
            newAnalyze,
            ...analize.slice(indexCurrent + 1)
          ];

          setAnalize(updatedAnalize)
        })
        .catch(err => console.error(err));

    }
  });

  const { values, handleSubmit, handleChange } = formik;



  return (
    <form onSubmit={handleSubmit}>
      <Grid2 container spacing={2}>
        <Grid2 size="grow">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Boala</TableCell>
                  <TableCell align="right">Predictie</TableCell>
                  <TableCell align="right">Include in raport</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.mlResults.length ? values.mlResults.map((row, index) => (

                  <TableRow key={row.resultName}>
                    <TableCell>{row.resultName}</TableCell>
                    <TableCell align="right">
                      {row.confirmed ? <CheckIcon /> : <CloseIcon />}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox
                        {...formik.getFieldProps(`mlResults[${index}].includeInReport`)}
                        checked={formik.values.mlResults?.[index]?.includeInReport || false}
                        disabled={!!analyzeData?.diagnosis}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                      />
                    </TableCell>
                  </TableRow>
                )) :
                  <TableRow key={1}>
                    <TableCell colSpan={3}><Typography align="center" variant="body2">Nu exista model bazat pe parametrii introdusi. Va rugam contactati unul dintre admini</Typography></TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        <Grid2 size="grow">
          <TextField
            name="doctorNote"
            value={values.doctorNote}
            onChange={handleChange}
            fullWidth
            disabled={!!analyzeData?.diagnosis}
            multiline
            minRows={8}
            placeholder="Completarile doctorului"
            variant="outlined"
          />
        </Grid2>

        {!analyzeData?.diagnosis && <Grid2 size={12} sx={{ alignItems: 'center', justifyContent: "center", display: "flex" }}>
          <Button
            size="large" type="submit" variant="contained">
            Trimite analiza pacientului
          </Button>
        </Grid2>}
      </Grid2>
    </form>

  )
}

const Medicamentatie = ({ medicamentatie }) => {
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (id) => {
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
  }


  return (
    <Paper sx={{ background: "#fff", p: 2 }}>
      <Grid2 container direction="column" rowGap={1}>
        <Grid2 size={12}>
          <Typography>Tratamente</Typography>
        </Grid2>
        <Grid2 size={12}>
          <Divider />
        </Grid2>
        <Grid2 size={12}>
          <TableContainer sx={{ maxHeight: 430, overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Nume</TableCell>
                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Activ</TableCell>
                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Data incepere</TableCell>
                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Data sfarsit</TableCell>
                  <TableCell sx={{ px: 0, fontWeight: 600 }} align="right">Medicamente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflow: "scroll" }}>
                {medicamentatie.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map((row) => {

                  return <React.Fragment key={row.id}>
                    <TableRow
                      key={row.name}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }

                      }}
                    >
                      <TableCell sx={{ width: "20%", px: 0 }} component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ width: "20%", px: 0 }}>{(new Date(row.startDate) <= new Date() && new Date() <= new Date(row.endDate)) ? "Da" : "Nu"}</TableCell>
                      <TableCell sx={{ width: "20%", px: 0 }}>{DateUtils.formatDate(row.startDate)}</TableCell>
                      <TableCell sx={{ width: "20%", px: 0 }}>{DateUtils.formatDate(row.endDate)}</TableCell>
                      <TableCell align="right">({row?.medicamenteLinks.length}) <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRow(row.id)}
                      >
                        {openRows[row.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton></TableCell>
                    </TableRow>
                    <TableRow sx={{ px: 0 }}>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={6}>
                        <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                          <Box>
                            <Table size="small" sx={{ p: 0 }}>
                              <TableHead>
                                <TableRow sx={{ p: 0 }}>
                                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}></TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Nume medicament</TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Cantitate</TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}>Descriere</TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, fontWeight: 600 }}></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody sx={{ p: 0 }}>
                                {row?.medicamenteLinks.map(med => <TableRow key={med.medicament.name}>

                                  <TableCell sx={{ width: "20%", px: 0, border: "none" }}></TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, border: "none" }} component="th" scope="row">
                                    {med.medicament.name}
                                  </TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, border: "none" }} >{med.quantity}</TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, border: "none" }}>{med.medicament.description}</TableCell>
                                  <TableCell sx={{ width: "20%", px: 0, border: "none" }}></TableCell>
                                </TableRow>)}

                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      </Grid2>
    </Paper>

  )
}
const PacientPersonalData = ({ personalData }) => {
  const [isCnpShown, setCnpShown] = useState(false);

  return (
    <Paper sx={{ background: "#fff", p: 2, alignSelf: "stretch" }}>
      <Grid2 container direction="column" rowGap={1}>
        <Grid2 size={12}>
          <Typography>Date personale</Typography>
        </Grid2>
        <Grid2 size={12}>
          <Divider />
        </Grid2>
        <Grid2 size={12}>
          <Box>
            <Grid2 container>
              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography>CNP:</Typography>
                  </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    {personalData?.cnp && <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        aria-label="display cnp"
                        size="small"
                        color="primary"
                        onClick={() => setCnpShown(!isCnpShown)}
                      >
                        {isCnpShown ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                      <Typography sx={{ fontWeight: 500 }}>
                        {isCnpShown ? personalData?.cnp : "*".repeat(10) + personalData?.cnp.slice(11, 13)}
                      </Typography>
                    </Box>}
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                  xs: 6
                }}>
                  <Typography>Varsta:</Typography>
                </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>{displayBirthDate(personalData?.cnp)}</Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                  xs: 6
                }}>
                  <Typography>Sex:</Typography>
                </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>{displayGender(personalData?.cnp)}</Typography>
                  </Grid2>
                </Grid2>
              </Grid2>


              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                  xs: 6
                }}>
                  <Typography>Numar de telefon:</Typography>
                </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>{personalData?.phoneNumber || ""}</Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                  xs: 6
                }}>
                  <Typography>Adresa:</Typography>
                </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography sx={{ fontWeight: 500 }}>{personalData?.address || ""}</Typography>
                  </Grid2>
                </Grid2>
              </Grid2>

            </Grid2>
          </Box>
        </Grid2>


      </Grid2>
    </Paper>
  )
}
const PacientPersonalDataDetails = ({ personalData }) => {

  return (
    <Paper sx={{ background: "#fff", p: 2, alignSelf: "stretch" }}>
      <Grid2 container direction="column" rowGap={1}>
        <Grid2 size={12}>
          <Typography>Detalii </Typography>
        </Grid2>
        <Grid2 size={12}>
          <Divider />
        </Grid2>
        <Grid2 size={12}>
          <Grid2 container >
            <Grid2 size={12}>
              <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                xs: 6
              }}>
                <Typography>Fumator:</Typography>
              </Grid2>
                <Grid2 size={{
                  xs: 6
                }}>
                  <Typography sx={{ fontWeight: 600 }}>{personalData?.details?.fumator ? "Da" : "Nu"}</Typography>
                </Grid2>
              </Grid2>
            </Grid2>
            {displayGender(personalData?.cnp) === "F" && <><Grid2 size={12}>
              <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                xs: 6
              }}>
                <Typography>Sarcina activa:</Typography>
              </Grid2>
                <Grid2 size={{
                  xs: 6
                }}>
                  <Typography sx={{ fontWeight: 600 }}>{personalData?.details?.sarcinaActiva ? "Da" : "Nu"}</Typography>
                </Grid2>
              </Grid2>
            </Grid2>
              <Grid2 size={12}>
                <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                  xs: 6
                }}>
                  <Typography>Numar de sarcini</Typography>
                </Grid2>
                  <Grid2 size={{
                    xs: 6
                  }}>
                    <Typography sx={{ fontWeight: 600 }}>{personalData?.details?.nrSarciniAnterioare}</Typography>
                  </Grid2>
                </Grid2>
              </Grid2></>}

            <Grid2 size={12}>
              <Grid2 container alignItems="center" minHeight={42}><Grid2 size={{
                xs: 6
              }}>
                <Typography>Diabet</Typography>
              </Grid2>
                <Grid2 size={{
                  xs: 6
                }}>
                  <Typography sx={{ fontWeight: 600 }}>{personalData?.details?.diabet ? "Da" : "Nu"}</Typography>
                </Grid2>
              </Grid2>
            </Grid2>

          </Grid2>
        </Grid2>


      </Grid2>
    </Paper>
  )
}
