
import { createSelector } from 'reselect'

export const getInfoSelector = createSelector(
    [state => state], 
    state => state.info 
)

export const getAllCategories = createSelector(
    [getInfoSelector],
    state => state.categories ? state.categories : null
  );

export const getCategoryInfoByNameSelector = (categoryName) => createSelector(
    [getInfoSelector],
    state => state.categories ? state.categories[categoryName] || [] : []
  );
  