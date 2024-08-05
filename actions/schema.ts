import { z } from "zod";

const _fileSchema = z.instanceof(File, { message: "Required" });

export const imageSchema = _fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);
