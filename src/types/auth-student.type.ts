import { StudentType } from "@prisma/client";

export interface AuthStudent {
  id: string;
  email: string;
  name: string;
  type: StudentType;
}
