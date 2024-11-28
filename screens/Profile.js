import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import api from '../services/api'; // Presume-se que a API esteja configurada

export default function ProfileScreen() {
  const [profile, setProfile] = useState({ nome: '', email: '', localizacao: '' });
  const [sports, setSports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [sportForm, setSportForm] = useState({ nome: '', nivel_habilidade: '' });

  useEffect(() => {
    loadProfile();
    loadSports();
  }, []);

  // Carrega os dados do perfil
  const loadProfile = async () => {
    try {
      const response = await api.get(`/users/${1}`); // Substituir pelo ID do usuário autenticado
      setProfile(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    }
  };

  // Carrega os esportes
  const loadSports = async () => {
    try {
      const response = await api.get(`/sports/${1}`); // Substituir pelo ID do usuário
      setSports(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os esportes.');
    }
  };

  // Abre o modal para adicionar ou editar esporte
  const openSportModal = (sport = null) => {
    if (sport) {
      setEditingSport(sport.id);
      setSportForm({ nome: sport.nome, nivel_habilidade: sport.nivel_habilidade });
    } else {
      setEditingSport(null);
      setSportForm({ nome: '', nivel_habilidade: '' });
    }
    setModalVisible(true);
  };

  // Salva o esporte (criar ou editar)
  const saveSport = async () => {
    const { nome, nivel_habilidade } = sportForm;

    if (!nome || !nivel_habilidade) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = editingSport
        ? await api.put(`/sports/${editingSport}`, { nome, nivel_habilidade })
        : await api.post(`/sports`, { userId: 1, nome, nivel_habilidade }); // Substituir pelo ID do usuário

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sucesso', editingSport ? 'Esporte atualizado!' : 'Esporte adicionado!');
        loadSports();
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o esporte.');
    }
  };

  // Exclui esporte
  const deleteSport = async (id) => {
    try {
      await api.delete(`/sports/${id}`);
      Alert.alert('Sucesso', 'Esporte excluído com sucesso!');
      loadSports();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o esporte.');
    }
  };

  const renderSport = ({ item }) => (
    <View style={styles.sportItem}>
      <Text>{item.nome}</Text>
      <Text>{item.nivel_habilidade}</Text>
      <View style={styles.sportActions}>
        <Button title="Editar" onPress={() => openSportModal(item)} />
        <Button title="Excluir" onPress={() => deleteSport(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileContainer}>
        <TextInput
          style={styles.input}
          value={profile.nome}
          editable={false}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          value={profile.email}
          editable={false}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={profile.localizacao}
          editable={false}
          placeholder="Localização"
        />
        <Button title="Editar Perfil" onPress={() => Alert.alert('Editar Perfil')} />
      </View>

      <Text style={styles.subTitle}>Esportes</Text>
      <FlatList
        data={sports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSport}
        style={styles.list}
      />
      <Button title="Adicionar Esporte" onPress={() => openSportModal()} />

      {/* Modal para esportes */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSport ? 'Editar Esporte' : 'Adicionar Esporte'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Esporte"
              value={sportForm.nome}
              onChangeText={(text) => setSportForm({ ...sportForm, nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nível de Habilidade"
              value={sportForm.nivel_habilidade}
              onChangeText={(text) => setSportForm({ ...sportForm, nivel_habilidade: text })}
            />
            <Button title="Salvar" onPress={saveSport} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  sportItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});
