import { createContext, useState } from "react";
import { toast } from "react-toastify";
import {
  CartContextData,
  CartProviderProps,
  Product,
  UpdateProductAmount,
} from "../types";
import { getProduct, getProductFromStock } from "services/Stock";
import { ROCKET_SHOES } from "storage";
export const CartContext = createContext<CartContextData>(
  {} as CartContextData
);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(ROCKET_SHOES);
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });


  const addProduct = async (productId: number) => {
    try {
      const { data: stock } = await getProductFromStock(productId);
      const stockAmount  = stock.amount;

      const newCart = [...cart];
      const index = newCart.findIndex(p => p.id === productId)

      if (index >= 0 && stockAmount <= newCart[index].amount) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if (index >= 0)
        newCart[index].amount++;
      else {
        const { data: product } = await getProduct(productId)
        newCart.push({ ...product, amount: 1 })
      }
      
      setCart(newCart)
      localStorage.setItem(ROCKET_SHOES, JSON.stringify(newCart));
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productIndex = cart.findIndex((p) => p.id === productId);
      if (productIndex >= 0) {
        let newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        localStorage.setItem(ROCKET_SHOES, JSON.stringify(newCart));
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return;
      }

      const { data } = await getProductFromStock(productId);
      const stockAmount = data.amount;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const updatedCart = [...cart];
      const productExists = updatedCart.find((p) => p.id === productId);

      if (productExists) {
        productExists.amount = amount;
        localStorage.setItem(ROCKET_SHOES, JSON.stringify(updatedCart));
        setCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}
