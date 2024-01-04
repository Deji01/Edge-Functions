// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { Configuration, OpenAIApi } from "https://esm.sh/openai-edge@1.2.2";
import { OpenAIStream, StreamingTextResponse } from "https://esm.sh/ai@2.2.31";
import "https://deno.land/x/xhr@0.3.1/mod.ts";
// import "https://esm.sh/axios@1.6.4";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});
const openai = new OpenAIApi(configuration);

Deno.serve(async (req) => {
  const { messages } = await req.json();


  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    stream: true
  });

  const stream = OpenAIStream(response);
  console.log(stream);
  return new StreamingTextResponse(stream);

  // return new Response(
  //   JSON.stringify({ id, text }),
  //   { headers: { "Content-Type": "application/json" } },
  // );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/openai' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"query":"Hello"}'

*/
