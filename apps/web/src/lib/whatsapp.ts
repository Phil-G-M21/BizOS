// wa.me only accepts digits in the phone number segment.
const digitsOnly = (value: string) => value.replace(/\D/g, "");

// Link to message a specific number, e.g. a business's own WhatsApp.
export function waOrderLink(number: string, text: string) {
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(text)}`;
}

// Link that opens WhatsApp's contact picker with a prefilled message,
// with no target number — used when sharing something out.
export function waShareLink(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
