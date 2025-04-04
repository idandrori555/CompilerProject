import { execSync } from "node:child_process";
import fs from "node:fs/promises";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Or your specific origin
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

let fileExt = "",
  command = "";

Deno.serve(async (_req) => {
  if (!(_req.method == "POST"))
    return new Response("Method not allowed", { status: 405 });

  const urlPath = new URL(_req.url).pathname.toLowerCase();
  const fileName = crypto.randomUUID().toString();

  switch (urlPath) {
    case "/java":
      fileExt = ".java";
      command = `java ${fileName}.java`;
      break;

    case "/javascript":
      fileExt = ".js";
      command = `node ${fileName}.js`;
      break;

    default:
      break;
  }

  if (!fileExt || !command) {
    return new Response("Bad request", { status: 400, headers });
  }

  const json = (await _req.json()) as { code: string };
  const { code } = json;

  if (!(typeof code == "string"))
    return new Response("Bad request", { status: 400, headers });

  await fs.writeFile(`./${fileName}${fileExt}`, code);

  try {
    const stdout = execSync(command);

    return new Response(JSON.stringify({ stdout: stdout.toString() }), {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({
        error: `${(err as { stderr: string })?.stderr?.toString()}`,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
});
