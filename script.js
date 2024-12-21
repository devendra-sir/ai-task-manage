// const readline = require('readline');
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const apiKey = "AIzaSyD1_sKgu6RcpT6D0ekCAAi6k1pKnIZfSa8";
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-exp",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Initialize readline interface to get user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Function to analyze the priority
// async function analyzePriority(taskDescription) {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [
//           { text: `Analyze the priority of this task: Respond with "high", "medium", or "low". "${taskDescription}"` }
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage(taskDescription);
//   return result.response.text();
// }

// // Read user input and print the priority
// rl.question("Enter your task description: ", async (taskDescription) => {
//   try {
//     const priority = await analyzePriority(taskDescription);
//     console.log(`The priority of your task is: ${priority}`);
//   } catch (error) {
//     console.error("Error analyzing task priority:", error);
//   } finally {
//     rl.close();
//   }
// });


const readline = require('readline');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyD1_sKgu6RcpT6D0ekCAAi6k1pKnIZfSa8";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initialize readline interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to analyze the priority
async function analyzePriority(taskDescription) {
  // Load existing history from local storage (or initialize empty history if none exists)
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

  // Add the new user input to history
  history.push({
    role: "user",
    parts: [
      { text: `Analyze the priority of this task: Respond with "high", "medium", or "low". "${taskDescription}"` }
    ],
  });

  // Start a new chat session with the updated history
  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  // Send the task description and get the response
  const result = await chatSession.sendMessage(taskDescription);

  // Add AI's response to history
  history.push({
    role: "assistant",
    parts: [
      { text: result.response.text() }
    ],
  });

  // Save the updated history back to local storage
  localStorage.setItem("chatHistory", JSON.stringify(history));

  // Return the AI's response
  return result.response.text();
}

// Read user input and print the priority
rl.question("Enter your task description: ", async (taskDescription) => {
  try {
    const priority = await analyzePriority(taskDescription);
    console.log(`The priority of your task is: ${priority}`);
  } catch (error) {
    console.error("Error analyzing task priority:", error);
  } finally {
    rl.close();
  }
});
