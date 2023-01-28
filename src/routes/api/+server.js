import { Configuration, OpenAIApi } from "openai";

import rateLimit from './ratelimit'

import { error, json } from '@sveltejs/kit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, setHeaders }) {

  try {
    await limiter.check(setHeaders, 8, 'CACHE_TOKEN') // 8 requests per minute
  } catch {
    throw error(429, 'Rate limit exceeded')
  }

  const { userPrompt } = await request.json();
  if (userPrompt?.length < 1) {
    throw error(400, 'user prompt is required');
  }
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
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
  console.log(response.data.choices)
  return json({ response: response.data.choices[0].text });
}

