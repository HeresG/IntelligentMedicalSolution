
import { createSelector } from 'reselect'

export const getMedicalJournal = createSelector(
    [state => state], 
    state => state.journal 
)


export const getMedicamentation = createSelector(
    [getMedicalJournal],
    journal => journal.medicamentatie
)

export const getAnalyzes = createSelector(
    [getMedicalJournal],
    journal => journal?.analyzes || {categoriiMedicale: [], submitted: []}
)


export const getAnalyzeById = (analyzeId) => createSelector(
    [getAnalyzes],
    analyzes => analyzes?.submitted.find(a => a.id === analyzeId)
)



  