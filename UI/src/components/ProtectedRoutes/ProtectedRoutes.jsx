import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../services/axiosConfig";
import { unprotectedRoutes } from "../../services/router";
import { useDispatch, useSelector } from "react-redux";
import { setAuthPersonalData, setAuthProfileRole } from "../../store/auth/action";
import { personalDataSelector } from "../../store/auth/selectors";
import { PersonalDataModal } from "../PersonalDataModal/PersonalDataModal";
import { GenericUtils } from "../../utilities/GenericUtils";


export const ProtectedRoutes = ({ children }) => {
    const [perm, setPerm] = useState(true);
    const [isPersonalDataModalOpen, setPersonalDataModalOpen] = useState(false)

    const location = useLocation();
    const dispatch = useDispatch();

    const personalDataAlreadySetup = useSelector(personalDataSelector)
    const unprotectedPaths = useMemo(() => unprotectedRoutes.map(route => route.path), [])

    useEffect(() => {
        if (unprotectedPaths.includes(location.pathname)) return;
        let ignore = false;

        const token = localStorage.getItem('token');
        api.get('/auth/verify-session').then(response => {
            if (!ignore && (response.status !== 200 || !token)) {
                setPerm(false)
            }
            return response.data.data
        })
            .then(data => {
                dispatch(setAuthProfileRole(data.role))
                if ((!personalDataAlreadySetup && GenericUtils.otherKeysExcept(data.personalData, "userId"))) {
                    dispatch(setAuthPersonalData(data.personalData))
                } else if (!GenericUtils.otherKeysExcept(data.personalData, "userId")) {
                    dispatch(setAuthPersonalData(data.personalData))
                    setPersonalDataModalOpen(true)
                }
            })
            .catch(_ => setPerm(false))

        return () => ignore = true
    }, [location])




    return perm ? <>
        <PersonalDataModal isOpen={isPersonalDataModalOpen} setModalOpen={setPersonalDataModalOpen} />
        {children}
    </> : <Navigate to="/" replace />;
}
