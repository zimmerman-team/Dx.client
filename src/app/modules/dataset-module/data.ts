export interface DatasetListItemAPIModel {
  id: string;
  name: string;
  description: string;
  public: boolean;
  category: string;
  createdDate: Date;
  owner: string;
  source: string;
  sourceUrl: string;
}
export const tHeadData = [
  {
    name: "Transaction Ref",
    type: "pound",
    key: "",
  },

  { name: "Transaction Sector Narrative", type: "char", key: "" },
  { name: "Transaction Sector Code", type: "pound", key: "" },
  { name: "Transaction Value", type: "pound", key: "" },
  { name: "IATI Identifier", type: "char", key: "" },
  { name: "Reporting Org Ref", type: "char", key: "" },
  { name: "Contact Info Email", type: "char", key: "" },
];

export const dummyDatasetData = [
  {
    Ref: "636F7923F489",
    SectorNarrative: "Operating Expenses",
    SectorCode: 91010,
    TransactionValue: 294932.25,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "F7157529912C",
    SectorNarrative: "Operating Expenses",
    SectorCode: 91010,
    TransactionValue: 2 - 32.92,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "CCC606651B40",
    SectorNarrative: "Direct Administrative Costs",
    SectorCode: 8001,
    TransactionValue: -2832,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "CC0B123028FB",
    SectorNarrative: "Operating Expenses",
    SectorCode: 91010,
    TransactionValue: 14041.65,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "6B42A8567948",
    SectorNarrative: "Operating Expenses",
    SectorCode: "91010",
    TransactionValue: -908.83,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "42CE69958C54",
    SectorNarrative: "Operating Expenses",
    SectorCode: 91010,
    TransactionValue: -419.97,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "17455ECC1D1C",
    SectorNarrative: "Direct Administrative Costs",
    SectorCode: 8001,
    TransactionValue: 62527.7,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "483452385C90",
    SectorNarrative: "Direct Administrative Costs",
    SectorCode: 8001,
    TransactionValue: 113552.12,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "17455ECC1D1C",
    SectorNarrative: "Direct Administrative Costs",
    SectorCode: 8001,
    TransactionValue: 62527.7,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
  {
    Ref: "483452385C90",
    SectorNarrative: "Direct Administrative Costs",
    SectorCode: 8001,
    TransactionValue: 113552.12,
    IATIIdentifier: "US-GOV-1-720202151689",
    OrgRef: "US-GOV-1",
    email: "aidtransparency@usaid.gov",
  },
];
