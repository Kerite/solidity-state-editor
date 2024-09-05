import { NextResponse } from "next/server";
import axios from "axios";

import { list1 } from "./mock";

export async function GET(request) {
  // const _data = {
  //   status: "1",
  //   result: JSON.stringify(list1),
  // };
  // return NextResponse.json(_data);

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const APIKEY = process.env.APIKEY;
  const ETHERSCAN_URL = process.env.ETHERSCAN_URL;

  const fetchUrl = `${ETHERSCAN_URL}?module=contract&action=getabi&address=${address}&apikey=${APIKEY}`;
  console.log("fetchUrl", fetchUrl);

  const { data } = await axios.get(fetchUrl);
  return NextResponse.json(data);
}
