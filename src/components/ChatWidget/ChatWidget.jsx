import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Optional: Add "typing..." effect (optional visual)
    const typingIndicator = { sender: "bot", text: "Typing..." };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chatbot`, {
        message: input,
      });

      const botReply = res.data.reply;

      // Simulate delay
      setTimeout(() => {
        setMessages((prev) =>
          prev
            .filter((msg) => msg.text !== "Typing...") // remove typing
            .concat({ sender: "bot", text: botReply })
        );
      }, 1500); // 1.5s delay
    } catch (err) {
      console.error("Chatbot Error:", err);
      setTimeout(() => {
        setMessages((prev) =>
          prev
            .filter((msg) => msg.text !== "Typing...")
            .concat({ sender: "bot", text: "Something went wrong." })
        );
      }, 1500);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-[100px] bg-accent text-white p-4 rounded-full shadow-lg hover:bg-accent-dark cursor-pointer transition z-50">
        💬
      </button>

      {/* Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-[100px] w-80 bg-white border-2 border-gray-400 rounded-lg shadow-lg flex flex-col z-50 h-96">
          <div className="bg-primary text-white px-4 py-2 rounded-t-lg font-semibold">
            AI Assistant
          </div>

          {/* Messages Container */}
          <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] text-sm break-words ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-secondary text-black rounded-bl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex border-t border-gray-400  p-2">
            <input
              type="text"
              className="flex-1 border-2 border-gray-400  p-2 rounded text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-primary hover:bg-accent cursor-pointer text-white px-3 ml-2 rounded"
              onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
