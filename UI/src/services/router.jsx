import { createBrowserRouter } from 'react-router-dom'
import { Login } from '../pages/login';
import { Dashboard } from '../pages/dashboard';
import { ProtectedRoutes } from '../components/ProtectedRoutes/ProtectedRoutes';
import { ProtectedLayout } from '../components/ProtectedLayout/ProtectedLayout';
import { Signup } from '../pages/signup';
import { UnprotectedLayout } from '../components/UnprotectedLayout/UnprotectedLayout';
import { DatePersonale } from '../pages/datePersonale';
import { Informatii } from '../pages/informatii/informatii';
import { Categorii } from '../pages/informatii/categorii';
import { Article } from '../pages/informatii/article';
import { Pacienti } from '../pages/pacienti/pacienti';
import { Users } from '../pages/users/users';
import { User } from '../pages/users/user';
import { Pacient } from '../pages/pacienti/pacient';
import { JurnalMedical } from '../pages/jurnalMedical/jurnalMedical';
import { Analiza } from '../pages/jurnalMedical/analiza';

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  CLIENT: 'CLIENT'
}

export const unprotectedRoutes = [
  {
    path: "/",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/signup",
    name: "Inregistrare",
    element: <Signup />,
  }
]

export const protectedRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    role: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.CLIENT],
    element: <Dashboard />
  },
  {
    path: "/date-personale",
    name: "Date Personale",    
    role: [USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.CLIENT],
    element: <DatePersonale />
  },
  {
    path: "/jurnal-medical",
    name: "Jurnal medical",
    role: [USER_ROLE.CLIENT],
    element: <JurnalMedical />,
    children: [
      {
        path: ":analyzeId",
        name: "Analiza",
        role: [USER_ROLE.CLIENT],
        element: <Analiza/>
      }
    ]
  },  
  {
    path: "/utilizatori",
    name: "Utilizatori",
    role: [USER_ROLE.ADMIN],
    element: <Users />,
    children: [
      {
        path: ":userId",
        name: "Utilizator",
        role: [USER_ROLE.ADMIN],
        element: <User />
      }
    ]
  },
  {
    path: "/pacienti",
    name: "Pacienti",
    role: [USER_ROLE.DOCTOR],
    element: <Pacienti />,
    children: [
      {
        path: ":clientId",
        name: "Pacient",
        role: [USER_ROLE.DOCTOR],
        element: <Pacient/>
      }
    ]
  },
  {
    path: "/informatii",
    name: "Informatii",
    element: <Informatii />,    
    role: [USER_ROLE.CLIENT, USER_ROLE.DOCTOR],
    compactNavigation: true,
    children: [
      {
        path: "categorii-boli",
        name: "Categorii Boli",
        role: [USER_ROLE.CLIENT, USER_ROLE.DOCTOR],
        element: <Categorii />,
        children: [
          {
            path: ":articleName",
            name: "Articol",
            role: [USER_ROLE.CLIENT, USER_ROLE.DOCTOR],
            element: <Article />
          }
        ]
      }
    ]
  }
]

const wrappedUnprotectedRoutes = unprotectedRoutes.map(route => ({
  ...route,
  element: <UnprotectedLayout>
    {route.element}
  </UnprotectedLayout>
}))

const wrappedProtectedRoutes = protectedRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoutes>
    <ProtectedLayout>
      {route.element}
    </ProtectedLayout>
  </ProtectedRoutes>,
}));

export const router = createBrowserRouter([...wrappedUnprotectedRoutes, ...wrappedProtectedRoutes]);