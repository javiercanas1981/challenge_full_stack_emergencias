import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export const validationMiddleware = (dtoClass: any) => {
  return async (req: any, res: any, next: any) => {
    const instance = plainToInstance(dtoClass, req.body);
    const validationErrors: ValidationError[] = await validate(instance);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints
            ? Object.values(error.constraints)
            : [],
          children: error.children?.length
            ? error.children.map((c) => ({
                property: c.property,
                constraints: Object.values(c.constraints || {}),
              }))
            : [],
        })),
      });
    }

    req.body = instance;
    next();
  };
};
