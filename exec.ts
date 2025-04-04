import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { url } from "node:inspector";

const MAIN_TEMPLATE = `
public class Temp {
    public static void main(String[] args){
        $CODE$
    }
}
`;

const JAVASCRIPT_TEMPLATE = `
$CODE$
`;

let template = "",
  fileExt = "",
  command = "";

Deno.serve(async (_req) => {
  if (!(_req.method == "POST"))
    return new Response("Method not allowed", { status: 405 });

  const urlPath = new URL(_req.url).pathname.toLowerCase();

  const fileName = crypto.randomUUID().toString();
  const language = urlPath.slice(0, urlPath.length);

  switch (urlPath) {
    case "/java":
      template = MAIN_TEMPLATE;
      fileExt = ".java";
      command = "java fileName.java";
      break;

    case "/javascript":
      template = JAVASCRIPT_TEMPLATE;
      fileExt = ".js";
      command = "node fileName.js";
      break;

    default:
      break;
  }

  if (!fileExt || !command) {
    return new Response("Bad request", { status: 400 });
  }

  const json = (await _req.json()) as { code: string };
  const { code } = json;

  if (!(typeof code == "string"))
    return new Response("Bad request", { status: 400 });

  await fs.writeFile(
    `./dist/${language}/${fileName}.${fileExt}`,
    template.replace("$CODE$", code)
  );

  try {
    const stdout = execSync(command);
    return new Response(JSON.stringify({ stdout: stdout.toString() }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: `${err?.stderr?.toString() || ""}` }),
      {
        status: 500,
      }
    );
  }
});
