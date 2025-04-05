// @ts-types="npm:@types/express@4.17.15"

import express, { Request, Response, NextFunction } from "express";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const app = express();

const PORT = 3000;
const FILE_DIRECTORY = "./";
const RESPONSE_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

enum Language {
  Java = "java",
  JavaScript = "javascript",
}

const LANGUAGE_DETAILS: Record<
  Language,
  { fileExt: string; command: (filename: string) => string }
> = {
  [Language.Java]: {
    fileExt: ".java",
    command: (filename) => `java ${filename}.java`,
  },
  [Language.JavaScript]: {
    fileExt: ".js",
    command: (filename) => `node ${filename}.js`,
  },
};

app.use(express.json());

/**
 * Interface for request body containing code.
 */
interface CodeRequestBody {
  code: string;
}

/**
 * Middleware to set response headers for CORS.
 */
function setResponseHeaders(_req: Request, res: Response, next: NextFunction) {
  res.set(RESPONSE_HEADERS);
  next();
}

/**
 * Determines file extension and command based on language path.
 * @param path - The request path
 * @param fileName - The base filename to be used
 * @returns Object with file extension and execution command
 */
function getExecutionDetails(
  path: string,
  fileName: string
): { fileExt: string; command: string } {
  const languageKey = path.replace("/", "").toLowerCase() as Language;
  const details = LANGUAGE_DETAILS[languageKey];

  if (!details) return { fileExt: "", command: "" };

  return {
    fileExt: details.fileExt,
    command: details.command(fileName),
  };
}

/**
 * Writes the code to a file.
 * @param path - The file path
 * @param code - The code content
 */
async function writeCodeToFile(path: string, code: string): Promise<void> {
  await fs.writeFile(path, code);
}

/**
 * Deletes a file.
 * @param path - The file path
 */
async function deleteFile(path: string): Promise<void> {
  await fs.unlink(path).catch(() => {});
}

/**
 * Executes a command synchronously and returns the output.
 * @param command - The command to execute
 * @returns The stdout as string
 */
function executeCode(command: string): string {
  return execSync(command, { stdio: "pipe" }).toString();
}

app.use(setResponseHeaders);

app.options("*", (_req, res) => {
  res.sendStatus(200);
});

app.post(
  [`/${Language.Java}`, `/${Language.JavaScript}`],
  async (req: Request, res: Response) => {
    const urlPath = req.path;
    const fileName = randomUUID();
    const { fileExt, command } = getExecutionDetails(urlPath, fileName);

    if (!fileExt || !command) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const { code } = req.body as CodeRequestBody;

    if (typeof code !== "string") {
      return res.status(400).json({ error: "Code must be a string" });
    }

    const filePath = `${FILE_DIRECTORY}${fileName}${fileExt}`;
    await writeCodeToFile(filePath, code);

    try {
      const stdout = executeCode(command);
      res.status(200).json({ stdout });
    } catch (err: any) {
      const stderr = err.stderr?.toString() || "Unknown error";
      res.status(500).json({ error: stderr });
    } finally {
      await deleteFile(filePath);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
