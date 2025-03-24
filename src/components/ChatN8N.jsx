import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const ChatN8N = () => {
    useEffect(() => {
		createChat({
            webhookUrl: process.env.REACT_APP_N8N_URL,
            webhookConfig: {
                method: 'POST',
                headers: {}
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
                'Hi there! 👋',
                'My name is Nathan. I answer question related to recipes and healthy eating. How can I assist you today?'
            ],
            i18n: {
                en: {
                    title: 'Hi there! 👋',
                    subtitle: "Start a chat about healthy recipes. We're here to help you 24/7.",
                    footer: '',
                    getStarted: 'New Conversation',
                    inputPlaceholder: 'Type your question..',
                },
            },
        });
	}, []);

	return (<div></div>);


}

export default ChatN8N
