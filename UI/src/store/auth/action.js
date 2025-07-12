export const SET_AUTH_PROFILE = "SET_AUTH_PROFILE"
export const REMOVE_AUTH_PROFILE = "REMOVE_AUTH_PROFILE"
export const SET_PERSONAL_DATA = "SET_PERSONAL_DATA"
export const SET_AUTH_ROLE = 'SET_AUTH_ROLE'

export const setAuthProfile = (payload) => ({
    type: SET_AUTH_PROFILE,
    payload
})

export const removeAuthProfile = () => ({
    type: REMOVE_AUTH_PROFILE
})

export const setAuthPersonalData = (payload) => ({
    type: SET_PERSONAL_DATA,
    payload
})

export const setAuthProfileRole = (payload) => ({
    type: SET_AUTH_ROLE,
    payload
})