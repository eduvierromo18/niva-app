export type BankCatalogItem = {
  id: string;
  name: string;
  logo: string;
  color: string;
  shortName: string;
  isDefaultOption: boolean;
};

export const banks: BankCatalogItem[] = [
  {
    id: "banamex",
    name: "Banamex",
    logo: "/banks/banamex.webp",
    color: "#004A98",
    shortName: "Banamex",
    isDefaultOption: true,
  },
  {
    id: "bbva",
    name: "BBVA",
    logo: "/banks/bbva.svg",
    color: "#004481",
    shortName: "BBVA",
    isDefaultOption: true,
  },
  {
    id: "banorte",
    name: "Banorte",
    logo: "/banks/banorte.png",
    color: "#D71920",
    shortName: "Banorte",
    isDefaultOption: true,
  },
  {
    id: "american-express",
    name: "American Express",
    logo: "/banks/american-express.svg",
    color: "#2E77BB",
    shortName: "Amex",
    isDefaultOption: true,
  },
  {
    id: "dollarapp",
    name: "DollarApp",
    logo: "/banks/dollarapp.png",
    color: "#0F766E",
    shortName: "DollarApp",
    isDefaultOption: true,
  },
  {
    id: "mercado-pago",
    name: "Mercado Pago",
    logo: "/banks/default-bank.svg",
    color: "#00B1EA",
    shortName: "MP",
    isDefaultOption: true,
  },
  {
    id: "nu",
    name: "Nu",
    logo: "/banks/nu.svg",
    color: "#820AD1",
    shortName: "Nu",
    isDefaultOption: true,
  },
  {
    id: "other",
    name: "Otro",
    logo: "/banks/default-bank.svg",
    color: "#64748B",
    shortName: "Otro",
    isDefaultOption: true,
  },
  {
    id: "banregio",
    name: "Banregio",
    logo: "/banks/banregio.svg",
    color: "#E85D04",
    shortName: "Banregio",
    isDefaultOption: false,
  },
];

export const defaultBankOptions = banks.filter((bank) => bank.isDefaultOption);

export function normalizeBankName(value?: string | null) {
  if (!value) return "";
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function findBank(bankName?: string | null, bankCustomName?: string | null) {
  if (!bankName) return banks.find((bank) => bank.id === "other")!;
  const normalized = normalizeBankName(bankName);
  const byId = banks.find((bank) => bank.id === normalized);
  if (byId) return byId;
  const byName = banks.find((bank) => normalizeBankName(bank.name) === normalized);
  if (byName) return byName;
  const customMatch = banks.find((bank) => normalizeBankName(bank.name) === normalizeBankName(bankCustomName));
  return customMatch ?? banks.find((bank) => bank.id === "other")!;
}

export function getBankDisplayName(bankName?: string | null, bankCustomName?: string | null) {
  if (bankName === "Otro" || bankName === "other") return bankCustomName || "Otro";
  return findBank(bankName, bankCustomName).name;
}
