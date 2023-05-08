import { useContext } from "react";
import { CartContext } from "context/CartContext";
import { CartContextData } from "types";

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}