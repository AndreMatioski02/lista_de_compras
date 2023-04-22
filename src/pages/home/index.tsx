import * as React from "react";
import {
  Box,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  IconAppsFilled,
  IconCoinsRegular,
  IconLogoutRegular,
  IconSettingsRegular,
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
import { CartType, CartProductType, ProductType } from "@/types/cart";
import { api } from "@/services/base";

export default function Home() {
  const [myCarts, setMyCarts] = React.useState<CartType[]>([]);
  const [userId, setUserId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [cartProductIds, setCartProductIds] = React.useState<string[]>([]);
  const [detailedProducts, setDetailedProducts] = React.useState<ProductType[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    setUserId(window.sessionStorage.getItem("userId") as string);
    handleGetUserName();
    handleGetUserCarts();
  }, [userId]);

  const handleGetUserCarts = async () => {
    if(userId) {
      try {
        await api.get(`/get/shopping_cart/user/${userId}`).then(res => setMyCarts(res.data));
        handleGetUserCartProducts("1");
      } catch (err) {
        console.log(err);
      }
    }
  }

  React.useEffect(() => {
    cartProductIds.forEach(async productId => await api.get(`/get/product/${productId}`).then(res => setDetailedProducts(prev => [...prev, res.data[0]])));
  }, [cartProductIds]);

  const handleGetUserCartProducts = async (cartId: string) => {
    try {
      const cartProducts = await api.get(`/get/cart_product/${cartId}`).then(res => res.data);
      cartProducts.forEach((cartProduct: CartProductType) => setCartProductIds(prev => [...prev, cartProduct.product_id]));
    } catch (err) {
      console.log(err);
    }
  }

  const handleGetUserName = async () => {
    if(userId){
      try {
        await api.get(`/get/user/${userId}`).then(res => setUserName(res.data[0].name));
      } catch (err) {
        console.log(err);
      }
    }
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

  const handleFormatDate = (date: string) => {
    const completeDate = new Date(date);
    let formattedMonth;
    let formattedDay;

    if(completeDate.getDate() > 9) {
      formattedDay = completeDate.getDate();
    }else {
      formattedDay = `0${completeDate.getDate()}`;
    }

    if(completeDate.getMonth() > 9) {
      formattedMonth = completeDate.getMonth();
    }else {
      formattedMonth = `0${completeDate.getMonth()}`;
    }

    return `${formattedDay}/${formattedMonth}/${completeDate.getFullYear()}`;
  }

  // const handleGetUpdatedProductPrice = async (cartId: string, productId: string) => {
  //   const cartProducts = await api.get(`/get/cart_product/${cartId}`).then(res => res.data);
  //   console.log(cartProducts.find((cartProduct: CartProductType) => productId === cartProduct.product_id).price);
  // }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Inline space={16} alignItems="center">
          <IconAppsFilled size={40} />
          <Text8> Minhas Compras</Text8>
        </Inline>
        <Box paddingBottom={48} paddingTop={12}>
          <Inline space="between">
            <Inline space={16}>
              <ButtonPrimary onPress={() => { router.push("new-cart") }}>
                <Text2 regular>+ Novo Carrinho</Text2>
              </ButtonPrimary>
              <ButtonPrimary onPress={() => { router.push("list-products") }}>
                <Text2 regular>Catálogo de Produtos</Text2>
              </ButtonPrimary>
            </Inline>
            <Inline space={16}>
              <ButtonSecondary onPress={() => { 
                window.sessionStorage.clear();
                router.replace("/");
              }}>
                <IconLogoutRegular />
                <Text2 regular>Logout</Text2>
              </ButtonSecondary>
              <ButtonSecondary onPress={() => { 
                router.push({
                  pathname: "/edit-profile",
                  query: {
                    userId: "1"
                  }
                }) 
              }}>
                <IconSettingsRegular />
                <Text2 regular>Editar Perfil</Text2>
              </ButtonSecondary>
            </Inline>
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
                        {`Valor total: R$${cart.total_value.toFixed(2).toString().replace(".", ",")}`}
                      </Tag>
                      <Tag Icon={IconUserAccountRegular} type={cart.status == "E" ? "inactive" : "warning"}>
                        {`Cliente: ${userName}`}
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
                          })
                        }}
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
                      <ButtonPrimary
                        disabled={cart.status !== "P"}
                        small
                        onPress={() => confirm({
                          title: "Tem certeza que deseja finalizar este carrinho?",
                          message: "Esta ação não pode ser revertida (o carrinho será marcado como Baixado)",
                          acceptText: "Sim, desejo finalizar",
                          cancelText: "Não, voltar"
                        })}
                      >
                        Finalizar carrinho
                      </ButtonPrimary>
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
                      <th><Text2 medium color="white"></Text2></th>
                    </tr>
                  </thead>
                  <tbody className={styles.crudBody}>
                    {detailedProducts.map((product: ProductType, index: number) => (
                      <tr className={styles.crudRow} key={index}>
                        <td style={{ paddingLeft: "8px" }}><Text1 medium>{product.id}</Text1></td>
                        <td><Text1 medium wordBreak>{product.name}</Text1></td>
                        <td><Text1 medium wordBreak>{product.brand}</Text1></td>
                        <td><Text1 medium>R${product.price.toFixed(2).toString().replace(".", ",")}</Text1></td>
                        <td><Text1 medium>{1}</Text1></td>
                        <td><Text1 medium>{handleFormatDate(product.expiration_date)}</Text1></td>
                        <td style={{ width: "200px" }}><Text1 medium truncate>{product.description}</Text1></td>
                        <td>
                          <ButtonSecondary
                            disabled={cart.status !== "P"}
                            onPress={() => confirm({
                              title: "Informe o novo preço do produto abaixo",
                              message: "Está ação será refletida apenas neste carrinho",
                              acceptText: "Atualizar",
                              cancelText: "Cancelar",
                            })} small
                          >
                            Editar preço
                          </ButtonSecondary>
                        </td>
                        <td>
                          <ButtonDanger
                            disabled={cart.status !== "P"}
                            onPress={() => confirm({
                              title: "Tem certeza que deseja excluir este produto?",
                              message: "Esta ação não pode ser revertida",
                              acceptText: "Sim, excluir",
                              cancelText: "Não, voltar",
                              onAccept: () => handleRemoveProductFromCart(product.id, cart.id)
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
