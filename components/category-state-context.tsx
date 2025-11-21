import { createContext, useContext, useState, ReactNode } from "react";

export type CategoryState = {
    category: string;
}

export type CategoryStateContextType = {
    category: CategoryState;
    setCategory: (category: string) => void;
}

type CategoryStateProviderProps = {
    children: ReactNode;
}

const CategoryStateContext = createContext<CategoryStateContextType | undefined>(undefined);

export function CategoryStateProvider({children} : CategoryStateProviderProps) {
    const [state, setState] = useState<CategoryState>({
        category: "st"
    });

    const setCategoryState = (category: string) => {
        setState((prevState) => ({...prevState, category: category}));
    }

    return (
        <CategoryStateContext.Provider value={{category: state, setCategory: setCategoryState}}>
            {children}
        </CategoryStateContext.Provider>
    );
}

export function useCategoryState() {
    const context = useContext(CategoryStateContext);
    if (!context) {
        throw new Error("useCategoryState must be used within CategoryStateProvider");
    }
    return context;
}