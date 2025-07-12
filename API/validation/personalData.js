import * as Yup from 'yup';

export const personalDataSetupSchema = Yup.object().shape({
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
    .required('Numărul de telefon este obligatoriu'),

  details: Yup.object({
    fumator: Yup.boolean().required('Trebuie să specificați dacă este fumător'),
    sarcinaActiva: Yup.boolean().required('Trebuie să specificați dacă sarcina este activă'),
    diabet: Yup.boolean().required('Trebuie să specificați dacă are diabet'),
  }).required('Detaliile personale sunt obligatorii'),
});
