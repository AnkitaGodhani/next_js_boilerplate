export const prepareFormData = (
  payload: Record<string, any>
): FormData | null => {
  const formData = new FormData();
  if (!payload) return null;
  Object.entries(payload)?.forEach(([name, value]) => {
    value && formData.append(name, value);
  });
  // const formDataArray = Array.from(formData.entries());
  // console.log('formDataArray', formDataArray)
  return formData;
};
