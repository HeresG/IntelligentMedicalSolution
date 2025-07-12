export const SET_UP_INITIAL_CATEGORIES = "SET_UP_INITIAL_CATEGORIES"
export const SET_UP_CATEGORY = "SET_UP_CATEGORY"


export const setInitialCategories = (payload) => ({
    type: SET_UP_INITIAL_CATEGORIES,
    payload
})

export const setUpCategory = ({categoryName, data}) => ({
    type: SET_UP_CATEGORY,
    payload: {
        categoryName,
        data
    }
})

