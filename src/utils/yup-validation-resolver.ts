import { useCallback } from 'react';
import * as yup from 'yup';

export default (
  validationSchema: yup.ObjectSchema<any>,
) =>
  useCallback(
    async (data: any) => {
      try {
        const values =
          await validationSchema.validate(data, {
            abortEarly: false,
          });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors:
            errors?.inner?.reduce(
              (
                allErrors: any[],
                currentError: any,
              ) =>
                currentError?.path
                  ? {
                      ...allErrors,
                      [currentError?.path]: {
                        type:
                          currentError?.type ??
                          'validation',
                        message:
                          currentError?.message,
                      },
                    }
                  : allErrors,
              {},
            ) || {},
        };
      }
    },
    [validationSchema],
  );
