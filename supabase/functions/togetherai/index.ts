// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

export const runtime = "edge";

Deno.serve(async (req) => {
  const { query } = await req.json();
  const url = "https://api.together.xyz/v1/chat/completions";
  const apiKey = Deno.env.get("TOGETHER_API_KEY")!;

  const headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  });

  const data = {
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: "You are an AI assistant",
      },
      {
        role: "user",
        content: query,
      },
    ],
  };

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // const { id, choices: [{ message: { content } }] } = result;
    // result?.choices[0].message.content
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }

  return new Response(
    JSON.stringify(result),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/togetherai' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"query":"Who won the world series in 2020?"}'

*/
