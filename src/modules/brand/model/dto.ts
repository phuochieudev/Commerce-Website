import { z } from "zod";
import { ModelStatus } from "../../../share/model/base-model";
import { ErrBrandNameTooShort } from "./errors";

export  const BrandCreateDTOSchema = z.object({
    name: z.string().min(2, ErrBrandNameTooShort.message).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
  });
export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>;


export  const BrandUpdateDTOSchema = z.object({
    name: z.string().min(2, ErrBrandNameTooShort.message).optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
  });
  
export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>;

export type BrandCondDTO = {};