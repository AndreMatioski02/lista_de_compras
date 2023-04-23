import * as React from "react";
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  DecimalField,
  IconClickAndCollectRegular,
  Inline,
  ResponsiveLayout,
  Stack,
  Text3,
  Text4,
  Text8,
  alert,
} from '@telefonica/mistica'
import styles from "./EditProductPrice.module.css";
import { useRouter } from "next/router";
import { CartProductType } from "@/types/cart";
import { api } from "@/services/base";
import { formatCartDate } from "@/utilities/formatCartDate";

export default function EditProductPrice() {
  const [newPrice, setNewPrice] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    handleGetCurrentProductPrice();
  }, []);

  const handleGetCurrentProductPrice = async () => {
    const { cartId, productId } = router.query;
    const currentPrice = await api.get(`/get/cart_product/${cartId}/${productId}`).then(res => res.data[0].product_value);
    setNewPrice(currentPrice.toFixed(2).toString().replace(".", ","));
  }

  const handleUpdateProductPrice = async () => {
    const { cartId, productId } = router.query;
    const toUpdateCartProduct: CartProductType = await api.get(`/get/cart_product/${cartId}/${productId}`).then(res => res.data[0]);
    const myCart = await api.get(`/get/shopping_cart/${cartId}`).then(res => res.data[0]);
    const totalValueWithoutToUpdateProduct = myCart.total_value-(toUpdateCartProduct.product_value*toUpdateCartProduct.quantity);

    try {
      await api.put(`/update/cart_product/${cartId}/${productId}`, {
        quantity: toUpdateCartProduct.quantity,
        created_at: formatCartDate(new Date(toUpdateCartProduct.created_at)),
        total_value: Number(newPrice.replace(",", "."))*toUpdateCartProduct.quantity,
        product_value: Number(newPrice.replace(",", "."))
      });
      await api.put(`/update/shopping_cart/${cartId}`, {
        total_value: (totalValueWithoutToUpdateProduct+(Number(newPrice.replace(",", "."))*toUpdateCartProduct.quantity)).toFixed(2),
        status: "P",
        created_at: formatCartDate(new Date(myCart.created_at)),
        updated_at: formatCartDate(new Date()),
        user_id: myCart.user_id
      });
      alert({
        title: "Preço atualizado com sucesso!",
        message: "O preço do produto para este carrinho foi atualizado e já pode ser visualizado",
        acceptText: "Ok, continuar",
        onAccept () { router.replace("/home") }
      })
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Inline space={16}>
          <IconClickAndCollectRegular size={40} />
          <Text8>Editar preço</Text8>
        </Inline>
        <Box paddingTop={8}>
          <Stack space={4}>
            <Text4 medium>Utilize o campo abaixo para alterar o preço de compra do produto selecionado</Text4>
            <Text3 medium color="#888888">O preço será alterado apenas para este carrinho</Text3>
          </Stack>
        </Box>
        <Box paddingTop={64}>
          <DecimalField
            label="Novo preço"
            name="new-price-input"
            onChangeValue={setNewPrice}
            value={newPrice}
          />
        </Box>
        <Box paddingTop={80}>
          <Inline space={16}>
            <ButtonSecondary onPress={router.back}>
              Voltar
            </ButtonSecondary>
            <ButtonPrimary disabled={!newPrice} onPress={() => { handleUpdateProductPrice() }}>
              Atualizar
            </ButtonPrimary>
          </Inline>
        </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
