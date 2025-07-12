import { Box, Button, Grid2, TextField, Typography } from "@mui/material"
import { convertManyToLabelAndValue } from "../../utilities/convertors"
import { createIncrementalArray } from "../../utilities/generators"
import { FieldArray, FormikProvider, useFormik } from "formik"
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { PrimarySelector } from "../PrimarySelector/PrimarySelector"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react"
import api from "../../services/axiosConfig"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useDispatch } from "react-redux";
import { addMed } from "../../store/journal/action";

dayjs.extend(utc);
dayjs.extend(timezone);

export const AddMedicineForm = () => {

    const [optionsMedicamente, setOptionsMedicamente] = useState([])
    const [isLoadingMedicamente, setLoadingMedicamente] = useState(false);

    const dispatch = useDispatch();

    const medicalJournalForm = useFormik({
        initialValues: {
            name: "",
            startDate: null,
            endDate: null,
            medicines: [
                {
                    name: "",
                    quantity: "",
                },
            ],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Numele jurnalului de medicamentatie este obligatoriu "),
            startDate: Yup.date()
                .required("Data de început este obligatorie"),
            endDate: Yup.date()
                .required("Data de sfârșit este obligatorie")
                .min(
                    Yup.ref('startDate'),
                    "Data de sfârșit nu poate fi anterioară datei de început"
                ),
            medicines: Yup.array().of(
                Yup.object({
                    name: Yup.string().required("Selectează un medicament"),
                    quantity: Yup.string().required("Selectează o cantitate"),
                })
            ),
        }),

        onSubmit: async (values) => {
            api.post("/medicamentatie", values)
            .then(res => dispatch(addMed(res.data)))
            .catch(err => {
                if(err?.status === 409){
                    medicalJournalForm.setErrors({"name": err?.response?.data?.error})
                }
            })
            .finally(_ => medicalJournalForm.resetForm())
        },
    });


    useEffect(() => {
        setLoadingMedicamente(true)
        api('/medicamente').then(res => setOptionsMedicamente(res.data.data)).catch(e => console.error(e)).finally(_ => setLoadingMedicamente(false))

    }, [])

    const medicineOptions = convertManyToLabelAndValue(optionsMedicamente, 'name')
    const comprimateOptions = convertManyToLabelAndValue(createIncrementalArray(1, 5), 'value')

    const changeMedicineValue = (newValue, actionMeta, index) => {
        if (actionMeta.action !== 'select-option') return
        medicalJournalForm.setFieldValue(`medicines[${index}].name`, newValue.value)
    }

    const changeMedicineQuantityValue = (newValue, actionMeta, index) => {
        if (actionMeta.action !== 'select-option') return
        medicalJournalForm.setFieldValue(`medicines[${index}].quantity`, newValue.value)
    }



    return (
        <form onSubmit={medicalJournalForm.handleSubmit}>
            <TextField
                label="Nume tratament"
                variant="standard"
                placeholder="Salvează un nume pentru această intrare în jurnal (Ex.: Dureri de spate)"
                fullWidth
                margin="normal"
                {...medicalJournalForm.getFieldProps("name")}
                sx={{ mb: 4 }}
                error={!!medicalJournalForm.touched.name &&
                    !!medicalJournalForm.errors.name}
                helperText={!!medicalJournalForm.errors.name && medicalJournalForm.errors.name}

            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid2 container spacing={2}
                    sx={{ mb: 4 }}>
                    <Grid2 size={6}>
                        <DatePicker
                            label="Data incepere tratament"
                            timezone="Europe/Bucharest"
                            onChange={(value) => medicalJournalForm.setFieldValue("startDate", value, true)}
                            value={medicalJournalForm.values.startDate}
                            slotProps={{
                                textField: {
                                    error: Boolean(medicalJournalForm.touched.startDate && medicalJournalForm.errors.startDate),
                                    helperText: medicalJournalForm.touched.startDate && medicalJournalForm.errors.startDate,
                                },
                            }}
                            sx={{ width: 1 }}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <DatePicker
                            label="Data sfarsit tratament"
                            timezone="Europe/Bucharest"
                            onChange={(value) => medicalJournalForm.setFieldValue("endDate", value, true)}
                            value={medicalJournalForm.values.endDate}
                            minDate={medicalJournalForm.values.startDate}
                            
                            slotProps={{
                                textField: {
                                    error: Boolean(medicalJournalForm.touched.endDate && medicalJournalForm.errors.endDate),
                                    helperText: medicalJournalForm.touched.endDate && medicalJournalForm.errors.endDate,
                                },
                            }}
                            sx={{ width: 1 }}
                        />
                    </Grid2>
                </Grid2>

            </LocalizationProvider>
            <FormikProvider value={medicalJournalForm}>
                <FieldArray
                    name="medicines"
                    render={(arrayHelpers) => (
                        <Box>
                            {medicalJournalForm.values.medicines.map((medicine, index) => (
                                <Grid2 container
                                    spacing={2}
                                    key={index}
                                    sx={{
                                        marginBottom: "1rem",
                                    }}
                                >

                                    <Grid2 size={6}>
                                        <PrimarySelector
                                            options={medicineOptions}
                                            value={medicineOptions.find(option => option.value === medicine.name)}
                                            placeholder="Selectează medicament"
                                            isLoading={isLoadingMedicamente}
                                            onChange={(newValue, actionMeta) => changeMedicineValue(newValue, actionMeta, index)}
                                            index={index}
                                            preText="Medicament"
                                            isError={medicalJournalForm.touched.medicines?.[index]?.name &&
                                                medicalJournalForm.errors.medicines?.[index]?.name}
                                        />

                                        {medicalJournalForm.touched.medicines?.[index]?.name &&
                                            medicalJournalForm.errors.medicines?.[index]?.name && (
                                                <div style={{ color: "red", fontSize: "0.8rem" }}>
                                                    {medicalJournalForm.errors.medicines[index].name}
                                                </div>
                                            )}
                                    </Grid2>
                                    <Grid2 size={2}>
                                        <PrimarySelector
                                            options={comprimateOptions}
                                            value={medicineOptions.find(option => option.value === medicine.quantity)}
                                            placeholder="Selectează cantitatea"
                                            onChange={(newValue, actionMeta) => changeMedicineQuantityValue(newValue, actionMeta, index)}
                                            index={index}
                                            preText="#"
                                            isError={medicalJournalForm.touched.medicines?.[index]?.quantity &&
                                                medicalJournalForm.errors.medicines?.[index]?.quantity}
                                        />
                                        {medicalJournalForm.touched.medicines?.[index]?.quantity &&
                                            medicalJournalForm.errors.medicines?.[index]?.quantity && (
                                                <div style={{ color: "red", fontSize: "0.8rem" }}>
                                                    {medicalJournalForm.errors.medicines[index].quantity}
                                                </div>
                                            )}
                                    </Grid2>
                                    <Grid2 size="grow" display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="text"
                                            color="error"

                                            onClick={() => arrayHelpers.remove(index)}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Șterge
                                        </Button>
                                    </Grid2>

                                </Grid2>
                            ))}
                            <Grid2 container>
                                <Grid2 size="grow">
                                    <Button
                                        variant="text"
                                        size="large"
                                        color="primary"
                                        onClick={() =>
                                            arrayHelpers.push({
                                                medicine: "",
                                                quantity: "",
                                            })
                                        }
                                        startIcon={<AddIcon />}
                                    >
                                        Adaugă Medicament
                                    </Button>
                                </Grid2>
                                <Grid2 size="auto">
                                    <Button size="large" disabled={!!Object.keys(medicalJournalForm.errors).length} type="submit" variant="contained" color="primary">
                                        Salvează
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </Box>
                    )}
                />
            </FormikProvider>
        </form>
    );
};