import React, { PropsWithChildren } from 'react';
import {
  Chat,
  OverlayProvider,
  SqliteClient,
  Streami18n,
  useCreateChatClient,
} from 'stream-chat-expo';
import { AuthProgressLoader } from './AuthProgressLoader';
import { STREAM_API_KEY } from '../constants';
import { useStreamChatTheme } from '../useStreamChatTheme';
import { useAuth } from '../context/AuthContext';

const streami18n = new Streami18n({
  language: 'en',
});

SqliteClient.logger = (level, message, extraData) => {
  // console.log(level, `SqliteClient: ${message}`, extraData);
};

interface IProps {}

export const ChatWrapper = ({ children }: PropsWithChildren<IProps>) => {
  const { user } = useAuth();
  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    userData: { id: user.id, name: user.name },
    tokenOrProvider: user.token,
  });
  const theme = useStreamChatTheme();

  if (!chatClient) {
    return <AuthProgressLoader />;
  }

  return (
    <OverlayProvider i18nInstance={streami18n} value={{ style: theme }}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};
