import * as React from "react";
import {
  Box,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  IconCoinsRegular,
  IconShoppingCartRegular,
  Inline,
  ResponsiveLayout,
  Row,
  RowList,
  Select,
  Stack,
  Tag,
  Text3,
  Text4,
  Text8,
} from '@telefonica/mistica'
import styles from "./NewCart.module.css";
import { useRouter } from "next/router";
import { CartProductType, ProductType } from "@/types/cart";

export default function NewCart() {
  const [currentSelectedProduct, setCurrentSelectedProduct] = React.useState("");
  const [cartProducts, setCartProducts] = React.useState<CartProductType[]>([]);
  const router = useRouter();

  const productsMock: ProductType[] = [
    {
      id: "1",
      brand: "Garoto",
      name: "Barra de chocolate Shot",
      description: "Barrinha doce bem boa com minduim",
      expirationDate: "2023/12/20",
      price: 3.99
    },
    {
      id: "2",
      brand: "Lacta",
      name: "Barra de chocolate Oreo",
      description: "Barrinha doce bem boa com minduim",
      expirationDate: "2023/12/20",
      price: 3.99
    }
  ]

  const handleAddProductToCart = () => {
    const productToAdd = productsMock.find(product => product.id === currentSelectedProduct);

    if (productToAdd) {
      const existingProductIndex = cartProducts.findIndex(cartProduct => cartProduct.product.id === currentSelectedProduct);
      if (existingProductIndex === -1) {
        setCartProducts([...cartProducts, { product: productToAdd, quantity: 1 }])
      } else {
        const allProducts = [...cartProducts];
        const productToUpdate = { ...allProducts[existingProductIndex] };
        productToUpdate.quantity++;
        allProducts[existingProductIndex] = productToUpdate;
        setCartProducts(allProducts);
      }
    }
  }

  const handleRemoveProductFromCart = (toRemoveProductId: string) => {
    const existingProductIndex = cartProducts.findIndex(cartProduct => cartProduct.product.id === toRemoveProductId);

    if (cartProducts[existingProductIndex].quantity > 1) {
      const allProducts = [...cartProducts];
      const productToUpdate = { ...allProducts[existingProductIndex] };
      productToUpdate.quantity--;
      allProducts[existingProductIndex] = productToUpdate;
      setCartProducts(allProducts);
    } else {
      const filteredArray = cartProducts.filter(cartProduct => cartProduct.product.id !== toRemoveProductId);
      setCartProducts(filteredArray);
    }
  }

  const handleAddNewCart = () => {
    router.push("/home");
  }

  const getFinalCartValue = (productsToSum: CartProductType[]) => {
    let finalValue = 0;
    productsToSum.forEach(productToSum => finalValue += (productToSum.product.price * productToSum.quantity));

    return finalValue;
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Text8><IconShoppingCartRegular size={40} /> Novo carrinho</Text8>
        <Box paddingTop={8}>
          <Text4 medium>Adicione produtos ao novo carrinho abaixo</Text4>
        </Box>
        <Box paddingTop={64}>
          <Inline alignItems="center" space={16}>
            <Select
              name="cart-product-addition"
              label="Escolha um..."
              options={productsMock.map(product => {
                return {
                  text: product.name,
                  value: product.id
                }
              })}
              onChangeValue={setCurrentSelectedProduct}
            />
            <ButtonPrimary onPress={handleAddProductToCart}>
              Adicionar produto
            </ButtonPrimary>
          </Inline>
        </Box>
        <Box paddingTop={32}>
          {cartProducts.length > 0
            &&
            <Tag type="success">
              Produtos
            </Tag>
          }
          <RowList>
            {cartProducts.map((cartProduct, index) => (
              <Row
                key={index}
                extra={
                  <Inline space="between">
                    <Stack space={0}>
                      <Text3 medium>{cartProduct.product.name}</Text3>
                      <Text3 medium color="#8F97AF">{cartProduct.product.description}</Text3>
                      <Text3 medium color="#8F97AF">Quantidade: {cartProduct.quantity}</Text3>
                    </Stack>
                    <ButtonDanger onPress={() => handleRemoveProductFromCart(cartProduct.product.id)}>
                      Remover
                    </ButtonDanger>
                  </Inline>
                }
              />
            ))}
          </RowList>
          {cartProducts.length > 0
            &&
            <Box paddingTop={24}>
              <Tag Icon={IconCoinsRegular} type="success">
                {`Valor total: R$${getFinalCartValue(cartProducts).toFixed(2).toString().replace(".", ",")}`}
              </Tag>
            </Box>
          }
        </Box>
        <Box paddingTop={80}>
          <Inline space={16}>
            <ButtonSecondary onPress={router.back}>
              Cancelar
            </ButtonSecondary>
            <ButtonPrimary disabled={cartProducts.length == 0} onPress={handleAddNewCart}>
              Criar carrinho
            </ButtonPrimary>
          </Inline>
        </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
