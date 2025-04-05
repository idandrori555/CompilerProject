// @ts-types="npm:@types/express@4.17.15"

import express from "express";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";

const app = express();
const PORT = 80;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Or your specific origin
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

let fileExt = "",
  command = "";

const executeCommand = (command: string) => {
  return execSync(command);
};

app.post("/api/", (req, res) => {});

app.listen(PORT, () => console.log("OPEN ON: http://127.0.0.1:" + PORT));
