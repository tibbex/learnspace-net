
import React, { useState } from 'react';
import { Search, Plus, Send, UserPlus, Pin, File, Image, PaperclipIcon, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import DemoNotification from '@/components/DemoNotification';

// Sample data for conversations
const conversations = [
  {
    id: 1,
    contact: {
      name: 'Biology Study Group',
      avatar: '',
      initial: 'B',
      isOnline: true,
      type: 'group'
    },
    lastMessage: {
      text: 'Does anyone have notes from today\'s class?',
      time: '2:45 PM',
      isUnread: true,
      isFromMe: false
    }
  },
  {
    id: 2,
    contact: {
      name: 'Mrs. Johnson',
      avatar: '',
      initial: 'J',
      isOnline: true,
      type: 'teacher'
    },
    lastMessage: {
      text: 'I\'ve uploaded the study materials for tomorrow\'s test',
      time: '11:30 AM',
      isUnread: false,
      isFromMe: false
    }
  },
  {
    id: 3,
    contact: {
      name: 'Alex Chen',
      avatar: '',
      initial: 'A',
      isOnline: false,
      type: 'student'
    },
    lastMessage: {
      text: 'Thanks for sharing your notes!',
      time: 'Yesterday',
      isUnread: false,
      isFromMe: true
    }
  },
  {
    id: 4,
    contact: {
      name: 'Math Club',
      avatar: '',
      initial: 'M',
      isOnline: false,
      type: 'group'
    },
    lastMessage: {
      text: 'Meeting rescheduled to 4 PM on Thursday',
      time: 'Yesterday',
      isUnread: false,
      isFromMe: false
    }
  },
  {
    id: 5,
    contact: {
      name: 'Principal Williams',
      avatar: '',
      initial: 'W',
      isOnline: false,
      type: 'school'
    },
    lastMessage: {
      text: 'Please confirm your attendance for the science fair',
      time: 'Monday',
      isUnread: false,
      isFromMe: false
    }
  }
];

// Sample messages for the selected conversation
const messages = [
  {
    id: 1,
    sender: {
      name: 'You',
      avatar: '',
      initial: 'Y',
      isMe: true
    },
    content: 'Hi everyone! Does anyone have the notes from today\'s biology lecture?',
    time: '2:30 PM',
    status: 'sent'
  },
  {
    id: 2,
    sender: {
      name: 'Sarah',
      avatar: '',
      initial: 'S',
      isMe: false
    },
    content: 'I have them! Just give me a moment to scan them.',
    time: '2:32 PM',
    status: 'read'
  },
  {
    id: 3,
    sender: {
      name: 'Michael',
      avatar: '',
      initial: 'M',
      isMe: false
    },
    content: 'They\'re also available on the school portal if anyone wants to check.',
    time: '2:35 PM',
    status: 'read'
  },
  {
    id: 4,
    sender: {
      name: 'Sarah',
      avatar: '',
      initial: 'S',
      isMe: false
    },
    content: 'Here\'s the PDF of my notes. Let me know if you need anything else!',
    time: '2:40 PM',
    status: 'read',
    attachments: [
      {
        type: 'file',
        name: 'Biology_Lecture_Notes.pdf',
        size: '1.2 MB'
      }
    ]
  },
  {
    id: 5,
    sender: {
      name: 'You',
      avatar: '',
      initial: 'Y',
      isMe: true
    },
    content: 'Thanks Sarah! This is exactly what I needed.',
    time: '2:42 PM',
    status: 'sent'
  },
  {
    id: 6,
    sender: {
      name: 'Liam',
      avatar: '',
      initial: 'L',
      isMe: false
    },
    content: 'Does anyone have notes from yesterday\'s class? I was absent.',
    time: '2:45 PM',
    status: 'read'
  }
];

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(convo => 
    convo.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // In a real app, you would send this message to a backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };
  
  const ConversationItem: React.FC<{conversation: typeof conversations[0], isSelected: boolean}> = ({ conversation, isSelected }) => (
    <div 
      className={`flex items-center p-3 cursor-pointer rounded-lg transition-colors ${
        isSelected ? 'bg-eduBlue/10' : 'hover:bg-gray-50'
      }`}
      onClick={() => setSelectedConversation(conversation)}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={conversation.contact.avatar} />
          <AvatarFallback className={`
            ${conversation.contact.type === 'teacher' ? 'bg-eduPurple' : 
              conversation.contact.type === 'student' ? 'bg-eduBlue' : 
              conversation.contact.type === 'school' ? 'bg-eduTeal' : 'bg-eduGreen'} 
            text-white
          `}>
            {conversation.contact.initial}
          </AvatarFallback>
        </Avatar>
        {conversation.contact.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-eduGreen border-2 border-white"></span>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm truncate">{conversation.contact.name}</h4>
          <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className={`text-xs truncate ${
            conversation.lastMessage.isUnread && !conversation.lastMessage.isFromMe 
              ? 'font-medium text-eduDark' 
              : 'text-gray-500'
          }`}>
            {conversation.lastMessage.isFromMe ? 'You: ' : ''}
            {conversation.lastMessage.text}
          </p>
          {conversation.lastMessage.isUnread && !conversation.lastMessage.isFromMe && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
              1
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
  
  const MessageItem: React.FC<{message: typeof messages[0]}> = ({ message }) => {
    const isFromMe = message.sender.isMe;
    
    return (
      <div className={`flex mb-4 ${isFromMe ? 'justify-end' : 'justify-start'}`}>
        {!isFromMe && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback className="bg-eduPurple text-white">
              {message.sender.initial}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-[70%]`}>
          {!isFromMe && (
            <p className="text-xs text-gray-500 mb-1">{message.sender.name}</p>
          )}
          <div className={`p-3 rounded-lg ${
            isFromMe 
              ? 'bg-eduBlue text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}>
            <p className="text-sm">{message.content}</p>
            
            {message.attachments && message.attachments.map((attachment, idx) => (
              <div 
                key={idx} 
                className={`mt-2 p-2 rounded flex items-center ${
                  isFromMe ? 'bg-eduBlue/90' : 'bg-gray-200'
                }`}
              >
                <File className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-xs font-medium">{attachment.name}</p>
                  <p className="text-xs opacity-80">{attachment.size}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={`text-xs mt-1 ${isFromMe ? 'text-right' : ''} text-gray-500`}>
            {message.time}
            {isFromMe && (
              <span className="ml-1">
                ✓✓
              </span>
            )}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <div className="flex h-[calc(100vh-250px)] min-h-[500px]">
          {/* Conversations sidebar */}
          <div className="w-full max-w-xs border-r border-gray-100">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Chats</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="New Message">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Input 
                  placeholder="Search messages..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            
            <Tabs defaultValue="all" className="px-4">
              <TabsList className="w-full bg-transparent border p-1">
                <TabsTrigger 
                  value="all" 
                  className="text-xs rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="text-xs rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="groups" 
                  className="text-xs rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px] px-4 py-2">
              <div className="space-y-1">
                {filteredConversations.map(conversation => (
                  <ConversationItem 
                    key={conversation.id} 
                    conversation={conversation} 
                    isSelected={selectedConversation?.id === conversation.id}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.contact.avatar} />
                      <AvatarFallback className={`
                        ${selectedConversation.contact.type === 'teacher' ? 'bg-eduPurple' : 
                          selectedConversation.contact.type === 'student' ? 'bg-eduBlue' : 
                          selectedConversation.contact.type === 'school' ? 'bg-eduTeal' : 'bg-eduGreen'} 
                        text-white
                      `}>
                        {selectedConversation.contact.initial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">{selectedConversation.contact.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.contact.isOnline ? 'Online' : 'Offline'}
                        {selectedConversation.contact.type === 'group' && ' • 8 members'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Add to group">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Pin conversation">
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More options">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-1">
                    {messages.map(message => (
                      <MessageItem key={message.id} message={message} />
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Attach file">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Attach image">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      disabled={!messageInput.trim()} 
                      className="bg-eduBlue hover:bg-eduBlue/90"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Choose a conversation from the list or start a new one to begin messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesPage;
