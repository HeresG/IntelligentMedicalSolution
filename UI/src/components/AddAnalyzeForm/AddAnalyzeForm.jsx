import { FieldArray, FormikProvider, useFormik } from 'formik'
import { Box, Button, Grid2, IconButton, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import api from '../../services/axiosConfig';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyzes } from '../../store/journal/selectors';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PrimarySelector } from '../PrimarySelector/PrimarySelector';
import { convertManyToLabelAndValue } from '../../utilities/convertors';
import { addAnalyze, setAnalyzeCategories } from '../../store/journal/action';
import { useCallback } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import BackupIcon from '@mui/icons-material/Backup';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import * as Yup from "yup";

const steps = [
    'Date initiale',
    'Institutia si doctorul',
    'Diagnostic',
    'Adauga fisiere',
    'Finalizare'
];

dayjs.extend(utc);
dayjs.extend(timezone);


const createAnalyzeValidationSchema = (categoriiMedicale = []) => {
    return Yup.object().shape({
        testingDate: Yup.date()
            .required("Data analizei este obligatorie"),
        analyzeTitle: Yup.string()
            .required("Titlul analizei este obligatoriu"),
        institution: Yup.string()
            .required("Instituția este obligatorie"),

        doctor: Yup.string().nullable().trim(),
        notes: Yup.string().nullable().trim(),
        file: Yup.mixed().nullable(),

        categories: Yup.array()
            .of(
                Yup.object().shape({
                    name: Yup.string().required("Numele categoriei este obligatoriu"),

                    parameters: Yup.array()
                        .of(
                            Yup.object().shape({
                                name: Yup.string().required("Numele parametrului este obligatoriu"),
                                value: Yup.number()
                                    .typeError("Valoarea trebuie să fie un număr")
                                    .test(
                                        "in-range",
                                        "Valoarea parametrului nu este în intervalul permis",
                                        function (val) {
                                            const { path, createError } = this;
                                            const categoryName = this?.from?.[1]?.value?.name;
                                            const paramName = this?.parent?.name;
                                            const category = categoriiMedicale.find(cat => cat.name === categoryName);
                                            const paramDef = category?.parameters?.find(p => p.name === paramName);

                                            if (!paramDef || val == null) return true; // skip validation

                                            const isValid = val >= paramDef.min_val && val <= paramDef.max_val;

                                            return isValid || createError({
                                                path,
                                                message: `${paramDef.min_val} - ${paramDef.max_val}`
                                            });
                                        }
                                    )
                            })
                        )
                        .min(1, "Fiecare categorie trebuie să aibă cel puțin un parametru")
                })
            )
            .min(1, "Trebuie să selectezi cel puțin o categorie")
    });
};


export const AddAnalyzeForm = () => {
    const dispatch = useDispatch();
    const { categoriiMedicale } = useSelector(getAnalyzes);
    const [currentStep, setCurrentStep] = useState(0);

    const analyzesForm = useFormik({
        initialValues: {
            testingDate: null,
            analyzeTitle: "",
            institution: "",
            doctor: "",
            categories: [],
            file: null,
            notes: ""
        },
        validationSchema: createAnalyzeValidationSchema(categoriiMedicale),
        onSubmit: async (values) => {
            try {
                // Prepare form data for submission
                const formData = new FormData();
                formData.append("testingDate", values.testingDate);
                formData.append("analyzeTitle", values.analyzeTitle);
                formData.append("institution", values.institution);
                formData.append("doctor", values.doctor);
                formData.append("notes", values.notes);
                formData.append("categories", JSON.stringify(values.categories));
                formData.append("file", values.file);

                api.post("/analize", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(res => {


                        dispatch(addAnalyze(res.data))
                    })

                    .catch(err => {
                        console.error("Error submitting analyze:", err);
                    });


            } catch (error) {
                console.error("Error submitting analyze form:", error);
            }

        }
    })

    const initiateFirstCategory = useCallback((categoryWithOneParameter) => {
        const parameters = [{
            name: categoryWithOneParameter?.parameters[0]?.name || "",
            value: categoryWithOneParameter?.parameters[0]?.min_val || 0
        }]

        analyzesForm.setFieldValue("categories", [
            {
                name: categoryWithOneParameter.name,
                parameters
            }
        ]);
    }, [categoriiMedicale])

    useEffect(() => {
        api("/analize/categorii")
            .then(res => {

                dispatch(setAnalyzeCategories(res.data));

                const categoryWithOneParameter = res.data.find(cat => cat?.parameters?.length > 0);

                if (!!categoryWithOneParameter) {
                    initiateFirstCategory(categoryWithOneParameter);
                }


            })
            .catch(err => {
                console.error("Error fetching medical categories:", err);
            })
    }, [])


    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "application/pdf": [".pdf"]
        },
        onDrop: (acceptedFiles) => {
            analyzesForm.setFieldValue("file", acceptedFiles[0]);
        },
    });

    const handleAnalyzeChange = (e) => {
        analyzesForm.setFieldValue("notes", e.target.value)
    }

    const handleDeleteFile = (e) => {
        analyzesForm.setFieldValue("file", null)
    }

    const handleNextStep = () => {
        if (currentStep >= steps.length - 2) return;
        setCurrentStep((prev) => prev + 1)
    }

    const handlePrevStep = () => {
        if (currentStep === 0) return;
        setCurrentStep((prev) => prev - 1)
    }

    const handleSubmit = () => {
        analyzesForm.handleSubmit();
        setCurrentStep(prev => prev + 1);
    }

    const isNextButtonDisabled = () => {
        const titleError = analyzesForm.errors?.analyzeTitle;
        const testingDateError = analyzesForm.errors?.testingDate;
        const institutionError = analyzesForm.errors?.institution;
        const categoryError = analyzesForm.errors?.categories;


        if (currentStep === 0 && (titleError || testingDateError)) {
            return true;
        }

        if (currentStep === 1 && institutionError) {
            return true;
        }

        if (currentStep === 2 && categoryError) {
            return true;
        }

        return false
    }


    const changeAnalyzeCategory = (newValue, actionMeta, categoryIndex) => {
        if (actionMeta.action !== 'select-option') return
        analyzesForm.setFieldValue(`categories[${categoryIndex}].name`, newValue.value)
        const parameters = categoriiMedicale.find(cat => cat.name === newValue.value)?.parameters || [];

        const newParameters = parameters.length > 0 ? [{
            name: parameters[0]?.name || "",
            value: parameters[0]?.min_val || 0,
        }] : []

        analyzesForm.setFieldValue(`categories[${categoryIndex}].parameters`, newParameters)
    }

    const changeAnalyzeParameter = (newValue, actionMeta, index, paramIndex) => {
        if (actionMeta.action !== 'select-option') return
        analyzesForm.setFieldValue(`categories[${index}].parameters[${paramIndex}].name`, newValue.value)

        const categoryName = analyzesForm.values.categories[index]?.name || "";
        
        const parameters = categoriiMedicale.find(cat => cat.name === categoryName)?.parameters || [];

        const min_value = parameters.find(p => p.name === newValue.value)?.min_val || 0;


        analyzesForm.setFieldValue(`categories[${index}].parameters[${paramIndex}].value`, min_value)

    }


    const remainingParametersForCategoryIndex = (categoryName) => {
        const allPossibleParameters = categoriiMedicale.find(cat => cat.name === categoryName)?.parameters || [];
        const alreadySelectedParameters = analyzesForm.values.categories.find(cat => cat.name === categoryName)?.parameters || [];
        return allPossibleParameters.filter(param => !alreadySelectedParameters.some(p => p.name === param.name));
    }

    const handleAddCategory = () => {
        const addedCategories = analyzesForm.values.categories.map(cat => cat.name);
        const remainingCategories = categoriiMedicale.filter(cat => !addedCategories.includes(cat.name));

        if (remainingCategories.length > 0) {

            analyzesForm.setFieldValue("categories", [
                ...analyzesForm.values.categories,
                {
                    name: remainingCategories[0].name,
                    parameters: !!remainingCategories[0].parameters.length ? [{
                        name: remainingCategories[0].parameters[0]?.name || "",
                        value: remainingCategories[0].parameters[0]?.min_val || 0,
                    }] : []
                }
            ]);

        }
    }

    const handleDeleteCategory = (categoryName) => {
        const updatedCategories = analyzesForm.values.categories.filter(cat => cat.name !== categoryName);
        if (updatedCategories.length >= 1) {
            analyzesForm.setFieldValue("categories", updatedCategories);
        }
    }

    const handleAddParameterToCategory = (categoryName) => {
        const remainingParameters = remainingParametersForCategoryIndex(categoryName);

        if (remainingParameters.length > 0) {
            const parameters = {
                name: remainingParameters[0].name,
                value: remainingParameters[0].min_val || 0,
            }
            const categoryIndex = analyzesForm.values.categories.findIndex(cat => cat.name === categoryName);
            analyzesForm.setFieldValue(`categories[${categoryIndex}].parameters`, [
                ...analyzesForm.values.categories[categoryIndex].parameters,
                parameters
            ]);
        }
    }


    const handleDeleteParameter = (categoryName, paramName) => {
        const categoryIndex = analyzesForm.values.categories.findIndex(cat => cat.name === categoryName);
        const updatedParameters = analyzesForm.values.categories[categoryIndex].parameters.filter(param => param.name !== paramName);
        if (updatedParameters.length >= 1) {
            analyzesForm.setFieldValue(`categories[${categoryIndex}].parameters`, updatedParameters);
        }
    }

    return (
        <form>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Stepper activeStep={currentStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
                {currentStep === 0 &&
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                {...analyzesForm.getFieldProps("analyzeTitle")}
                                label="Titlul analizei"
                                variant="outlined"

                                error={analyzesForm.touched.analyzeTitle && Boolean(analyzesForm.errors.analyzeTitle)}
                                helperText={analyzesForm.touched.analyzeTitle && analyzesForm.errors.analyzeTitle}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data analizei"
                                    timezone="Europe/Bucharest"
                                    onChange={(value) => analyzesForm.setFieldValue("testingDate", value, true)}
                                    value={analyzesForm.values.testingDate}
                                    maxDate={dayjs()}
                                    slotProps={{
                                        textField: {
                                            error: Boolean(analyzesForm.touched.testingDate) && Boolean(analyzesForm.errors.testingDate),
                                            helperText: Boolean(analyzesForm.touched.testingDate) && analyzesForm.errors.testingDate,
                                            onBlur: (cv) => analyzesForm.setFieldTouched("testingDate", true, true),
                                            name: 'testingDate'
                                        },
                                    }}
                                    sx={{ width: 1 }}
                                />
                            </LocalizationProvider>
                        </Grid2>
                    </Grid2>
                }
                {currentStep === 1 &&
                    <Grid2 container spacing={2}>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                {...analyzesForm.getFieldProps("institution")}
                                label="Institutia medicala"
                                variant="outlined"
                                error={analyzesForm.touched.institution && Boolean(analyzesForm.errors.institution)}
                                helperText={analyzesForm.touched.institution && analyzesForm.errors.institution}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextField
                                fullWidth
                                {...analyzesForm.getFieldProps("doctor")}
                                label="Numele doctorului"
                                variant="outlined"
                            />
                        </Grid2>
                    </Grid2>
                }
                {currentStep === 2 &&
                    <Grid2 container spacing={2}>
                        <FormikProvider value={analyzesForm}>
                            <FieldArray name="categories" render={(arrayHelpers) => {
                                const remainingParameters = categoriiMedicale.filter(category => !analyzesForm.values?.categories.some(selected => selected.name === category.name))
                                const possibleCategories = convertManyToLabelAndValue(remainingParameters, "name") || [];
                                const categoriesOptions = convertManyToLabelAndValue(analyzesForm.values?.categories, "name") || []

                                return analyzesForm.values.categories.map((category, index) => (
                                    <Grid2 key={`category-${category.name}`} size={12} sx={{
                                        border: "1px solid rgba(0, 0, 0, 0.16)",
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                        p: 2,
                                        borderRadius: 2,
                                        m: 0
                                    }}>
                                        <Grid2 container direction="column" spacing={2}>
                                            <Grid2 size={12}>
                                                <Grid2 container alignItems="center" justifyContent="space-between">
                                                    <Grid2 size="grow">
                                                        <PrimarySelector
                                                            options={possibleCategories}
                                                            value={categoriesOptions.find(cat => cat.value === category.name)}
                                                            onChange={(newValue, actionMeta) => changeAnalyzeCategory(newValue, actionMeta, index)}
                                                            label="Selecteaza o categorie medicala"
                                                            key={index}
                                                        />
                                                    </Grid2>
                                                    <Grid2 size="auto">
                                                        <IconButton disabled={analyzesForm.values.categories.length <= 1} color="error" onClick={() => handleDeleteCategory(category.name)}>
                                                            <ClearIcon />
                                                        </IconButton>
                                                    </Grid2>
                                                </Grid2>

                                            </Grid2>
                                            <Grid2 size={12}>
                                                {category?.parameters.map((parameter, paramIndex) => {
                                                    const allPossibleParameters = categoriiMedicale.find(cat => cat.name === category.name)?.parameters || [];

                                                    const alreadySelectedParameters = analyzesForm.values.categories.find(cat => cat.name === category.name)?.parameters || [];

                                                    const remainingParameters = allPossibleParameters.filter(param => !alreadySelectedParameters.some(p => p.name === param.name));

                                                    const possibleOptions = allPossibleParameters.map(p => ({ label: p.ro_l18n, value: p.name })) || [];
                                                    const parameterOptions = remainingParameters.map(p => ({ label: p.ro_l18n, value: p.name })) || []

                                                    const { min_val, max_val, unit } = allPossibleParameters.find(param => param.name === parameter.name) || { min_val: 0, max_val: 0, unit: "N/A" };
                                                    return (
                                                        <Grid2 key={`category-${category.name}-parameter-${parameter.name}`} container alignItems="center" columnGap={2} justifyContent="space-between" sx={{ mb: paramIndex === category.parameters.length - 1 ? 0 : 1 }}>
                                                            <Grid2 size={5}>
                                                                <PrimarySelector
                                                                    options={parameterOptions}
                                                                    value={possibleOptions.find(param => param.value === parameter.name)}
                                                                    onChange={(newValue, actionMeta) => changeAnalyzeParameter(newValue, actionMeta, index, paramIndex)}
                                                                    label="Selecteaza o categorie medicala"
                                                                    key={paramIndex}
                                                                />
                                                            </Grid2>
                                                            <Grid2 size="grow">
                                                                <Typography variant='body2' textAlign="right" color={
                                                                    (!!analyzesForm.touched?.categories?.[index]?.parameters?.[paramIndex]?.value && Boolean(analyzesForm.errors?.categories?.[index]?.parameters?.[paramIndex]?.value)) &&
                                                                    "error"
                                                                }>
                                                                    Min: {min_val} - Max: {max_val}
                                                                </Typography>
                                                            </Grid2>
                                                            <Grid2 size={2}>
                                                                <TextField
                                                                    fullWidth
                                                                    type="number"
                                                                    {...analyzesForm.getFieldProps(`categories[${index}].parameters[${paramIndex}].value`)}
                                                                    label="Valoare"
                                                                    variant="outlined"
                                                                    InputProps={{
                                                                        sx: {
                                                                            color: Boolean(analyzesForm.errors?.categories?.[index]?.parameters?.[paramIndex]?.value) && "red"
                                                                        },
                                                                    }}
                                                                    error={analyzesForm.touched?.categories?.[index]?.parameters?.[paramIndex]?.value && Boolean(analyzesForm.errors?.categories?.[index]?.parameters?.[paramIndex]?.value)}
                                                                />
                                                            </Grid2>

                                                            <Grid2 size={1}>
                                                                <Typography variant='body2'>
                                                                    {unit}
                                                                </Typography>
                                                            </Grid2>

                                                            <Grid2 size="auto">
                                                                <IconButton disabled={allPossibleParameters.length - 1 === remainingParameters.length} color="error" onClick={() => handleDeleteParameter(category.name, parameter.name)}>
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </Grid2>

                                                        </Grid2>
                                                    )
                                                })}
                                            </Grid2>
                                            {!Array.isArray(analyzesForm.errors.categories?.[index]?.parameters) &&
                                                <Typography color="error">{analyzesForm.errors.categories?.[index]?.parameters}</Typography>
                                            }
                                            {remainingParametersForCategoryIndex(category.name).length > 0 &&
                                                <Grid2 size="grow">
                                                    <Button sx={{ m: 0, p: 0 }} onClick={() => handleAddParameterToCategory(category.name)}>Adauga parametru</Button>
                                                </Grid2>
                                            }

                                        </Grid2>
                                    </Grid2>
                                ))
                            }

                            } />
                        </FormikProvider>
                        {analyzesForm.values.categories.length !== categoriiMedicale.length && <Grid2 size={12}>
                            <Button variant="outlined" onClick={handleAddCategory}>
                                Adauga o noua categorie
                            </Button>
                        </Grid2>}
                    </Grid2>
                }
                {currentStep === 3 &&
                    <Grid2 container spacing={2} size={{ maxWidth: 800, margin: '0 auto' }}>
                        <Grid2 size={6}>
                            <textarea onChange={handleAnalyzeChange} style={{
                                height: 200,
                                width: '100%',
                                border: "2px solid #00B4D8",
                                maxHeight: '100%',
                                borderRadius: '8px',
                                maxWidth: '100%',
                                fontSize: '14px',
                                fontFamily: 'Roboto, sans-serif',
                                backgroundColor: "#fffffc9",
                                // borderRadius: '5px'
                            }} placeholder='Adauga detalii...' />

                        </Grid2>
                        <Grid2 size={6}>
                            {analyzesForm.values.file ? <Box sx={{
                                height: 200,
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '8px',
                                justifyContent: 'center',
                                border: (theme) => `2px dashed ${theme.palette.primary.main}`,
                                overflow: "hidden",
                                textAlign: "center",
                                columnGap: '2em',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: "center",
                                    boxShadow: '0px 10px 4px 0px #00000010'
                                }}>
                                    <Box sx={{
                                        top: '50%',
                                        left: '50%',
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)',
                                    }}>
                                        <AttachFileIcon sx={{ fontSize: '200px', width: '70%', height: '70%', color: '#90909020' }} />
                                    </Box>
                                    <Typography variant='body1' fontWeight={500}>{analyzesForm.values.file.name}</Typography>
                                    <Button variant="text" sx={{ mt: 2 }} size="large" color="error" onClick={handleDeleteFile} startIcon={<DeleteIcon />}>
                                        Sterge
                                    </Button>
                                </Box>
                            </Box> :
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: (theme) => `2px dashed ${theme.palette.primary.main}`,
                                        padding: "20px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        borderRadius: '5px',
                                        position: 'relative',
                                        transition: ".1s",
                                        "&:hover": {
                                            transition: ".1s",
                                            backgroundColor: "#00000007",
                                            textDecoration: "underline"
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        top: '50%',
                                        left: '50%',
                                        position: 'absolute',
                                        transform: 'translate(-50%, -50%)',

                                    }}>
                                        <BackupIcon sx={{ fontSize: '200px', width: 200, height: 200, color: '#90909020' }} />
                                    </Box>
                                    <input {...getInputProps()} id="file" name="file" type="file" />

                                    <Typography>Incarca fisier PDF</Typography>

                                </Box>
                            }
                        </Grid2>
                    </Grid2>
                }
                {currentStep === 4 && <Grid2 container spacing={1} size={{ maxWidth: 800, margin: '0 auto' }}>
                    <Grid2 size={12}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Box sx={{
                                backgroundColor: theme => theme.palette.primary.main,
                                height: '80px',
                                width: '80px',
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "99px"
                            }}>

                                <DoneIcon sx={{
                                    fontSize: "50px",
                                    color: "#fff"
                                }} />

                            </Box>
                        </Box>
                    </Grid2>
                    <Grid2 size={12} sx={{ m: 0 }}>
                        <Typography sx={{ m: 0 }} align='center' variant='h6'>Analiza a fost adaugata cu succes!</Typography>
                    </Grid2>
                    <Grid2 size={12} sx={{ m: 0 }}>
                        <Typography sx={{ m: 0 }} align="center" variant='body1'>Pentru a afla statusul analizei, te rugam sa vezi chenarul numit "Analizele mele" din partea de jos al paginii</Typography>
                    </Grid2>
                </Grid2>}
                {currentStep !== steps.length - 1 && <Grid2 direction="row" alignItems="center" justifyContent="center" container sx={{ mt: 2 }} columnGap={2}>
                    {currentStep !== 0 && <Button variant="contained" color='primary' onClick={handlePrevStep}>Inapoi</Button>}
                    {
                        currentStep < steps.length - 2 ?
                            <Button disabled={isNextButtonDisabled()} variant="contained" color='primary' onClick={handleNextStep}>Inainte</Button> :
                            <Button variant="contained" color='primary' onClick={handleSubmit}>Finalizare</Button>
                    }
                </Grid2>}

            </Box>
        </form>

    )
}





