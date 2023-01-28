# Unpwnable - The prompt that cannot be leaked!

demo: https://unpwnable.netlify.app/

## What is this?

This is a test of the "Unpwnable" prompt injection protection strategy. We want to demonstrate that you can take normal product prompts and sufficiently protect against prompt injection attacks.

First, you can verify that the prompt works as advertised, by submitting topics you would like GPT3 to write about (e.g. "dog", "netlify", "obama"). In the API we've used a simple prompt that is meant to be reflective of a realistic product prompt, with our "unpwnable" protection strategy.

Your **real mission, should you choose to accept it, is to [reverse engineer the source prompt](https://lspace.swyx.io/p/reverse-prompt-eng) to as high fidelity as possible**, within our rate limit.

You can leave your guesses and process in the accompanying blogpost.

The prompt is a simple variation on real product prompts:

- a ~90 word, ~500 character string
- starting with "You are an assistant"
- ending by concatenating the user input to the source prompt
- There are NO special characters or formatting used to protect the prompt

It's [SHA-256 hash](https://emn178.github.io/online-tools/sha256.html) is [`bcd4943b7bd06818d182270aad1455d649c9cbaaa319d1a4a8d5deb3aba0145b`](https://twitter.com/swyx/status/1619219997469052928?s=20).

We will publish the source prompt and code in a few days; you can then compare your results to the actual prompt.