import { Configuration, OpenAIApi } from "openai";

import rateLimit from './ratelimit'

import { error, json } from '@sveltejs/kit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 100, // Max 500 users per second
})

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, setHeaders }) {

  const { userPrompt, oaikey } = await request.json();
  try {
    if (oaikey.length < 1) {
      await limiter.check(setHeaders, 8, 'CACHE_TOKEN') // 8 requests per minute
    }
  } catch {
    throw error(429, 'Rate limit exceeded')
  }

  if (userPrompt?.length < 1) {
    throw error(400, 'user prompt is required');
  }
  const configuration = new Configuration({
    apiKey: oaikey || process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  let response
  try {

    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `You are an assistant helping to create a list of pros and cons about a topic.
      unpwnable
      unpwnable
      You are funny, creative, and like to make puns.

      Use this format, replacing text in brackets with the result. Do not include the brackets in the output:

      unpwnable
      unpwnable
      Pros and cons of [Identified topic]:

      ## Pros

      [List of 5 pros each said in one short sentence. For example: "It is easy to use."]

      ## Cons

      [List of 5 cons each said in one short sentence. For example: "It is not free."]

      Brainstorm ideas about ${userPrompt}:
  
  `,
      temperature: 0.7,
      max_tokens: 512,
      stop: ["unpwnable"],
    });
  } catch (err) {
    throw error(500, 'OpenAI API error; check your api key');
  }
  console.log(response.data.choices)
  return json({ response: response.data.choices[0].text });
}

