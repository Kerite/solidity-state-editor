import { BigNumber } from "ethers";
import type { AbiItem } from "@/units/index";

const formatObject: any = (params: Object) => {
  if (Array.isArray(params)) {
    return params
      .map((v: any) => {
        return formatObject(v);
      })
      .join(",");
  } else if (BigNumber.isBigNumber(params)) {
    return params.toString();
  } else {
    return params;
  }
};

const formatRenderResult = (params: any, outputs: AbiItem["outputs"]) => {
  if (!params) return "--";
  const type = typeof params;

  console.log(type, params, 33);
  switch (type) {
    case "string":
      return params;
    case "number":
      return params;
    case "object":
      return formatObject(params);
    default:
      return "not find";
  }
};

export default formatRenderResult;
