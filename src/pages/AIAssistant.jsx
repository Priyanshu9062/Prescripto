import ChatBot from "../components/ChatBot";

const AIAssistant = () => {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        AI Health Assistant
      </h1>

      <ChatBot />
    </div>
  );
};

export default AIAssistant;