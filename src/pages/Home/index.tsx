import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { formatPrice } from 'util/format';
import { useCart } from 'hooks/useCart';
import { CartItemsAmount, ProductFormatted } from 'types';
import { getProducs } from 'services/Stock';
import { toast } from 'react-toastify';




const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount}
    newSumAmount[product.id] = product.amount
    return newSumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      try {
        const {data} = await getProducs()  
        const formattedData = data?.map((p: ProductFormatted) => ({...p, priceFormatted: formatPrice(p.price)}))
        setProducts(formattedData)
      } catch (error) {
        toast.error('Erro ao carregar produtos')
      }
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map((product, index) => 
        <li key={index}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0} 
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>)}
    </ProductList>
  );
};

export default Home;