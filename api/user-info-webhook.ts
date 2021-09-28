import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const GITHUB_USER_ENDPOINT_URL = `https://api.github.com/user`;

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    const accessToken = req.body.accessToken;

    // Get public user profile
    const userResponse = await axios.get(GITHUB_USER_ENDPOINT_URL, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    // Get public user email (not always public, depends if user decided to exclude email from public profile)
    const emailDataResponse = await axios.get(
      `${GITHUB_USER_ENDPOINT_URL}/emails`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    res.json({
      sub: userResponse.data.id,
      name: userResponse.data.name,
      email: emailDataResponse.data
        .filter((emailData: { primary: boolean }) => emailData.primary == true)
        .map((emailData: { email: string }) => emailData.email)[0],
      picture: userResponse.data.avatar_url,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
