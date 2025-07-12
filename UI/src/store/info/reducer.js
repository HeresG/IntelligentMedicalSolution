import { associateBy, groupBy } from "../../utilities/helpers";
import { SET_UP_INITIAL_CATEGORIES } from "./action";
import { SET_UP_CATEGORY } from "./action";

const initialState = {
    categories: null,
};

const infoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_UP_INITIAL_CATEGORIES: {
            const associatedByName = associateBy(action.payload, item => item.name)
            return {
                ...state,
                categories: associatedByName
            }
        }
        case SET_UP_CATEGORY:
            const { categoryName, data } = action.payload
            return {
                ...state,
                categories: {
                    ...state.categories,
                    [categoryName]: data
                }
            }

        default:
            return state;
    }
};

export default infoReducer;
