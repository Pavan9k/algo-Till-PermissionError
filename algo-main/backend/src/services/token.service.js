import fs from "fs";
import { kite } from "../config/kite.js";

const FILE = "./token.json";

export const loadToken = (cb) => {
  if (!fs.existsSync(FILE)) return false;

  const data = JSON.parse(fs.readFileSync(FILE));
  const today = new Date().toISOString().slice(0, 10);

  if (data.date === today && data.access_token) {
    kite.setAccessToken(data.access_token);
    cb(data.access_token);
    return true;
  }
  return false;
};

export const saveToken = (token) => {
  fs.writeFileSync(
    FILE,
    JSON.stringify(
      { access_token: token, date: new Date().toISOString().slice(0, 10) },
      null,
      2
    )
  );
};
