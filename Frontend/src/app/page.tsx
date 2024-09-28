'use client'; // Ensure this is at the top for client components
import React, { useState, useEffect, useRef } from 'react';
import MDR from '../components/MarkdownRenderer';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to the latest message when a new one is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input;
    setMessages([...messages, { user: userMessage, bot: '...' }]); // Add user message with bot placeholder
  
    try {
      console.log("Try entered")
      const response = await fetch('https://miniature-happiness-56q6vqj5676hvg9w-8000.app.github.dev/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });
      console.log(response);

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response:', response.status, errorMessage);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === prevMessages.length - 1 ? { ...msg, bot: data.data } : msg
        )
      );
      console.log(data.data);
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages((prevMessages) => [...prevMessages, { user: userMessage, bot: `Error fetching message: ${error}` }]);
    }
  
    setInput('');
  };

  return ( 
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#17181D] to-[#292C39] text-white">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center ">Chat with Ujjan AI</h1>
          <p className="text-center text-sm text-gray-400 mt-4 mb-4">Powered by Gemini Flash 1.5</p>
          
          {/* Chat messages */}
            <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col">
              {/* User message */}
                <div className="self-end bg-[#292C39] text-[#FCD9B8] p-4 m-2 rounded-lg max-w-xl min-w-80">
                {/* <p className="text-sm">You:</p> */}
                <p className='text-lg'>{message.user}</p>
                </div>
              {/* Bot message */}
              <div className="self-start p-3 m-2 text-gray-300 rounded-lg max-w-full min-w-80 mt-2 flex items-top space-x-2">
                {/* <p className="text-sm">Bot:</p> */}
                <img src="/favicon.ico" alt="favicon" className="w-6 h-6 rounded-full" />
                {/* <ReactMarkdown className="prose">{message.bot}</ReactMarkdown> */}
                <MDR content={message.bot} />
              </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
        </div>
      </div>

      <div className="bg-[#17181D] p-4 border-t border-[#FCD9B8] flex justify-center">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 w-full max-w-3xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-[#292C39] text-[#FCD9B8] p-4 rounded-md resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
              }
            }}
          />
            <button 
            type="submit" 
            className="bg-[#FCD9B8] text-[#292C39] border border-[#FCD9B8] px-4 py-2 rounded-md hover:bg-transparent hover:text-[#FCD9B8] hover:border-[#FCD9B8]"
            >
            Send
            </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
