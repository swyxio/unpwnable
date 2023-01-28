<script>
	let txt = '';
	/** @type any */
	let res;
  let oaikey = '';

	async function submit() {
		res = fetch('/api', {
			method: 'POST',
			body: JSON.stringify({ userPrompt: txt, oaikey }),
			headers: {
				'content-type': 'application/json'
			}
		}).then(async (res) => {
			if (res.ok) {
				const result = await res.json();
				console.log('api response:', result); // logging this to help users debug
				return result;
			} else {
				throw new Error(res.statusText);
			}
		});
	}
</script>

<h1>Welcome to Unpwnable - A Capture the Prompt contest!</h1>

<!-- // textarea input that is big enough to hold the whole text -->
<form on:submit={submit}>
	Please brainstorm pros and cons about:
	<!-- lastpass is crap and throws onloadwff.js errors https://github.com/mui/material-ui/issues/14860 -->
	<textarea
		data-lpignore="true"
		autocomplete="off"
		placeholder="write either a random topic to brainstorm (dog, clouds, college) or your prompt injection prompt"
		rows="8"
		bind:value={txt}
	/>
	<!-- submit button -->
	<button type="submit">Submit</button>
</form>

{#await res}
	<p class="italic">Waiting for API response...</p>
{:then res}
	{#if res}
		<pre>{res.response.trim()}</pre>
	{:else}
		<p class="italic">write a prompt...</p>
	{/if}
{:catch error}
	<p class="italic">Something went wrong: Error code {error.code} {error.message}</p>
{/await}

<h2>What is this?</h2>

<p>
	This is a test of the "Unpwnable" prompt injection protection strategy (<a href="https://simonwillison.net/2022/Sep/12/prompt-injection/">what is prompt injection?</a>). We want to demonstrate
	that you can take normal product prompts, modify them slightly, and <b>sufficiently protect against prompt injection
	attacks, WHILE preserving the original functionality</b>.
</p>
<p>
	First, you can verify that the prompt works as advertised, by submitting topics you would like
	GPT3 to write about (e.g. "dog", "netlify", "sam altman"). In the API we've used a simple prompt that
	is meant to be reflective of a realistic product prompt, with our "unpwnable" protection strategy.
</p>
<p>
	Your <b
		>real mission, should you choose to accept it, is to <a
			href="https://lspace.swyx.io/p/reverse-prompt-eng">reverse engineer the source prompt</a
		> to as high fidelity as possible</b
	>.
</p>
<p>You can leave your guesses and process in the accompanying HN post. 
  We expect that you will get no more than the first sentence (16 words) of the source prompt.
</p>
<p>
  There is a rate limit (which is there for my wallet's sake).
  You can add your OpenAI key here to bypass the rate limit:
  <input type="text" placeholder="your own OpenAI key" bind:value={oaikey} />
  {#if oaikey}
    <span class="whee">will be submitted together with the prompt!</span>
  {:else}
  (it's not saved anywhere on my end but you'll have to trust me until I open source this)
  {/if}
</p>
<p>The source prompt is a simple variation on real product prompts:</p>
<ul>
	<li>a ~90 word, ~500 character string</li>
	<li>starting with "You are an assistant"</li>
	<li>ending by concatenating the user input to the source prompt</li>
	<li>There are NO special characters or formatting used to protect the prompt</li>
</ul>
<p>
  We will publish the source prompt and code in a few days; you can then compare your results to the
	actual prompt.
</p>
<p>
  It's
  <a href="https://emn178.github.io/online-tools/sha256.html">SHA-256 hash</a> is
  <code>f9f91bed2ce346dcb0bc0b6c7dd1bb22c615e3ad0e855fbfe35ac53649c16a97</code> (due to whitespace it would be unrealistic to expect that you will get an exact match, but it'd be a really cool bonus if you do).
</p>

<style>
  .whee {
    color: green;
  }
	pre {
		background-color: lightgray;
		padding: 2rem;
		margin: 1rem;
		border-radius: 2rem;
		overflow: scroll;
	}
	.italic {
		font-style: italic;
	}

	/* set height and width for input type text */
	/* input[type='text'] {
    height: 5rem;
    width: 20rem;
    word-break: break-word;
  } */

	form {
		max-width: 20rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
