import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const sentence = req.body.sentence || "";
  if (sentence.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid sentence",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "ada:ft-personal-2023-02-05-17-50-28",
      //model: "davinci:ft-personal-2023-02-03-03-19-49",
      prompt: generatePrompt(sentence),
      stop: "\\n",
      //requency_penalty: -2,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(sentence) {
  return `${sentence} ->`;
}
