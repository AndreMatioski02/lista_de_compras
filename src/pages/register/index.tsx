import * as React from "react";
import styles from '@/styles/Login.module.css'
import { Box, ButtonLayout, ButtonPrimary, EmailField, PasswordField, ResponsiveLayout, Stack, Text2, Text4, Text8, TextField, TextLink, alert } from '@telefonica/mistica'
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = React.useState("");
  const [nameValid, setNameValid] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [usernameValid, setUsernameValid] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [passValid, setPassValid] = React.useState(true);
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
  const router = useRouter();

  const validateEmail = (text: string) => {
    return text.match(emailRegex);
  }

  const handleRegisterUser = () => {
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
      alert({
        message: "Cadastro efetuado com sucesso!",
        acceptText: "Ok, continuar",
        onAccept() { router.push("/"); }
      });
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box paddingX={16}>
        <Stack space={8}>
          <Text8>Cadastre-se</Text8>
          <Text4 medium>
            Efetue seu cadastro abaixo
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
            <ButtonPrimary onPress={handleRegisterUser}>
              Cadastrar
            </ButtonPrimary>
          </ButtonLayout>
        </Box>
        <Box paddingTop={32}>
          <Text2 medium>
            Já possui uma conta? <TextLink onPress={() => { router.push("/") }}>Faça login</TextLink> agora!
          </Text2>
        </Box>
      </Box>
    </ResponsiveLayout>
  )
}
