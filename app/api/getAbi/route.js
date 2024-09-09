import { NextResponse } from "next/server";
import { NetworkOrigin } from "../index";
import axios from "axios";

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const network = url.searchParams.get("network");

  const { ORIGIN, APIKEY } = NetworkOrigin[network];

  const fetchUrl = `${ORIGIN}?module=contract&action=getabi&address=${address}&apikey=${APIKEY}`;
  console.log("fetchUrl", fetchUrl);

  const { data } = await axios.get(fetchUrl);
  return NextResponse.json(data);
}
