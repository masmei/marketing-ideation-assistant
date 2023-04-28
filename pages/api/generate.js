import { Configuration, OpenAIApi } from "openai";

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

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

  const input = req.body.input || "";

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 1,
      max_tokens: 600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      format: "text",
    });

    const result = completion.data.choices[0].text.trim();

    res.status(200).json({ result });
  } catch (error) {
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

function generatePrompt(input) {
  return `Brainstorm 6 original marketing campaign ideas for ${input.companyName}, an ${input.companyDescription}. Let your imagination run wild. Provide as much detail as possible and a creative brief.

  PRODUCT DESCRIPTION: ${input.productDescription}.
  
  TARGET AUDIENCE: ${input.audienceDescription}.
 `;
}


