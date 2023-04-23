import * as React from "react";
import styles from '@/styles/Login.module.css'
import { Box, ButtonLayout, ButtonPrimary, ButtonSecondary, EmailField, IconUserAccountRegular, Inline, PasswordField, ResponsiveLayout, Stack, Text2, Text4, Text8, TextField, TextLink, alert } from '@telefonica/mistica'
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function EditProfile() {
  const [name, setName] = React.useState("");
  const [nameValid, setNameValid] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [usernameValid, setUsernameValid] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [passValid, setPassValid] = React.useState(true);
  const [userId, setUserId] = React.useState("");
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  const router = useRouter();

  const validateEmail = (text: string) => {
    return text.match(emailRegex);
  }

  React.useEffect(() => {
    setUserId(window.sessionStorage.getItem("userId") as string);
    if(userId){
      handleGetUserInfo();
    }
  }, [userId]);

  const handleGetUserInfo = async () => {
    await api.get(`/get/user/${userId}`).then(res => {
      setName(res.data[0].name);
      setUsername(res.data[0].user);
      setEmail(res.data[0].email);
      setPassword(res.data[0].password);
    });
  }

  const handleEditUser = async () => {
    if (
      !validateEmail(email) ||
      password.length < 6 ||
      name.length < 2 || 
      username.length < 2
    ) {
      setEmailValid(false);
      setPassValid(false);
      setNameValid(false);
      setUsernameValid(false);
      return;
    } else {
      try{
        await api.put(`/update/user/${userId}`, {
          name,
          user: username,
          email,
          password
        })
        alert({
          message: "Perfil atualizado com sucesso!",
          acceptText: "Ok, continuar",
          onAccept() { router.replace("/home"); }
        });
      } catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box paddingX={16}>
        <Stack space={8}>
          <Inline space={16} alignItems="center">
            <IconUserAccountRegular size={40} />
            <Text8>Atualize seu perfil</Text8>
          </Inline>
          <Text4 medium>
            Atualize seu perfil abaixo
          </Text4>
        </Stack>
        <Box paddingTop={80}>
          <TextField
            label='Nome'
            name='name-input'
            onChangeValue={setName}
            value={name}
            error={!nameValid}
            helperText="Insira seu nome"
          />
        </Box>
        <Box paddingTop={24}>
          <TextField
            label='Nome de usuário'
            name='username-input'
            onChangeValue={setUsername}
            value={username}
            error={!usernameValid}
            helperText="Insira um nome de usuário"
          />
        </Box>
        <Box paddingTop={24}>
          <EmailField
            label='E-mail'
            name='email-input'
            onChangeValue={setEmail}
            value={email}
            error={!emailValid}
            helperText="Insira um e-mail válido"
            />
        </Box>
        <Box paddingTop={24}>
          <PasswordField
            label='Senha'
            name='password-input'
            onChangeValue={setPassword}
            value={password}
            error={!passValid}
            helperText="A senha deve conter pelo menos 6 caracteres"
          />
        </Box>
        <Box paddingTop={56}>
          <ButtonLayout>
            <ButtonSecondary onPress={router.back}>
              Cancelar
            </ButtonSecondary>
            <ButtonPrimary onPress={() => { handleEditUser() }}>
              Atualizar
            </ButtonPrimary>
          </ButtonLayout>
        </Box>
      </Box>
    </ResponsiveLayout>
  )
}
