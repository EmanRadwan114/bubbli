import { useState } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chatbot`, {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { sender: "bot", text: "Something went wrong." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50">
        💬
      </button>

      {/* Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-lg shadow-lg flex flex-col z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
            AI Assistant
          </div>

          <div className="p-3 h-64 overflow-y-auto space-y-2 flex-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 border p-2 rounded mr-2 text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-3 rounded"
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
