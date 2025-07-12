import { Box, Divider, Grid2, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { PageContainer } from "../../components/PageContainer/PageContainer"
import { PageHeader } from "../../components/PageHeader/PageHeader"
import { useDispatch, useSelector } from "react-redux";
import { getAnalyzeById } from "../../store/journal/selectors";
import { useMatches } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { personalDataSelector } from "../../store/auth/selectors";
import api from "../../services/axiosConfig";
import { updateAnalyze } from "../../store/journal/action";
import { ParametersRegisteredValues } from "../../components/ParametersRegisteredValues";
import { AnalyzeDetails } from "../../components/AnalyzeDetails";
import { AnalyzeComplitions } from "../../components/AnalyzeCompletions";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export const Analiza = () => {
    const matches = useMatches(['/jurnal-medical', 'jurnal-medical/:analyzeId'])

    if (!matches[1]?.params.analyzeId) {
        return null;
    }

    const analyzeId = useMemo(() => {
        return parseInt(matches[1].params.analyzeId, 10)
    }, [matches[1].params.analyzeId])


    const analyze = useSelector(getAnalyzeById(analyzeId));

    return (
        <>
            <Box sx={{ width: 1, backgroundColor: theme => `${theme.palette.primary.main}20`, padding: '2em 0', mb: 4 }}>
                <PageContainer>
                    <PageHeader pageName="Analiza medicala" caption={analyze?.analyzeTitle || ""} />
                </PageContainer>
            </Box>
            <PageContainer>
                <Grid2 container columnGap={2}>
                    <Grid2 size="grow">
                        <MyAnalyze analyzeId={analyzeId} />
                    </Grid2>
                    <Grid2 size="grow">
                        <DoctorDiagnosis analyzeId={analyzeId} />
                    </Grid2>
                </Grid2>
            </PageContainer>
        </>
    )
}

const MyAnalyze = ({ analyzeId }) => {
    const [isAnalyzeDataLoading, setAnalyzeDataLoading] = useState(false);
    const datePersonale = useSelector(personalDataSelector);
    const analyze = useSelector(getAnalyzeById(analyzeId));
    const dispatch = useDispatch();


    useEffect(() => {
        if (!analyzeId || !datePersonale) return;
        setAnalyzeDataLoading(true);

        api(`analize/${datePersonale?.userId}/data/${analyzeId}`)
            .then(res => dispatch(updateAnalyze(res.data)))
            .catch(err => console.err(err))
            .finally(_ => setAnalyzeDataLoading(false))


    }, [analyzeId, datePersonale])

    return (
        <Paper>
            {isAnalyzeDataLoading ?
                <Skeleton variant="rounded" animation="wave" sx={{ backgroundColor: '#3c3c3c10', width: '100%', height: '400px' }} /> :
                <Grid2 container sx={{ p: 2 }} rowSpacing={6}>
                    <Grid2 size={12}>
                        <Grid2 container rowSpacing={2}>
                            <Grid2 size={12}>
                                <Typography>Detalii</Typography>
                            </Grid2>
                            <Grid2 size={6}>
                                <Divider />
                            </Grid2>
                            <Grid2 size={12}>
                                <AnalyzeDetails
                                    testingDate={analyze?.testingDate}
                                    createdAt={analyze?.createdAt}
                                    institution={analyze?.institution}
                                    doctor={analyze?.doctor}
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={12}>
                        <Grid2 container rowSpacing={2}>
                            <Grid2 size={12}>
                                <Typography>Completari si fisiere</Typography>
                            </Grid2>
                            <Grid2 size={6}>
                                <Divider />
                            </Grid2>
                            <Grid2 size={12}>
                                <AnalyzeComplitions notes={analyze?.notes} file={analyze?.file} />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={12}>
                        <Grid2 container rowSpacing={2}>
                            <Grid2 size={12}>
                                <Typography>Parametri introdusi</Typography>
                            </Grid2>
                            <Grid2 size={12}>
                                <ParametersRegisteredValues analyzeCategories={analyze?.categories || []} analyzeResults={analyze?.results || []} />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>
            }
        </Paper>
    )
}

const DoctorDiagnosis = ({ analyzeId }) => {
    const datePersonale = useSelector(personalDataSelector);
    const analyze = useSelector(getAnalyzeById(analyzeId));

    const [isAnalyzeDiagnosisLoading, setAnalyzeDiagnosisLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!analyzeId || !datePersonale) return;
        setAnalyzeDiagnosisLoading(true);

        api(`analize/${datePersonale?.userId}/diagnosis/${analyzeId}`)
            .then(res => dispatch(updateAnalyze(res.data)))
            .catch(err => console.err(err))
            .finally(_ => setAnalyzeDiagnosisLoading(false))


    }, [analyzeId, datePersonale])


    if (isAnalyzeDiagnosisLoading) {
        return <Paper>

            <Skeleton variant="rounded" animation="wave" sx={{ backgroundColor: '#3c3c3c10', width: '100%', height: '400px' }} />
        </Paper>
    }

    if (!isAnalyzeDiagnosisLoading && !!analyze?.diagnosis && !!analyze?.assignedDoctor) {
        return (
            <Paper>
                <Grid2 container sx={{ p: 2 }}>
                    <Grid2 size={12}>
                        <Grid2 container rowSpacing={2}>
                            <Grid2 size={12}>
                                <Typography>Diagosticul medicului</Typography>
                            </Grid2>
                            <Grid2 size={6}>
                                <Divider />
                            </Grid2>
                            <Grid2 size={12}>
                                <Grid2 container rowGap={4}>                                    
                                    {!!analyze?.mlResults.length && <Grid2 size={12}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Boala</TableCell>
                                                        <TableCell align="right">Predictie</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {analyze.mlResults.map((row, index) => (

                                                        <TableRow key={row.resultName}>
                                                            <TableCell>{row.resultName}</TableCell>
                                                            <TableCell align="right">
                                                                {row.confirmed ? `Da` : `Nu`}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid2>}
                                    <Grid2 size={12}>
                                        <Typography><span style={{ fontWeight: 500 }}>Diagnostic:</span> {analyze?.diagnosis?.doctorNote || ""}</Typography>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>

            </Paper >
        )

    }

    if (!isAnalyzeDiagnosisLoading && !analyze?.diagnosis && analyze?.assignedDoctor) {
        return <Paper>
            <Grid2 container sx={{ p: 2 }}>
                <Typography>Doctorul <span style={{ textDecoration: "underline" }}>{analyze.assignedDoctor?.personalData?.firstName || "<>"} {analyze.assignedDoctor?.personalData?.firstName || "<>"}</span> a preluat analiza dumneavoastra!</Typography>
            </Grid2>
        </Paper>
    }

    return <Paper><Grid2 container sx={{ p: 2 }}><Typography>Un doctor va urma sa preia analiza dumneavoastra</Typography></Grid2></Paper>
}
