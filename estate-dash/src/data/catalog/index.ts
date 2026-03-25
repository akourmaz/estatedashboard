import rawProperties from "./properties.raw.json";
import metadata from "./metadata.json";
import { Property } from "@/lib/types";

export const catalogProperties = rawProperties as Property[];

export const catalogMetadata = metadata as {
  sourceFile: string;
  sheetName: string;
  rowCount: number;
  generatedAt: string;
};

export default catalogProperties;