import { z, ZodError } from "zod";
export function userValidation(req, res, next) {
  try {
    const username = z
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "Field Username Cannot Be Empty"
            : "Invalid input on username",
      }).min(1, "Field Username Cannot Be Empty")
      .parse(req.body.username);
    const email = z
      .email({
        error: (iss) =>
          iss.input === undefined
            ? "Field Email Cannot Be Empty"
            : "Invalid input on email",
      })
      .parse(req.body.email);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const err = new Error(error.issues[0].message);
      err.statusCode = 400;
      next(err);
    } else {
      next(error);
    }
  }
}

export function adminValidation (req, res, next){
  try {
    const {role} = req.user
    if(role != "admin"){
      const err = new Error("Forbidden")
      err.statusCode = 403
      next(err)
    }
    z.object({
      email: z
      .email({
        error: (iss) =>
          iss.input === undefined
            ? "Field Email Cannot Be Empty"
            : "Invalid input on email",
      })
      .refine(
        (val) => val.endsWith("@mail.ugm.ac.id") || val.endsWith("@ugm.ac.id"),
        "Invalid email, please using ugm email"
      )
    }).parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      const err = new Error(error.issues[0].message);
      err.statusCode = 400;
      next(err);
    } else {
      next(error);
    }
  }
}