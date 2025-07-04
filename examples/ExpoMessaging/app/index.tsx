import { StyleSheet, View } from 'react-native';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ChannelSort, StreamChat } from 'stream-chat';
import { AppContext, useApp } from '../context/AppContext';
import { ADMIN_ID, STREAM_API_KEY, user as UU } from '../constants';
import { ChannelList, useChatContext } from 'stream-chat-expo';
import { useAuth } from '../context/AuthContext';
import { AuthProgressLoader } from '../components/AuthProgressLoader';

const sort: ChannelSort = { last_updated: -1 };
const options = { state: true, watch: true };

export default function ChannelListScreen() {
  const { user } = useAuth();
  const { client: chatClient } = useChatContext(); // récupère le chatClient prêt
  const [chatReady, setChatReady] = useState(false);

  const router = useRouter();
  const { setChannel } = useContext(AppContext);

  // const isAdmin = user.id === UU.id ; // adapte 'admin' à ton vrai ID admin
  // console.log('isAdmin:', isAdmin)

  // Crée le channel avec l'admin s'il n'existe pas encore
  useEffect(() => {
    let isMounted = true;

    const setupChat = async () => {
      if (user.admin) {
        isMounted && setChatReady(true);
        return; // l'admin n'a pas besoin de créer un chat avec lui-même
      }
      try {
        const channel = chatClient.channel('messaging', {
          members: [user.id, ADMIN_ID],
        });

        await channel.watch();

        if (channel.state && channel.state.messages.length === 0) {
          await channel.sendMessage({
            text: '👋 Hello! This chat is now ready.',
            user: { id: user.id },
          });
        }
        isMounted && setChatReady(true);
      } catch (error) {
        console.error('Error setting up chat:', error);
        isMounted && setChatReady(false);
      }
    };

    setupChat();
  }, [user, chatClient]);

  const memoizedFilters = useMemo(() => {
    if (user.admin) {
      return { members: { $in: [user.id] }, type: 'messaging' };
    }
    return {
      $and: [
        { members: { $in: [user.id] } },
        { members: { $in: [ADMIN_ID] } },
        { type: 'messaging' },
      ],
    };
  }, [user]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Your Chats' }} />
      {chatReady ? (
        <ChannelList
          filters={memoizedFilters}
          onSelect={(channel) => {
            setChannel(channel);
            router.push(`/channel/${channel.cid}`);
          }}
          options={options}
          sort={sort}
        />
      ) : (
        <AuthProgressLoader />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
