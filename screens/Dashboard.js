import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import api from '../services/api'; // Presume-se que o serviço de API esteja configurado

export default function DashboardScreen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
    loadEvents('upcoming-events', setUpcomingEvents);
    loadEvents('subscribed-events', setSubscribedEvents);
    loadEvents('past-events', setPastEvents);
  }, []);

  // Função para carregar eventos
  const loadEvents = async (endpoint, setState) => {
    try {
      const response = await api.get(`/users/1/${endpoint}`); // Substituir pelo ID do usuário
      setState(response.data);
    } catch (error) {
      Alert.alert('Erro', `Não foi possível carregar ${endpoint}.`);
    }
  };

  // Função para salvar um novo evento
  const saveEvent = async () => {
    const { nome, esporte, data, horario, local, max_participantes, nivel_habilidade } = eventForm;

    if (!nome || !esporte || !data || !horario || !local || !max_participantes || !nivel_habilidade) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/events', eventForm);
      if (response.status === 201) {
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
        setModalVisible(false);
        setEventForm({
          nome: '',
          esporte: '',
          data: '',
          horario: '',
          local: '',
          max_participantes: '',
          nivel_habilidade: '',
        });
        loadEvents('upcoming-events', setUpcomingEvents);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o evento.');
    }
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>{item.nome}</Text>
      <Text style={styles.eventText}>{item.esporte}</Text>
      <Text style={styles.eventText}>{item.data}</Text>
      <Text style={styles.eventText}>{item.local}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <FlatList
          data={upcomingEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos Inscritos</Text>
        <FlatList
          data={subscribedEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos Passados</Text>
        <FlatList
          data={pastEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvent}
        />
      </View>

      <Button title="Criar Evento" onPress={() => setModalVisible(true)} />

      {/* Modal para criar evento */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Evento</Text>
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
