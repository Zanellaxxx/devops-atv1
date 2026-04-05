import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

let nextId = 1;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: nextId++, text, done: false }]);
    setInput('');
  }

  function toggleDone(id) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.text);
  }

  function confirmEdit(id) {
    const text = editingText.trim();
    if (text) {
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, text } : t)));
    }
    setEditingId(null);
    setEditingText('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText('');
  }

  const done = tasks.filter(t => t.done).length;

  function renderItem({ item }) {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.taskRow}>
        <TouchableOpacity
          style={[styles.checkbox, item.done && styles.checkboxDone]}
          onPress={() => toggleDone(item.id)}
          activeOpacity={0.7}
        >
          {item.done && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editingText}
            onChangeText={setEditingText}
            onSubmitEditing={() => confirmEdit(item.id)}
            autoFocus
          />
        ) : (
          <Text style={[styles.taskText, item.done && styles.taskTextDone]}>
            {item.text}
          </Text>
        )}

        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnSave]}
                onPress={() => confirmEdit(item.id)}
              >
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={cancelEdit}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.btn, styles.btnEdit]}
                onPress={() => startEdit(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnDelete]}
                onPress={() => removeTask(item.id)}
              >
                <Text style={styles.btnText}>Deletar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Lista de Tarefas</Text>
          {tasks.length > 0 && (
            <Text style={styles.counter}>
              {done} de {tasks.length} concluída{tasks.length !== 1 ? 's' : ''}
            </Text>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nova tarefa..."
              placeholderTextColor="#aaa"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={addTask}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addTask} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Nenhuma tarefa ainda.</Text>
              <Text style={styles.emptySubtext}>Adicione uma acima para começar.</Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';
const PURPLE_LIGHT = '#ede9ff';
const RED = '#ff4d4f';
const GREEN = '#52c41a';
const GRAY = '#888';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  counter: {
    fontSize: 13,
    color: GRAY,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#fafafa',
  },
  addBtn: {
    backgroundColor: PURPLE,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    maxHeight: 480,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  editInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: PURPLE,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    color: '#222',
    backgroundColor: PURPLE_LIGHT,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  btnEdit: {
    backgroundColor: '#faad14',
  },
  btnDelete: {
    backgroundColor: RED,
  },
  btnSave: {
    backgroundColor: GREEN,
  },
  btnCancel: {
    backgroundColor: GRAY,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: GRAY,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
  },
});
