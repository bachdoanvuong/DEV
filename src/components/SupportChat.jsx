import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Button, VStack, Input, Avatar, IconButton, Spacer } from '@chakra-ui/react';
import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
  getDoc,
  doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaComment, FaTimes } from 'react-icons/fa';

const SupportChat = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [userDisplayNames, setUserDisplayNames] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesBoxRef = useRef();
  const chatBoxRef = useRef();

  useEffect(() => {
    const fetchUserDisplayNames = async () => {
      const displayNames = {};
      for (const user of users) {
        const displayName = await getUserDisplayName(user.uid);
        displayNames[user.uid] = displayName;
      }
      setUserDisplayNames(displayNames);
    };
    fetchUserDisplayNames();
  }, [users]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => doc.data());

      setMessages(messageData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const adminDocRef = doc(db, 'users', '1y0Qgo9wrWhzrCw2DiNHSrXtubp2');
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        setAdminInfo(adminDocSnap.data());
      }
    };

    if (user?.uid !== '1y0Qgo9wrWhzrCw2DiNHSrXtubp2') {
      fetchAdminInfo();
    } else {
      const userDocs = [];
      const usersWithMessages = [];

      messages.forEach((msg) => {
        if (!userDocs.includes(msg.user)) {
          if (msg.replyTo === user.uid) {
            userDocs.push(msg.user);
            usersWithMessages.push({
              uid: msg.user,
              message: msg.text,
              timestamp: msg.timestamp,
            });
          }
        }
      });

      setUsers(usersWithMessages);
    }
  }, [user, messages]);

  const isUserMessage = (uid) => uid === user?.uid;

  const renderMessages = () => {
    return messages.map((msg, index) => {
      if(selectedUser === null && user.uid !== '1y0Qgo9wrWhzrCw2DiNHSrXtubp2') {
        if(msg.user === user.uid || msg.replyTo === user.uid) {
          return (
            <>
              <Box
                key={index}
                marginTop="10px"
                display="flex"
                flexDirection={isUserMessage(msg.user) ? 'row-reverse' : 'row'}
              >
                <Box
                  backgroundColor={isUserMessage(msg.user) ? '#E2F3E7' : '#F3F3F3'}
                  borderRadius="5px"
                  padding="8px 12px"
                  maxWidth="70%"
                >
                  <Text fontSize="12px" color="#888">
                    {msg.timestamp?.toDate().toLocaleString()}
                  </Text>
                  <Text fontSize="14px">{msg.text}</Text>
                </Box>
              </Box>
            </>
          );  
        }
      }
      if (msg.user === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' && msg.replyTo === selectedUser || msg.user === selectedUser && msg.replyTo === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2') {
        return (
          <>
            <Box
              key={index}
              marginTop="10px"
              display="flex"
              flexDirection={isUserMessage(msg.user) ? 'row-reverse' : 'row'}
            >
              <Box
                backgroundColor={isUserMessage(msg.user) ? '#E2F3E7' : '#F3F3F3'}
                borderRadius="5px"
                padding="8px 12px"
                maxWidth="70%"
              >
                <Text fontSize="12px" color="#888">
                  {msg.timestamp?.toDate().toLocaleString()}
                </Text>
                <Text fontSize="14px">{msg.text}</Text>
              </Box>
            </Box>
          </>
        );
      }
    });
  };

  const renderUsers = () => {
    const latestUserMessages = {};
    messages.forEach((msg) => {
      if (!latestUserMessages[msg.user] || msg.timestamp > latestUserMessages[msg.user].timestamp) {
        latestUserMessages[msg.user] = msg;
      }
    });

    return users.slice().reverse().map((usr, index) => {
      const latestMessage = latestUserMessages[usr.uid];
      return (
        <Button
          key={index}
          padding="2"
          height="fit-content"
          textAlign="left"
          onClick={(e) => {
            e.stopPropagation();
            handleUserSelect(usr.uid);
          }}
          display="flex"
          justifyContent="start"
          alignItems="center"
          width="100%"
          marginBottom="2"
        >
          <Avatar src={getUserAvatar(usr.uid)} size="sm" marginRight="10px" />
          <VStack alignItems="start" spacing="2px" marginLeft="5px" marginRight="5px">
            <Text fontSize="14px">{userDisplayNames[usr.uid]}</Text>
            <Text fontSize="14px" fontWeight="light">{latestMessage?.text}</Text>
            <Text fontSize="12px" color="#888">
              {latestMessage?.timestamp?.toDate().toLocaleString()}
            </Text>
          </VStack>
        </Button>
      );
    });
  };


  const getUserAvatar = (uid) => {
    const userDocRef = doc(db, 'users', uid);
    return getDoc(userDocRef)
      .then((userDocSnap) => {
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          return userData.profile || 'default-avatar-url';
        }
        return uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2'
          ? 'admin-avatar-url'
          : 'default-avatar-url';
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        return uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2'
          ? 'admin-avatar-url'
          : 'default-avatar-url';
      });
  };

  const getUserDisplayName = (uid) => {
    if (uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2') {
      return 'Admin';
    }

    const userDocRef = doc(db, 'users', uid);
    return getDoc(userDocRef)
      .then((userDocSnap) => {
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          return userData.name;
        }
        return 'User';
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        return 'User';
      });
  };

  const handleUserSelect = (uid) => {
    setSelectedUser(uid);
  };

  useEffect(() => {
    scrollMessageToBottom();
  }, [isChatOpen, selectedUser, messages]);

  useEffect(() => {
    const handleClickOutsideChat = (event) => {
      if (isChatOpen && chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutsideChat);
    return () => {
      document.removeEventListener('click', handleClickOutsideChat);
    };
  }, [isChatOpen])

  const scrollMessageToBottom = () => {
    try {
      setTimeout(() => {
        messagesBoxRef.current.scrollTo({
          top: messagesBoxRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 300)
    } catch (error) {
      // error because the current messagesBoxRef update and it haven't done when new message arrive
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    const data = {
      text: message,
      timestamp: serverTimestamp(),
      user: user.uid,
      replyTo: selectedUser ?? (user.uid !== '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' ? '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' : null),
    };
    await addDoc(collection(db, 'messages'), data);
    setMessage('');
    scrollMessageToBottom();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {
        user &&
        <Box
          ref={chatBoxRef}
          position="fixed"
          bottom="4"
          right="4"
          width={isChatOpen ? "300px" : "40px"}
          minHeight={isChatOpen ? "350px" : "40px"}
          maxHeight="350px"
          overflow="hidden"
          backgroundColor="#f8f8f8"
          borderRadius="5px"
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          zIndex="100"
        >
          <IconButton
            aria-label="Open Chat"
            icon={isChatOpen ? <FaTimes /> : <FaComment />}
            onClick={(e) => {
              e.stopPropagation();
              toggleChat();
            }}
            alignSelf="flex-end"
            bgColor="#000"
            color="#fff"
            position="absolute"
            top="2px"
            right="1px"
            _hover={{ bgColor: '#303030' }}
            _active={{ bgColor: '#303030' }}
          />
          {
            isChatOpen && (
              <Box
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="350px"
              >
                <Text
                  backgroundColor="#333"
                  color="#fff"
                  padding="10px"
                  fontWeight="bold"
                >
                  Support Chat
                </Text>

                {isChatOpen && (
                  <>
                    <Box
                      ref={messagesBoxRef}
                      maxHeight={selectedUser === null && user.uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' ? "100%" : "calc(100% - 150px)"}
                      overflowY="auto"
                      paddingTop="2"
                      paddingLeft="2"
                      paddingRight="2"
                      paddingBottom="2"
                    >
                      {
                        selectedUser === null && user.uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' &&
                        renderUsers()
                      }
                      {
                        selectedUser !== null && user.uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' &&
                        renderMessages()
                      }
                      {
                        user.uid !== '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' &&
                        renderMessages()
                      }
                    </Box>

                    {
                      (user.uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' && selectedUser !== null || user.uid !== '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' && selectedUser === null) &&
                      <Box
                        paddingBottom="2"
                        paddingLeft="2"
                        paddingRight="2"
                        paddingTop="2"
                      >
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          required={true}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              sendMessage()
                            }
                          }}
                        />
                        <Box display="flex" flexDirection="row">
                          {
                            user.uid === '1y0Qgo9wrWhzrCw2DiNHSrXtubp2' && (
                              <Button onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(null);
                              }}
                                colorScheme="blue"
                                marginTop="10px"
                              >
                                Back
                              </Button>
                            )
                          }
                          <Spacer />
                          <Button onClick={sendMessage} colorScheme="teal" marginTop="10px">
                            Send
                          </Button>
                        </Box>
                      </Box>
                    }
                  </>
                )}
              </Box>
            )}
        </Box>
      }
    </>
  );
};

export default SupportChat;
