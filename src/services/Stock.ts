import { api } from "./api";

export function getProductFromStock(productId: number) {
  return api.get(`stock/${productId}`)
}

export function getProducs() {
  return api.get(`/products`)
}

export function getProduct(productId: number) {
  return api.get(`/products/${productId}`)
}