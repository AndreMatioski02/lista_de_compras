import * as React from "react";
import { Box, ButtonDanger, ButtonPrimary, ButtonSecondary, IconLogoutRegular, IconShoppingCartRegular, IconUserAccountRegular, Inline, ResponsiveLayout, Stack, Tag, Text1, Text2, Text3, Text4, Text5, Text6, Text8 } from '@telefonica/mistica'
import styles from "./Home.module.css";
import { useRouter } from "next/router";
import { CartType, ProductType } from "@/types/cart";

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
          id: "1",
          brand: "Garoto",
          name: "Barra de chocolate Shot",
          description: "Barrinha doce bem boa com minduim",
          expirationDate: "2023/12/20",
          price: 3.99
        }
      ]
    },
    {
      id: "2",
      finalPrice: 2000,
      userId: "3",
      createdAt: "2023/04/15",
      status: "P",
      addedProducts: [
        { 
          id: "1",
          brand: "Garoto",
          name: "Barra de chocolate Shot",
          description: "Barrinha doce bem boa com minduim",
          expirationDate: "2023/12/20",
          price: 3.99
        }
      ]
    }
  ]

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Box paddingBottom={48}>
          <Stack space={8}>
            <Text8>Lista de Compras</Text8>
            <ButtonPrimary small onPress={() => {}} className={styles.newItemBtn}>
              + Novo Carrinho
            </ButtonPrimary>
          </Stack>
        </Box>
        {myCarts && myCarts.length > 0 
          ?
          myCarts.map((cart: CartType, index: React.Key) => (
            <Box paddingBottom={64}>
              <Box className={styles.tableInfo} padding={12} paddingTop={16}>
                <Inline space={12}>
                  <Tag Icon={IconShoppingCartRegular} type="warning">
                    {`Carrinho: ${cart.id}`}
                  </Tag>
                  <Tag Icon={IconUserAccountRegular} type="warning">
                    {`Cliente: ${cart.userId}`}
                  </Tag>
                </Inline>
              </Box>
              <table cellSpacing={0} cellPadding={0} className={styles.crudTable}>
                <thead className={styles.crudHeader}>
                  <tr>
                    <th><Text2 medium color="white">ID</Text2></th>
                    <th><Text2 medium color="white">Nome</Text2></th>
                    <th><Text2 medium color="white">Marca</Text2></th>
                    <th><Text2 medium color="white">Preço</Text2></th>
                    <th><Text2 medium color="white">Validade</Text2></th>
                    <th><Text2 medium color="white">Descrição</Text2></th>
                    <th><Text2 medium color="white">Editar</Text2></th>
                    <th><Text2 medium color="white">Excluir</Text2></th>
                  </tr>
                </thead>
                <tbody className={styles.crudBody}>
                      <tr className={styles.crudRow} key={index}>
                        {cart.addedProducts.map((product: ProductType) => (
                          <>
                            <td><Text1 medium>{product.id}</Text1></td>
                            <td><Text1 medium wordBreak>{product.name}</Text1></td>
                            <td><Text1 medium wordBreak>{product.brand}</Text1></td>
                            <td><Text1 medium>R${product.price.toString().replace(".", ",")}</Text1></td>
                            <td><Text1 medium>{product.expirationDate}</Text1></td>
                            <td><Text1 medium truncate>{product.description}</Text1></td>
                            <td>
                              <ButtonPrimary onPress={() => {}} small>
                                Editar
                              </ButtonPrimary>
                            </td>
                            <td>
                              <ButtonDanger onPress={() => {}} small>
                                Excluir
                              </ButtonDanger>
                            </td>
                          </>
                        ))}
                      </tr>
                </tbody>
              </table>
            </Box>
          ))
          :
          <Box>
            <Text6>Carregando...</Text6>
          </Box>
        }
      </Stack>
      <Box paddingTop={64}>
        <ButtonSecondary onPress={router.back}>
            <IconLogoutRegular />
            <Text2 regular>Logout</Text2>
        </ButtonSecondary>
      </Box>
    </ResponsiveLayout>
  )
}
