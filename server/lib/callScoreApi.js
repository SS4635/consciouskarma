import axios from "axios";
import { decrypt } from "./cryptoUtil.js";

export async function callScoreApi(mobileNumber) {
  const apiKey = decrypt(
    process.env.SCORE_API_KEY_ENCRYPTED,
    process.env.SCORE_API_SECRET
  );

  const { data } = await axios.post(
    process.env.SCORE_API_URL,
    { mobile_number: mobileNumber },
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      timeout: 10000,
    }
  );

  return data.score || data;
}
