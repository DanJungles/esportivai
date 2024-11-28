import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import api from '../services/api'; // Presume-se que você já tenha configurado a API

export default function ParticipationsScreen() {
  const [participations, setParticipations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    status: '',
  });

  // Carrega as participações ao montar o componente
  useEffect(() => {
    loadParticipations();
  }, []);

  // Função para carregar participações
  const loadParticipations = async () => {
    try {
      const response = await api.get('/participations');
      setParticipations(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as participações.');
    }
  };

  // Abre o modal para criar ou editar uma participação
  const openModal = (participation = null) => {
    if (participation) {
      setEditingParticipation(participation.id);
      setFormData({
        eventName: participation.event_name,
        eventDate: participation.event_date,
        eventLocation: participation.event_location,
        status: participation.status,
      });
    } else {
      setEditingParticipation(null);
      setFormData({
        eventName: '',
        eventDate: '',
        eventLocation: '',
        status: '',
      });
    }
    setModalVisible(true);
  };

  // Salva a participação (criação ou edição)
  const saveParticipation = async () => {
    const { eventName, eventDate, eventLocation, status } = formData;

    if (!eventName || !eventDate || !eventLocation || !status) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = editingParticipation
        ? await api.put(`/participations/${editingParticipation}`, {
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
            status,
          })
        : await api.post('/participations', {
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
            status,
          });

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Sucesso',
          editingParticipation
            ? 'Participação atualizada com sucesso!'
            : 'Participação criada com sucesso!'
        );
        loadParticipations();
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a participação.');
    }
  };

  // Exclui uma participação
  const deleteParticipation = async (id) => {
    try {
      await api.delete(`/participations/${id}`);
      Alert.alert('Sucesso', 'Participação excluída com sucesso!');
      loadParticipations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a participação.');
    }
  };

  // Renderiza cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.participationItem}>
      <Text style={styles.participationText}>{item.event_name}</Text>
      <Text style={styles.participationText}>{item.event_date}</Text>
      <Text style={styles.participationText}>{item.event_location}</Text>
      <Text style={styles.participationText}>{item.status}</Text>
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => openModal(item)} />
        <Button title="Excluir" onPress={() => deleteParticipation(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Participações</Text>
      <Button title="Adicionar Participação" onPress={() => openModal()} />
      <FlatList
        data={participations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      {/* Modal de Participação */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingParticipation ? 'Editar Participação' : 'Adicionar Participação'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Evento"
              value={formData.eventName}
              onChangeText={(text) => setFormData({ ...formData, eventName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Data"
              value={formData.eventDate}
              onChangeText={(text) => setFormData({ ...formData, eventDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Local"
              value={formData.eventLocation}
              onChangeText={(text) => setFormData({ ...formData, eventLocation: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Status"
              value={formData.status}
              onChangeText={(text) => setFormData({ ...formData, status: text })}
            />
            <Button title="Salvar" onPress={saveParticipation} />
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
    marginBottom: 20,
  },
  list: {
    marginTop: 20,
  },
  participationItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  participationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
});
