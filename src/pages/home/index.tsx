import * as React from "react";
import { 
  Box, 
  ButtonDanger, 
  ButtonPrimary, 
  ButtonSecondary, 
  IconAppsFilled,
  IconCoinsRegular, 
  IconLogoutRegular, 
  IconShoppingCartRegular, 
  IconStatusChartRegular, 
  IconUserAccountRegular, 
  Inline,
  ResponsiveLayout, 
  Stack, 
  Tag, 
  Text1, 
  Text2, 
  Text6, 
  Text8,
  confirm, 
} from '@telefonica/mistica'
import styles from "./Home.module.css";
import { useRouter } from "next/router";
import { CartType, CartProductType } from "@/types/cart";

export default function Home() {
  const router = useRouter();
  const myCarts: CartType[] = [
    {
      id: "1",
      finalPrice: 1000,
      userId: "3",
      createdAt: "2023/04/15",
      status: "P",
      addedProducts: [
        { 
          product: {
            id: "1",
            brand: "Garoto",
            name: "Barra de chocolate Shot",
            description: "Barrinha doce bem boa com minduim",
            expirationDate: "2023/12/20",
            price: 3.99
          },
          quantity: 1
        }
      ]
    },
    {
      id: "2",
      finalPrice: 2000,
      userId: "3",
      createdAt: "2023/04/15",
      status: "B",
      addedProducts: [
        { 
          product: {
            id: "1",
            brand: "Garoto",
            name: "Barra de chocolate Shot",
            description: "Barrinha doce bem boa com minduim",
            expirationDate: "2023/12/20",
            price: 3.99
          },
          quantity: 4
        },
        { 
          product: {
            id: "1",
            brand: "Garoto",
            name: "Barra de chocolate Shot",
            description: "Barrinha doce bem boa com minduim",
            expirationDate: "2023/12/20",
            price: 3.99
          },
          quantity: 2
        }
      ]
    },
    {
      id: "2",
      finalPrice: 2000,
      userId: "3",
      createdAt: "2023/04/15",
      status: "E",
      addedProducts: [
        { 
          product: {
            id: "1",
            brand: "Garoto",
            name: "Barra de chocolate Shot",
            description: "Barrinha doce bem boa com minduim",
            expirationDate: "2023/12/20",
            price: 3.99
          },
          quantity: 6
        }
      ]
    },
  ];

  const getFinalCartValue = (productsToSum: CartProductType[]) => {
    let finalValue = 0;
    productsToSum.forEach(productToSum => finalValue += (productToSum.product.price * productToSum.quantity));

    return finalValue;
  }

  const handleRemoveProductFromCart = (toRemoveProductId: string, cartId: string) => {
    // const iterableCart = myCarts.find(myCart => myCart.id === cartId);
    // const existingProductIndex = iterableCart?.addedProducts.findIndex(cartProduct => cartProduct.product.id === toRemoveProductId);

    // if(existingProductIndex && iterableCart){
    //   if(iterableCart.addedProducts[existingProductIndex].quantity > 1) {
    //     const allProducts = [...iterableCart.addedProducts];
    //     const productToUpdate = {...allProducts[existingProductIndex]};
    //     productToUpdate.quantity--;
    //     allProducts[existingProductIndex] = productToUpdate;
    //   }else {
    //     const filteredArray = iterableCart.addedProducts.filter(cartProduct => cartProduct.product.id !== toRemoveProductId);
    //     setCartProducts(filteredArray);
    //   }
    // }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Text8><IconAppsFilled size={40} /> Minhas compras</Text8>
        <Box paddingBottom={48} paddingTop={12}>
          <Inline space="between">
            <Inline space={16}>
              <ButtonPrimary onPress={() => {router.push("new-cart")}}>
                + Novo Carrinho
              </ButtonPrimary>
              <ButtonPrimary onPress={() => {router.push("new-product")}}>
                + Novo Produto
              </ButtonPrimary>
            </Inline>
            <ButtonSecondary onPress={() => {router.replace("/")}}>
                <IconLogoutRegular />
                <Text2 regular>Logout</Text2>
            </ButtonSecondary>
          </Inline>
        </Box>
        <Box className={styles.tablesContainer}>
          {myCarts && myCarts.length > 0 
            ?
            myCarts.map((cart: CartType, index: React.Key) => (
              <Box key={index} paddingBottom={64}>
                <Box className={styles.tableInfo} padding={12} paddingTop={16}>
                  <Inline space="between">
                    <Inline space={12}>
                      <Tag Icon={IconShoppingCartRegular} type={cart.status == "E" ? "inactive" : "warning"}>
                        {`Carrinho: ${cart.id}`}
                      </Tag>
                      {cart.status != "E"
                        ?
                        <Tag Icon={IconStatusChartRegular} type={cart.status == "P" ? "promo" : "success"}>
                          {`Status: ${cart.status === "P" ? "Pendente" : "Baixado"}`}
                        </Tag>
                        :
                        <Tag Icon={IconStatusChartRegular} type="inactive">
                          Status: Excluído
                        </Tag>
                      }
                      <Tag Icon={IconCoinsRegular} type={cart.status == "E" ? "inactive" : "warning"}>
                        {`Valor total: R$${getFinalCartValue(cart.addedProducts).toFixed(2).toString().replace(".", ",")}`}
                      </Tag>
                      <Tag Icon={IconUserAccountRegular} type={cart.status == "E" ? "inactive" : "warning"}>
                        {`Cliente: ${cart.userId}`}
                      </Tag>
                    </Inline>
                    <Inline space={16}>
                      <ButtonSecondary 
                        disabled={cart.status !== "P"} 
                        small 
                        onPress={() => {
                          router.push({
                            pathname: "add-product-to-cart",
                            query: {
                              cartId: cart.id
                            }
                          })}}
                        >
                        Adicionar produto
                      </ButtonSecondary>
                      <ButtonDanger
                        disabled={cart.status !== "P"} 
                        small
                        onPress={() => confirm({
                          title: "Tem certeza que deseja excluir este carrinho?",
                          message: "Esta ação não pode ser revertida (o carrinho será marcado como Excluído)",
                          acceptText: "Sim, desejo excluir",
                          cancelText: "Não, voltar"
                        })}
                      >
                        Excluir carrinho
                      </ButtonDanger>
                    </Inline>
                  </Inline>
                </Box>
                <table cellSpacing={0} cellPadding={0} className={styles.crudTable}>
                  <thead className={styles.crudHeader}>
                    <tr>
                      <th style={{ paddingLeft: "8px" }}><Text2 medium color="white">ID</Text2></th>
                      <th><Text2 medium color="white">Nome</Text2></th>
                      <th><Text2 medium color="white">Marca</Text2></th>
                      <th><Text2 medium color="white">Preço</Text2></th>
                      <th><Text2 medium color="white">Quantidade</Text2></th>
                      <th><Text2 medium color="white">Validade</Text2></th>
                      <th><Text2 medium color="white">Descrição</Text2></th>
                      <th><Text2 medium color="white"></Text2></th>
                    </tr>
                  </thead>
                  <tbody className={styles.crudBody}>
                    {cart.addedProducts.map((addedProduct, index) => (
                      <tr className={styles.crudRow} key={index}>
                        <td style={{ paddingLeft: "8px" }}><Text1 medium>{addedProduct.product.id}</Text1></td>
                        <td><Text1 medium wordBreak>{addedProduct.product.name}</Text1></td>
                        <td><Text1 medium wordBreak>{addedProduct.product.brand}</Text1></td>
                        <td><Text1 medium>R${addedProduct.product.price.toFixed(2).toString().replace(".", ",")}</Text1></td>
                        <td><Text1 medium>{addedProduct.quantity}</Text1></td>
                        <td><Text1 medium>{addedProduct.product.expirationDate}</Text1></td>
                        <td><Text1 medium truncate>{addedProduct.product.description}</Text1></td>
                        <td>
                          <ButtonDanger 
                            disabled={cart.status !== "P"}
                            onPress={() => confirm({
                              title: "Tem certeza que deseja excluir este produto?",
                              message: "Esta ação não pode ser revertida",
                              acceptText: "Sim, excluir",
                              cancelText: "Não, voltar",
                              onAccept: () => handleRemoveProductFromCart(addedProduct.product.id, cart.id)
                            })} small
                          >
                            Excluir
                          </ButtonDanger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            ))
            :
            <Box>
              <Text6>Carregando...</Text6>
            </Box>
          }
        </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
