// Deixa o texto em minúsculas e sem acentos, para a busca ignorar
// diferenças de maiúsculas e acentuação. Exemplo: "Pão" vira "pao".
export function normalizeText(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}