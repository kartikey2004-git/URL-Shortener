/**
 * Validates `values` against a yup schema and returns a `{ field: message }`
 * map (empty when valid). Only the first message per field is kept.
 */
export async function validateForm(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (error) {
    if (!error.inner) throw error;

    const errors = {};
    for (const issue of error.inner) {
      errors[issue.path] ??= issue.message;
    }
    return errors;
  }
}
