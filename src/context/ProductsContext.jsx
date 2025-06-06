import { createContext } from "react";

export const ProductsContext = createContext();

export default function ProductsContextProvider({ children }) {
  return (
    <ProductsContext.Provider value={{}}>{children}</ProductsContext.Provider>
  );
}
