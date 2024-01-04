import React, { useState, useEffect } from 'react';
import { View, Animated, Keyboard, Platform, StyleSheet } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [websocket, setWebsocket] = useState(null);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const ws = new W3CWebSocket('ws://');

    ws.onmessage = event => {
      handleIncomingMessage(event.data);
    };

    setWebsocket(ws);

    Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      ws.close();
    };
  }, []);

  const handleIncomingMessage = data => {
    const newMessage = JSON.parse(data);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
  };

  const handleKeyboardShow = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const handleKeyboardHide = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const containerStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
    ],
  };

  const onSend = newMessages => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const messageToSend = newMessages[0];
    const messageData = {
      text: messageToSend.text,
      user: messageToSend.user,
    };
    if (websocket) {
      websocket.send(JSON.stringify(messageData));
    }
  };

  const renderSend = props => {
    return (
      <Send {...props}>
        <View style={styles.sendContainer}>
          <Icon name="send" size={28} color="#FFFFFF" />
        </View>
      </Send>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.chatContainer, containerStyle]}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderSend={renderSend}
          placeholder="Type your message..."
          showUserAvatar
          alwaysShowSend
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700', // Background color
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFF', // Chat container background color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#FF6347', // Send button background color
    borderRadius: 50,
    width: 40,
    height: 40,
  },
});

export default ChatScreen;
