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
        console.log('api error:', res);
				throw res;
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
	<p class="italic">
		Something went wrong (either your API key has issues or the API is down). More info in console.
	</p>
{/await}

<h2>What is this?</h2>

<p>
	This is a demo of the "Unpwnable" prompt injection protection strategy (<a
		href="https://simonwillison.net/2022/Sep/12/prompt-injection/">what is prompt injection?</a
	>). We want to demonstrate that you can take normal (not contrived, not super defensive) product prompts, and modify them only slightly to
	<b
		>sufficiently protect against prompt injection attacks, WHILE preserving the original
		functionality</b
	>. It's been pwned during the playtest, so "Unpwnable" is a misnomer, but everyone had fun trying so we're just releasing it as is.
</p>
<hr />
<p>
	First, you can verify that the prompt works as advertised, by submitting topics you would like
	GPT3 to write about (e.g. "dog", "netlify", "sam altman"). In the API we've used a simple prompt
	that is meant to be reflective of a realistic product prompt.
</p>
<p>
	Your <b
		>real mission, should you choose to accept it, is to <a
			href="https://lspace.swyx.io/p/reverse-prompt-eng">reverse engineer the source prompt</a
		> to as high fidelity as possible</b
	>. In other words, try to obtain as much of the "hidden" prefix string that is prepended to your
	input before it is sent to GPT3.
</p>
<p>
	There are multiple rate limits (which is there for my wallet's sake). You can add your OpenAI key here to save me money +
	bypass all of the rate limits:
	<input type="text" placeholder="your own OpenAI key" bind:value={oaikey} />
	{#if oaikey}
		<span class="whee">will be submitted together with the prompt!</span>
	{:else}
		(it's not saved anywhere on my end but you'll have to trust me until I open source this. You can also set a hard limit in the OpenAI dashboard to protect against abuse, and delete the key when you are done playing.)
	{/if}
</p>

<p>You can leave your guesses and process in <a href="https://lspace.swyx.io/p/jan-2023-update?sd=pf">the accompanying Substack post</a> (dont post guesses on HN or social media in case it spoils it for others!). </p>
<p>
	I will publish the source prompt and code in a few days; you can then compare your results to the
	actual prompt. <b><a href="https://lspace.swyx.io/">Leave an email</a> to get notified</b> when we publish!
</p>
<details>
	<summary>
		<b>Hints/Checks (do not open if you want as realistic a challenge as possible)</b>
	</summary>

  The source prompt is a simple variation on real product prompts:
  <ul>
    <li>a 93 word, 517 character string (when pasted in <a href="https://wordcounter.net/">wordcounter</a>)</li>
    <li>starting with "You are an assistant"</li>
    <li>ending by concatenating the user input to the source prompt</li>
    <li>There are NO special characters or formatting (JSON or otherwise), and NO regex or postprocessing used to protect the prompt</li>
  </ul>
  <p>We expect that:</p>
  <ul>
    <li>Most will get no more than the first sentence (16 words) of the source prompt.</li>
    <li>Some will get the first 3 sentences (34 words).</li>
    <li>Two beta testers have found enough words to win (>80 words verbatim) using 2 different techniques. We've strengthened the protection since, and cannot reproduce them now. Try not to peek anyway!</li>
  </ul>

  <p>
    The source prompt's
    <a href="https://emn178.github.io/online-tools/sha256.html">SHA-256 hash</a> is
    <code>cf58ad59e753e80419325ce57901efe40b4e141d819a13b9c0ba2d0c3402de50</code> (due to whitespace/nondeterminism/misc reasons, don't bother trying to get an exact match, but it'd be a really cool bonus if
    you did). Mostly I just want to prove that I'm not lying about the prompt when I eventually release it.
  </p>
  

</details>
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
