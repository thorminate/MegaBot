import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

interface Options {
  header: string;
  folder?: string;
  payload?: string;
  type?: "fatal" | "error" | "warn" | "info" | "verbose" | "debug" | "silly";
}

const __dirname = fileURLToPath(import.meta.url); // Get the current directory name.

export default (options: Options) => {
  let { folder, payload, header, type } = options;

  if (!header) return;

  const date = new Date();

  const logFolder = path.join(__dirname, "..", "..", "..", "logs");

  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder, {
      recursive: true,
    });
  }
  if (!folder) {
    folder = logFolder;
  }
  const logStream = fs.createWriteStream(
    path.join(folder, `${date.toISOString().slice(0, 10)}.log`),
    { flags: "a" }
  );

  if (payload) {
    const logContent = `${header} - ${date.toLocaleTimeString()}\n${payload}\n`;
    switch (type) {
      case "fatal":
        logStream.write(`Fatal error: ${logContent}`);
        break;
      case "error":
        logStream.write(`Error: ${logContent}`);
        break;
      case "warn":
        logStream.write(`Warning: ${logContent}`);
        break;
      case "info":
        logStream.write(`Info: ${logContent}`);
        break;
      case "verbose":
        logStream.write(`Verbose: ${logContent}`);
        break;
      case "debug":
        logStream.write(`Debug: ${logContent}`);
        break;
      case "silly":
        logStream.write(`${logContent}`);
        break;
      default:
        logStream.write(`${logContent}`);
        break;
    }
  } else {
    const logContent = `${header} - ${date.toLocaleTimeString()}\n`;
    switch (type) {
      case "fatal":
        logStream.write(`Fatal error: ${logContent}`);
        break;
      case "error":
        logStream.write(`Error: ${logContent}`);
        break;
      case "warn":
        logStream.write(`Warning: ${logContent}`);
        break;
      case "info":
        logStream.write(`Info: ${logContent}`);
        break;
      case "verbose":
        logStream.write(`Verbose: ${logContent}`);
        break;
      case "debug":
        logStream.write(`Debug: ${logContent}`);
        break;
      case "silly":
        logStream.write(`${logContent}`);
        break;
      default:
        logStream.write(`${logContent}`);
        break;
    }
  }
};
