import { Field } from "payload";

const urlField: Field = {
  name: "url",
  label: "Site / Link",
  type: "text",
  validate: (value: any) => {
    let url;
    const errorMsg = "Digite um URL válido.";
    try {
      url = new URL(value);
    } catch (_) {
      if (value) return errorMsg;
    }

    return (
      Boolean(
        url?.protocol === "http:" || url?.protocol === "https:" || !value,
      ) || errorMsg
    );
  },
};
export default urlField;
