import { SET_INITIAL_MEDS, RESET_JOURNAL, ADD_MED, SET_ANALYZE_CATEGORIES, SET_INITIAL_ANALYSES, ADD_ANALYZE, UPDATE_ANALYZE    } from './action'

const initialState = {
    medicamentatie: {
        activeMeds: [],
        retroMeds: []
    },

    analyzes: {
        categoriiMedicale: [],
        submitted: []
    }
};

export const splitMedsBasedOnDate = (meds) => {
    const activeMeds = [];
    const retroMeds = [];

    meds.forEach(med => {
        const currentDateTime = new Date();
        if (new Date(med.endDate) < currentDateTime) {
            retroMeds.push(med);
        } else {
            activeMeds.push(med);
        }
    })

    return { activeMeds, retroMeds }
}



const journalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_INITIAL_MEDS: {
            const { activeMeds, retroMeds } = splitMedsBasedOnDate(action.payload);
            
            return {
                ...state,
                medicamentatie: {
                    ...state.medicamentatie,
                    activeMeds: [...activeMeds],
                    retroMeds: [...retroMeds],
                },
            }
        }

        case ADD_MED: {
            const med = action.payload;
            
            const { activeMeds, retroMeds } = splitMedsBasedOnDate([med])
            return {
                ...state,
                medicamentatie: {
                    ...state.medicamentatie,
                    activeMeds: activeMeds.length ? [activeMeds[0], ...state.medicamentatie.activeMeds] : state.medicamentatie.activeMeds,
                    retroMeds: retroMeds.length ? [retroMeds[0], ...state.medicamentatie.retroMeds] : state.medicamentatie.retroMeds
                }
            }

        }

        case RESET_JOURNAL: {
            return initialState;
        }

        case SET_ANALYZE_CATEGORIES: {
            return {
                ...state,
                analyzes: {
                    ...state.analyzes,
                    categoriiMedicale: action.payload
                }
            }
        }

        case SET_INITIAL_ANALYSES: {
            return {
                ...state,
                analyzes: {
                    ...state.analyzes,
                    submitted: action.payload
                }
            }
        }

        case ADD_ANALYZE: {
            return {
                ...state,
                analyzes: {
                    ...state.analyzes,
                    submitted: [action.payload, ...state.analyzes.submitted]

                }
            }
        }

        case UPDATE_ANALYZE:{
            const analyzeId = action.payload.id;
            if(!analyzeId){
                return state;
            }

            const analyzeIndex = state.analyzes.submitted.findIndex(a => a.id === analyzeId);
            if(analyzeIndex === -1){
                return state;
            }

            const allAnalyzes = state.analyzes.submitted;

            const newSubmitted = [
                ...allAnalyzes.slice(0, analyzeIndex),
                {...state.analyzes.submitted[analyzeIndex], ...action.payload},
                ...allAnalyzes.slice(analyzeIndex + 1)
            ]

            return {
                ...state,
                analyzes:{
                    ...state.analyzes,
                    submitted: newSubmitted
                }
            }

        }


        default:
            return state;
    }
};

export default journalReducer;
