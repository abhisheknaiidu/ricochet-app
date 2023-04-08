import { tokenArray } from "./polygon_config";
import { mumbaiTokenArray } from "./mumbai_config";
import { optimismTokenArray } from "./optimism_config";

export const unifiedArray = [
  ...tokenArray,
  ...mumbaiTokenArray,
  ...optimismTokenArray,
]