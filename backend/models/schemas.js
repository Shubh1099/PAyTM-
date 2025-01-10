const { z } = require("zod");

const signupSchema = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

const updateBody = z.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

module.exports = { signupSchema, signinSchema, updateBody };
