import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../services/api'; // Presume-se que você já tenha configurado a API

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await api.post('/login', { email, password });
      if (response.status === 200) {
        // Salve o token ou dados do usuário conforme necessário
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('Dashboard'); // Redireciona para o Dashboard
      }
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>EsportiVai</Text>

      <View style={styles.loginContainer}>
        <Text style={styles.title}>Acesse sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.link}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>EsportiVai &copy; 2024 - Todos os direitos reservados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 30,
  },
  loginContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    color: '#6c757d',
    textAlign: 'center',
  },
});
