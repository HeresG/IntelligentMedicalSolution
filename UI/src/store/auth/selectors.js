
import { createSelector } from 'reselect'

export const authProfileSelector = createSelector(
    [state => state], 
    state => state.profile 
)

export const personalDataSelector = createSelector(
    [authProfileSelector], 
    state => state?.personal
)

