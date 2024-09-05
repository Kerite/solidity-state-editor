import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const APIKEY = process.env.APIKEY;
  const ETHERSCAN_URL = process.env.ETHERSCAN_URL;

  const fetchUrl = `${ETHERSCAN_URL}?module=contract&action=getsourcecode&address=${address}&apikey=${APIKEY}`;
  console.log("fetchUrl", fetchUrl);

  const { data } = await axios.get(fetchUrl);
  return NextResponse.json(data);
}
