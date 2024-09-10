import { NextResponse } from "next/server";
import { NetworkOrigin } from "../index";
import axios from "axios";

//Max rate limit reached, please use API Key for higher rate limit  【 dev key】
const getLoopData = async (fetchUrl) => {
  const res = await axios.get(fetchUrl);
  if (
    res.data.status === "0" &&
    String(res.data.result).indexOf("Max rate limit reached") > -1
  ) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve(getLoopData(fetchUrl)));
    });
  }
  return res;
};

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const network = url.searchParams.get("network");

  const { ORIGIN, APIKEY } = NetworkOrigin[network];

  const fetchUrl = `${ORIGIN}?module=contract&action=getsourcecode&address=${address}&apikey=${APIKEY}`;
  console.log("fetchUrl-----", fetchUrl);

  const { data } = await getLoopData(fetchUrl);
  return NextResponse.json(data);
}
