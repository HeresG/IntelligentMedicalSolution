import { useFormik } from "formik"
import { Box, Button, Checkbox, FormControlLabel, Grid2, InputAdornment, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material"
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HomeIcon from '@mui/icons-material/Home';
import { useMemo, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import * as Yup from 'yup';
import { displayGender } from "../../pages/datePersonale";

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

const mappedFormValueToRomanian = {
  cnp: 'Cod Numeric Personal',
  firstName: 'Prenume',
  lastName: 'Nume de familie',
  address: 'Adresa',
  phoneNumber: 'Număr de telefon',
  'details.fumator': 'Fumător',
  'details.sarcinaActiva': 'Sarcină activă',
  'details.diabet': 'Diabet',
  'details.nrSarciniAnterioare': 'Număr de sarcini anterioare'
};


const modifiedFields = (initialData = {}, modifiedData = {}, whichFields = []) => {
  const result = {};

  if (!initialData || !modifiedData) return result;

  whichFields.forEach((field) => {
    if (field.includes(".")) {
      const [parentKey, childKey] = field.split(".");
      const initial = initialData?.[parentKey]?.[childKey];
      const modified = modifiedData?.[parentKey]?.[childKey];
      if (initial !== modified) {
        result[field] = `${initial} -> ${modified}`;
      }
    } else {
      if (initialData[field] !== modifiedData[field]) {
        result[field] = `${initialData[field]} -> ${modifiedData[field]}`;
      }
    }
  });

  return result;
};



const initialValues = (datePersonale) => ({
  cnp: datePersonale?.cnp || "",
  firstName: datePersonale?.firstName || "",
  lastName: datePersonale?.lastName || "",
  address: datePersonale?.address || "",
  phoneNumber: datePersonale?.phoneNumber || "",
  details: {
    fumator: datePersonale?.details?.fumator || false,
    sarcinaActiva: datePersonale?.details?.sarcinaActiva || false,
    diabet: datePersonale?.details?.diabet || false,
    nrSarciniAnterioare: datePersonale?.details?.nrSarciniAnterioare || 0,
  }
})

export const PersonalDataForm = ({ datePersonale, handleSubmit }) => {
  const [isConfirming, setConfirming] = useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues(datePersonale),
    validationSchema,
    onSubmit: async (values) => {
      try {
        await handleSubmit(values)
      } catch (error) {
        formik.setValues(initialValues(datePersonale))
        console.error(error?.message)
      }
      finally { setConfirming(false) }
    },
  })


  const memoizedChangedFields = useMemo(() => {
    return modifiedFields(initialValues(datePersonale), formik.values, [
      "cnp",
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
      "details.fumator",
      "details.sarcinaActiva",
      "details.diabet",
      "details.nrSarciniAnterioare"
    ]);
  }, [formik.values, datePersonale]);



  const handleClose = () => {
    formik.setValues(initialValues(datePersonale))
    setConfirming(false)
  }


  const isSubmitDisabled = Boolean(Object.keys(memoizedChangedFields)) ? Object.keys(formik.errors).length !== 0 || !Object.keys(memoizedChangedFields).length : true;

  return (
    <>

      <ConfirmationModal title="Doriti sa modificati urmatoarele date cu caracter personal?" isOpen={isConfirming} handleClose={handleClose} handleConfirm={formik.submitForm} >
        <List>
          {Object.entries(memoizedChangedFields).map(([field, change]) => {
            const [oldValue, newValue] = change.split(" -> ");
            const displayOld = oldValue === "true" ? "Da" : oldValue === "false" ? "Nu" : oldValue;
            const displayNew = newValue === "true" ? "Da" : newValue === "false" ? "Nu" : newValue;

            return (
              <ListItem key={uuidv4()}>
                <ListItemText
                  primary={`${mappedFormValueToRomanian[field] || field}: ${displayOld} → ${displayNew}`}
                />
              </ListItem>
            );
          })}
        </List>

      </ConfirmationModal>



      <form>
        <Grid2 container columnGap={2}>
          <Grid2 size={{
            xs: 12,
            md: 7
          }}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>

              <TextField
                label="Nume de familie"
                variant="outlined"
                placeholder='Nume de familie'
                fullWidth
                sx={{ mt: 0 }}
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
              /></Paper>
          </Grid2>
          <Grid2 size={{
            xs: 12,
            md: "grow"
          }}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#fff' }}>

              <Typography variant="body2">Detalii </Typography>
              <Grid2 container rowSpacing={2}>
                <Grid2 size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...formik.getFieldProps('details.fumator')}
                        checked={Boolean(formik.values.details.fumator)}
                      />
                    }
                    label="Fumător"
                  />
                </Grid2>
                {displayGender(datePersonale?.cnp) == "F" && <Grid2 size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...formik.getFieldProps('details.sarcinaActiva')}
                        checked={Boolean(formik.values.details.sarcinaActiva)}
                      />
                    }
                    label="Sarcină activă"
                  />
                </Grid2>}
                <Grid2 size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...formik.getFieldProps('details.diabet')}
                        checked={Boolean(formik.values.details.diabet)}
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
            </Paper>
          </Grid2>
        </Grid2>

        <Button type="button" onClick={() => setConfirming(true)} disabled={isSubmitDisabled} fullWidth size='large' variant='contained' color='primary' sx={{ marginTop: 2 }}>Modifica datele</Button>
      </form>
    </>
  )
}
