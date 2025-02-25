import { createContext, useContext, useReducer } from 'react';

const initialState = {
    historicalData: [],
    simulationResults: null,
    loading: false,
    error: null
};

export const StoreContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_HISTORICAL_DATA':
            return { ...state, historicalData: action.payload };
        case 'SET_SIMULATION_RESULTS':
            return { ...state, simulationResults: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};
