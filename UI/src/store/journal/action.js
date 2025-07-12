export const SET_INITIAL_MEDS = "SET_INITIAL_MEDS"
export const ADD_MED = "ADD_MED"
export const RESET_JOURNAL = "RESET_JOURNAL"
export const SET_ANALYZE_CATEGORIES = "SET_ANALYZE_CATEGORIES"
export const SET_INITIAL_ANALYSES = "SET_INITIAL_ANALYSES"
export const ADD_ANALYZE = "ADD_ANALYZE"
export const UPDATE_ANALYZE = "UPDATE_ANALYZE"


export const setInitialMeds = (payload) => ({
    type: SET_INITIAL_MEDS,
    payload
})

export const addMed = (payload) => ({
    type: ADD_MED,
    payload
})

export const resetJournal = () => ({
    type: RESET_JOURNAL
})


export const setAnalyzeCategories = (payload) => ({
    type: SET_ANALYZE_CATEGORIES,
    payload
})

export const setInitialAnalyzes = (payload) => ({
    type: SET_INITIAL_ANALYSES,
    payload
})

export const addAnalyze = (payload) => ({
    type: ADD_ANALYZE,
    payload
})

export const updateAnalyze = (payload) => ({
    type: UPDATE_ANALYZE,
    payload
})


