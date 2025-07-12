import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './services/router'
import { Provider } from 'react-redux'
import store from './store/store'
import { ThemeProvider } from '@emotion/react'
import theme from './services/theme'

import '@fontsource/poppins/300.css';  
import '@fontsource/poppins/400.css'; 
import '@fontsource/poppins/500.css'; 
import '@fontsource/poppins/600.css';  
import '@fontsource/poppins/700.css'; 




const App = () => {
  return (<Provider store={store}>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>)
}

export default App
