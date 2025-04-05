import express from "npm:express";
import cors from "npm:cors";

import { exec, execSync } from "node:child_process";
import fs from "node:fs/promises";
import path, { dirname } from "node:path";

import { Command, LANG, Language } from "./types.ts";

const __dirname = dirname(import.meta.url);

const app = express();
const PORT = 80;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

const executeCommand = (command: string) => {
  try {
    return execSync(command).toString();
  } catch (err) {
    throw err;
  }
};

const EXEC_DIR_PATH = "dist";

const resolveLanguage = (languageName: string): Language => {
  const language: Language = {
    name: languageName,
    fileExtension: "",
  };

  switch (languageName) {
    case LANG.JAVA:
      language.name = "java";
      language.fileExtension = ".java";
      break;

    case LANG.JAVASCRIPT:
      language.name = "javascript";
      language.fileExtension = ".js";
      break;

    case LANG.PYTHON:
      language.name = "python";
      language.fileExtension = ".py";
      break;

    default:
      break;
  }

  return language;
};

const generateFileName = () => crypto.randomUUID();

const createFile = async (fileName: string, fileExt: string, code: string) =>
  await fs
    .writeFile(`./${EXEC_DIR_PATH}/${fileName}${fileExt}`, code)
    .catch((err) => console.error(err));

const getCommand = (lang: Language, fileName: string): Command => {
  switch (lang.name) {
    case LANG.JAVA:
      return `java ./${EXEC_DIR_PATH}/${fileName}${lang.fileExtension}`;

    case LANG.JAVASCRIPT:
      return `node ./${EXEC_DIR_PATH}/${fileName}${lang.fileExtension}`;

    case LANG.PYTHON:
      return `python ./${EXEC_DIR_PATH}/${fileName}${lang.fileExtension}`;

    default:
      break;
  }

  return "";
};

const createAndRun = async (code: string, langName: string) => {
  const langObject = resolveLanguage(langName);
  const fileName = generateFileName();
  const command = getCommand(langObject, fileName);

  await createFile(fileName, langObject.fileExtension, code);

  return executeCommand(command);
};

app.post("/api/:language", async (req, res) => {
  try {
    const response = await createAndRun(req.body?.code, req.params.language);
    console.log(response);
    res.json({ out: response });
  } catch (error) {
    res.status(500).json({ out: error?.toString() || "Error!" });
  }
});

app.get("/", (_req, res) => {
  console.log(path.join(__dirname, "public", "index.html"));

  res.sendFile(path.join(__dirname, "index.html"), (err) => {
    if (err) {
      console.error("Error sending file");
      res.status(500).send("Error sending file");
    } else {
      console.log("File sent successful");
    }
  });
});

app.listen(PORT, () => console.log(`OPEN ON: http://127.0.0.1:${PORT}`));
