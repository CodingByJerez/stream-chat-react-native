import { PropsWithChildren, createContext, useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { database } from '../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { useMMKVString } from 'react-native-mmkv';
import { View, StyleSheet, TextInput, Text, Button } from 'react-native';
import { validate } from 'uuid';
import { AuthProgressLoader } from '../components/AuthProgressLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ADMIN_ID, ADMIN_PWD } from '../constants';
import { simpleHash } from '../services/simpleHash';

export type AuthContextType = {
  //   channel: ChannelType | undefined;
  //   setChannel: React.Dispatch<React.SetStateAction<ChannelType | undefined>>;
  //   setThread: React.Dispatch<React.SetStateAction<ThreadContextValue['thread'] | undefined>>;
  //   thread: ThreadContextValue['thread'] | undefined;
  user: User;
};

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly token: string;
  public readonly iso: string;
  public readonly admin?: boolean;

  constructor(id: string, val: { name: string; token: string; admin?: boolean; iso: string }) {
    this.id = id;
    this.name = val.name;
    this.token = val.token;
    this.iso = val.iso || 'ru';
    this.admin = val.admin;
  }

  public static init = (id: string, data: any) => {
    if (!data) {
      throw new Error('');
    }

    if (!data.name || !data.token) {
      throw new Error('');
    }

    return new User(id, data);
  };
}
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useMMKVString('USER_ID');
  const [user, setUser] = useState<User>(undefined);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const userListRef = ref(database, `users/${userId}`);

    const unsubscribe = onValue(
      userListRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setUserId(undefined);
          setUser(undefined);
          unsubscribe();
          return;
        }

        setUser(User.init(userId, data));
      },
      (e) => {
        console.log('e:', e);
      },
    );

    return () => {
      unsubscribe?.();
    };
  }, [userId]);

  //   useEffect(() => {
  //     if (user) {
  //     }
  //     database.app;
  //     const starCountRef = ref(database, 'users/' + postId + '/starCount');
  //     starCountRef;
  //     onValue(
  //       starCountRef,
  //       (snapshot) => {
  //         const data = snapshot.val();
  //       },
  //       {
  //         onlyOnce: true,
  //       },
  //     );
  //   }, [user]);

  if (!userId) {
    return <Form onSubmit={setUserId} />;
  }

  if (!user) {
    return <AuthProgressLoader />;
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};



const Form = ({ onSubmit }: { onSubmit: (uuid: string) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [pwdInputValue, setPwdInputValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ marginBottom: 10 }}>USER ID</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder='User UUID'
            style={styles.input}
            autoCapitalize='none'
            autoCorrect={false}
          />
          {inputValue === ADMIN_ID && (
            <TextInput
              value={inputValue}
              onChangeText={setPwdInputValue}
              placeholder='password'
              style={styles.input}
              autoCapitalize='none'
              autoCorrect={false}
            />
          )}
          <Button
            title='Valider'
            onPress={() => {
              if (!inputValue.trim() || !validate(inputValue.trim())) {
                return;
              }
              if (inputValue.trim() === ADMIN_ID && pwdInputValue !== ADMIN_PWD) {
                return;
              }
              onSubmit(inputValue.trim());
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0006',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    width: 280,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 8,
    width: 200,
    marginBottom: 16,
  },
});
