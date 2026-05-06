import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export const validationMiddleware = (dtoClass: any) => {
  return async (req: any, res: any, next: any) => {
    const instance = plainToInstance(dtoClass, req.body);
    const validationErrors: ValidationError[] = await validate(instance);

    if (validationErrors.length > 0) {
      const mapErrors = (errors: ValidationError[]): any[] => {
        return errors.map((error) => ({
          property: error.property,
          constraints: error.constraints
            ? Object.values(error.constraints)
            : [],
          children: error.children?.length ? mapErrors(error.children) : [],
        }));
      };

      return res.status(400).json({
        message: "Validation failed",
        errors: mapErrors(validationErrors),
      });
    }

    req.body = instance;
    next();
  };
};
