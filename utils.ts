import { execSync } from "node:child_process";
import { LANG, Language } from "./types.ts";
import fs from "node:fs/promises";

/**
 * Executes a shell command and returns the output as a string.
 * @param {string} command - The command to execute.
 * @returns {string} - The output of the executed command.
 * @throws {Error} - Throws an error if the command execution fails.
 */
const executeCommand = (command: string): string => {
  try {
    return execSync(command).toString();
  } catch (err) {
    throw err;
  }
};

const EXEC_DIR_PATH = "compiled";

/**
 * Resolves the language details based on the provided language name.
 * @param {string} languageName - The name of the programming language.
 * @returns {Language} - An object containing the language name and file extension.
 */
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

/**
 * Generates a unique file name using a UUID.
 * @returns {string} - A unique file name.
 */
const generateFileName = (): string => crypto.randomUUID();

/**
 * Creates a file with the specified name, extension, and content.
 * @param {string} fileName - The name of the file to create.
 * @param {string} fileExt - The file extension.
 * @param {string} code - The content to write to the file.
 * @returns {Promise<void>} - A promise that resolves when the file is created.
 */
const createFile = async (
  fileName: string,
  fileExt: string,
  code: string
): Promise<void> =>
  await fs
    .writeFile(`./${EXEC_DIR_PATH}/${fileName}${fileExt}`, code)
    .catch((err) => console.error(err));

/**
 * Constructs the command to execute a file based on its language and file name.
 * @param {Language} lang - The language object containing name and file extension.
 * @param {string} fileName - The name of the file to execute.
 * @returns {string} - The command to execute the file.
 */
const getCommand = (lang: Language, fileName: string): string => {
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

/**
 * Creates a file with the provided code, resolves the language, and executes the file.
 * @param {string} code - The source code to write to the file.
 * @param {string} langName - The name of the programming language.
 * @returns {Promise<string>} - The output of the executed command.
 */
const createAndRun = async (
  code: string,
  langName: string
): Promise<string> => {
  const langObject = resolveLanguage(langName);
  const fileName = generateFileName();
  const command = getCommand(langObject, fileName);

  await createFile(fileName, langObject.fileExtension, code);

  return executeCommand(command);
};

export { createAndRun };
