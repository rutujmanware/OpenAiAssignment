import { getJson } from "serpapi";
import {} from 'dotenv/config'
// import { Configuration, OpenAIApi } from "openai";
// //org-mRnIQGZmZIhbhPu70uxuzfBk
// //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
// const configuration = new Configuration({
//   organization: "org-mRnIQGZmZIhbhPu70uxuzfBk",
//   apiKey: "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",
// });

// const openai = new OpenAIApi(configuration);

// openai
//   .createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: "Hello" }],
//   })
//   .then((result) => {
//     console.log(result);
//   });
import OpenAI from "openai";
import readline from "readline";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

userInterface.prompt();
userInterface.on("line", async (input) => {
  const ansapi = [];
  await getJson({
    engine: "google",
    q: input,
    api_key: process.env.REACT_APP_SERP_API_KEY
  }, (json) => {
    // console.log(json["organic_results"]);
    json["organic_results"].map((data) => {
      ansapi.push(data.snippet);
    })
  });



  const prompt = `Hey GPT if user is interacting with you please do interact with user as you do normally on the other side if user want some facts then only refer the data provided to you, this is the interaction of user ${input} please refer the data I have privided only if required ${ansapi}, please do remember the context of the chat what is going on with the user user may ask or inquire regarding previously asked question, user may also ask to provide calculation regarding numerical data in the previous answer please do provide calculated answer not only the formulae.`;
   await openai.chat.completions
    .create({
      messages: [{ role: "user", content: prompt  }],
      model: "gpt-3.5-turbo",
    })
    .then((result) => {
      console.log(result.choices[0].message.content);
      userInterface.prompt();
    })
    .catch((error) => {
      console.log(error);
    });
});
