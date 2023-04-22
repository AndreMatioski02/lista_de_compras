import * as React from "react";
import { 
  Box,
  ButtonPrimary, 
  ButtonSecondary, 
  Inline, 
  ResponsiveLayout, 
  Select, 
  Stack, 
  Text4,
  Text8, 
} from '@telefonica/mistica'
import styles from "./AddProductToCart.module.css";
import { useRouter } from "next/router";

export default function AddProductToCart() {
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const router = useRouter();

  const handleAddProductToCart = () => {
    router.replace("/home");
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
       <Text8>Adicionar produto</Text8>
       <Box paddingTop={8}>
        <Text4 medium>Por favor, escolha um produto da lista abaixo para adicionar ao carrinho</Text4>
       </Box>
       <Box paddingTop={64}>
        <Select 
          name="cart-product-addition"
          label="Escolha um..."
          options={[
            { text: "Biscoito", value: "1"},
            { text: "Chocolate", value: "2"},
            { text: "Wafer", value: "3"},
          ]}
          onChangeValue={setSelectedProduct}
        />
       </Box>
       <Box paddingTop={80}>
        <Inline space={16}>
          <ButtonSecondary onPress={router.back}>
            Voltar
          </ButtonSecondary>
          <ButtonPrimary disabled={!selectedProduct} onPress={handleAddProductToCart}>
            Adicionar
          </ButtonPrimary>
        </Inline>
       </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
