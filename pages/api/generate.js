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

  const input = req.body.input || "";

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 0.6,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const rawResponse = completion.data.choices[0].text;
    const formattedResponse = formatResponse(rawResponse);

    res.status(200).json({ result: formattedResponse });
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
  return `Brainstorm an original marketing campaign for ${input.companyName}, an ${input.companyDescription}. Let your imagination run wild. Provide as much detail as possible and a creative brief.

  PRODUCT DESCRIPTION: ${input.productDescription}
  
  TARGET AUDIENCE: ${input.audienceDescription}
  
  Please format the output as follows:
  - Campaign Name: ...
  - Tagline: ...
  - Campaign Description: ...
  - Platforms: ...
  - Messaging: ...
  - Visuals: ...
  - Call to Action: ...`;
}

function formatResponse(rawResponse) {
  const sections = [
    "Campaign Name",
    "Tagline",
    "Campaign Description",
    "Platforms",
    "Messaging",
    "Visuals",
    "Call to Action",
  ];

  const formattedResponse = {};

  for (let i = 0; i < sections.length; i++) {
    const sectionStartIndex = rawResponse.indexOf(sections[i]);
    if (sectionStartIndex !== -1) {
      const sectionEndIndex =
        i === sections.length - 1
          ? rawResponse.length
          : rawResponse.indexOf(sections[i + 1]);

      const sectionContent = rawResponse
        .slice(sectionStartIndex, sectionEndIndex)
        .replace(sections[i], "")
        .replace(":", "") // Remove the colon after the section header
        .trim();

      formattedResponse[sections[i]] = sectionContent;
    }
  }

  return formattedResponse;
}

