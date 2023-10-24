import { getJson } from "serpapi";
import {} from "dotenv/config";
// import { Configuration, OpenAIApi } from "openai";

import OpenAI from "openai";
import readline from "readline";
// import { query } from "express";
let arr = [];
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var googleSearch = (input) => {
  return new Promise((resolve, reject) => {
    const ansapi = [];
    getJson(
      {
        engine: "google",
        q: input,
        api_key: process.env.REACT_APP_SERP_API_KEY,
      },
      (json) => {
        json["organic_results"].map((data) => {
          ansapi.push(data.snippet);
        });
        resolve(ansapi);
      }
    );
  });
};


var OpenAiResponse = async (query) => {
  // Define arr as an array to store responses.

  try {
    const result = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "gpt-3.5-turbo",
    });

    arr.push(result.choices[0].message.content);
    return result.choices[0].message.content;

    // Call userInterface.prompt() if it's defined.
    // userInterface.prompt();
  } catch (error) {
    console.log(error);
  }
};

userInterface.prompt();
userInterface.on("line", async (input) => {
  let googleData = [];
  if (arr.length > 30) {
    arr.shift();
  }
  arr.push(input);
  const googleSearchPromt = `Your task is to generate a query to ask so that you could find relevant results \
  -First check if chat history and user input can make sense togethor or not. \
  -then if they make sense create a relevant query to search on serpapi \
  chat history: ${arr}\
  user Input: ${input}\
  -strictly return only the query to be searched on google`;
  try {
    const res = await OpenAiResponse(googleSearchPromt);
    // console.log(res,"GoogleSearch query\n");
    const data = await googleSearch(res);
    googleData = data;



  } catch (error) {
    console.error("Error:", error);
  }

  const openAiPrompt = `Your task is to answer user with the most relevent answer you can generate.\
  -Try to understand the input of the user which is direct interaction of the user.\
  -If user is trying to interact with you reply with your understanding\
  -Decide if the query asked is pure fact or mathematical calculations based on previous chat or history\
  -check for the history if the question asked is context based or not with the previous record available\
  -check if google search results contain answer to the query provided to you\
  -check if you can answer the query based on your past knowledge\
  -check if you can perform numerical operation and reach final answer then calculate and provide final answer.\
  
  input: ${input}\
  history:${arr}\
  google search results: ${googleData}`;
  try{
    const res = await OpenAiResponse(openAiPrompt);
    if(arr.length>30){
      arr.shift();
    }
    arr.push(res);
    // console.log("History",arr,"\n")
    // console.log(googleData,"data to be used finally");
    console.log(res);
    userInterface.prompt();
    
  }catch(err){
    console.log(err,"Error");
  }
 

});
