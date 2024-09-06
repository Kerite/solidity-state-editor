import { NextResponse } from "next/server";
import axios from "axios";

//Max rate limit reached, please use API Key for higher rate limit  【ps: dev key】
const getLoopData = async (fetchUrl) => {
  const res = await axios.get(fetchUrl);
  if (
    res.data.status === "0" &&
    String(res.data.result).indexOf("Max rate limit reached") > -1
  ) {
    return await getData(fetchUrl);
  }
  return res;
};

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const APIKEY = process.env.APIKEY;
  const ETHERSCAN_URL = process.env.ETHERSCAN_URL;

  const fetchUrl = `${ETHERSCAN_URL}?module=contract&action=getsourcecode&address=${address}&apikey=${APIKEY}`;
  console.log("fetchUrl", fetchUrl);

  const { data } = await getLoopData(fetchUrl);
  return NextResponse.json(data);
}
