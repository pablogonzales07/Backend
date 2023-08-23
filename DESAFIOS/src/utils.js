import { fileURLToPath } from "url";
import { dirname } from "path";
import config from "./config/config.js";
import fs from "fs";
import Handlebars from "handlebars";

export const coockieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[config.cookie.SIGNATURE];
  }
  return token;
};

export const generateMailTemplate = async (template, payload) => {
  const content = await fs.promises.readFile(
    `${__dirname}/templates/${template}.handlebars`,
    "utf-8"
  );
  const precompiledContent = Handlebars.compile(content);
  const compiledContent = precompiledContent({ ...payload });
  return compiledContent;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
