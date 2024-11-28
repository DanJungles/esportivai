import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Button,
} from 'react-native';
import api from '../services/api'; // Certifique-se de que o serviço de API esteja configurado

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    nome: '',
    esporte: '',
    data: '',
    horario: '',
    local: '',
    max_participantes: '',
    nivel_habilidade: '',
  });

  // Carrega os eventos ao montar o componente
  useEffect(() => {
    loadEvents();
  }, []);

  // Função para carregar os eventos
  const loadEvents = async () => {
    try {
      const response = await api.get('/events'); // Altere conforme a rota da API
      setEvents(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os eventos.');
    }
  };

  // Abre o modal para criar ou editar evento
  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event.id);
      setEventForm({
        nome: event.nome,
        esporte: event.esporte,
        data: event.data,
        horario: event.horario,
        local: event.local,
        max_participantes: event.max_participantes,
        nivel_habilidade: event.nivel_habilidade,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        nome: '',
        esporte: '',
        data: '',
        horario: '',
        local: '',
        max_participantes: '',
        nivel_habilidade: '',
      });
    }
    setModalVisible(true);
  };

  // Salva o evento (criar ou editar)
  const saveEvent = async () => {
    const { nome, esporte, data, horario, local, max_participantes, nivel_habilidade } = eventForm;

    if (!nome || !esporte || !data || !horario || !local || !max_participantes || !nivel_habilidade) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = editingEvent
        ? await api.put(`/events/${editingEvent}`, eventForm)
        : await api.post('/events', eventForm);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Sucesso', editingEvent ? 'Evento atualizado!' : 'Evento criado!');
        loadEvents();
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  };

  // Exclui um evento
  const deleteEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      Alert.alert('Sucesso', 'Evento excluído com sucesso!');
      loadEvents();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o evento.');
    }
  };

  // Renderiza cada evento
  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>{item.nome}</Text>
      <Text style={styles.eventText}>{item.esporte}</Text>
      <Text style={styles.eventText}>{item.data}</Text>
      <Text style={styles.eventText}>{item.local}</Text>
      <View style={styles.actions}>
        <Button title="Editar" onPress={() => openModal(item)} />
        <Button title="Excluir" onPress={() => deleteEvent(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Eventos</Text>
      <Button title="Criar Evento" onPress={() => openModal()} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />

      {/* Modal para criar ou editar eventos */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Editar Evento' : 'Criar Evento'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Evento"
              value={eventForm.nome}
              onChangeText={(text) => setEventForm({ ...eventForm, nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Esporte"
              value={eventForm.esporte}
              onChangeText={(text) => setEventForm({ ...eventForm, esporte: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Data"
              value={eventForm.data}
              onChangeText={(text) => setEventForm({ ...eventForm, data: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Horário"
              value={eventForm.horario}
              onChangeText={(text) => setEventForm({ ...eventForm, horario: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Local"
              value={eventForm.local}
              onChangeText={(text) => setEventForm({ ...eventForm, local: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Máximo de Participantes"
              value={eventForm.max_participantes}
              keyboardType="numeric"
              onChangeText={(text) => setEventForm({ ...eventForm, max_participantes: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nível de Habilidade"
              value={eventForm.nivel_habilidade}
              onChangeText={(text) => setEventForm({ ...eventForm, nivel_habilidade: text })}
            />
            <Button title="Salvar" onPress={saveEvent} />
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
  eventItem: {
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
  eventText: {
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
