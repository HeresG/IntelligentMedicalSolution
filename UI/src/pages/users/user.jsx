import { useEffect, useState } from "react"
import api from "../../services/axiosConfig"
import { useMatches } from "react-router-dom"
import { PersonalDataForm } from "../../components/PersonalDataForm/PersonalDataForm"





export const User = () => {
  const route = useMatches(['/utilizatori/:userId']);
  const userId = route[route.length - 1]?.params?.userId;
  const [userData, setUserData] = useState(null)

  const handleSubmit = async (values) => {
      try {
      await api.put('/personal/user/' + userId, values)
      setUserData(values)      
      return "success"; 
    } catch (e) {
      throw new Error(e.message);
    }
  };


useEffect(() => {
  if (!userId) return;

  api(`/personal/user/${userId}`)
    .then(res => {
      setUserData(res.data.data)
    })

}
  , [userId])


return <PersonalDataForm datePersonale={userData} handleSubmit={handleSubmit} />

}
