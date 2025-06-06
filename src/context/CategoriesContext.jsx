import { createContext } from "react";

export const CategoriesContext = createContext();

export default function CategoriesContextProvider({ children }) {
  return (
    <CategoriesContext.Provider value={{}}>
      {children}
    </CategoriesContext.Provider>
  );
}
