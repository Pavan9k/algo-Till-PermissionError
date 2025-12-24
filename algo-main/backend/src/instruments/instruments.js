export const INSTRUMENTS = [
  {
    instrument_token: 256265,
    symbol: "NIFTY 50",
    exchange: "NSE"
  },
  {
    instrument_token: 738561,
    symbol: "BANKNIFTY",
    exchange: "NSE"
  },
  {
    instrument_token: 408065,
    symbol: "RELIANCE",
    exchange: "NSE"
  }
];

// Helpers (very useful)
export const INSTRUMENT_TOKENS = INSTRUMENTS.map(
  i => i.instrument_token
);

export const INSTRUMENT_MAP = Object.fromEntries(
  INSTRUMENTS.map(i => [i.instrument_token, i])
);
