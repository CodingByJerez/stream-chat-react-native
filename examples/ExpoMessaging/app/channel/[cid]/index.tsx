import React, { useContext } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Channel, Message, MessageInput, MessageList, MessageProps } from 'stream-chat-expo';
import { Stack, useRouter } from 'expo-router';
import { AuthProgressLoader } from '../../../components/AuthProgressLoader';
import { AppContext, useApp } from '../../../context/AppContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useMMKVString } from 'react-native-mmkv';
import { useEffect } from 'react';
import { translateText } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';

export default function ChannelScreen() {
  const router = useRouter();
  const { setThread, channel } = useContext(AppContext);
  const headerHeight = useHeaderHeight();

  // const message: React.ComponentType<MessageProps> = useCallback(
  //   (p) => {
  //     return <Mmm {...p} />;
  //   },
  //   [],
  // );

  if (!channel) {
    return <AuthProgressLoader />;
  }

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: 'Channel Screen' }} />
      {channel && (
        <Channel
          audioRecordingEnabled={true}
          channel={channel}
          keyboardVerticalOffset={headerHeight}
        >
          <View style={{ flex: 1 }}>
            <MessageList
              Message={Mmm}
              onThreadSelect={(thread) => {
                setThread(thread);
                router.push(`/channel/${channel.cid}/thread/${thread.cid}`);
              }}
            />
            <MessageInput />
          </View>
        </Channel>
      )}
    </SafeAreaView>
  );
}

const Mmm: React.ComponentType<MessageProps> = (props) => {
  const { user } = useAuth();

  const [translatedText, setTranslatedText] = useMMKVString(props.message.id);
  const [translatedQuoted] = useMMKVString(props.message.quoted_message?.id || '');

  const isOwnMessage = props.message.user?.id === user.id;

  useEffect(() => {
    if (translatedText || isOwnMessage) {
      return;
    }

    const aa = setTimeout(async () => {
      const result = await translateText(props.message.text, user.iso);
      setTranslatedText(result);
    }, 700);

    return () => {
      clearTimeout(aa);
    };
  }, [user]);

  //const translatedText = `[FR] ${props.message.text}`; // exemple fictif
  const newMessage = {
    ...props.message,
    text: translatedText || props.message.text,
    quoted_message: props.message.quoted_message
      ? {
          ...props.message.quoted_message,
          text: translatedQuoted || props.message.quoted_message.text,
        }
      : undefined,
  };
  return <Message {...props} message={newMessage} />;
};
