import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocaleState {
  locale: string;
  currency: string;
  exchangeRate: number;
}

const getInitialLocale = () =>
  typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en";

const getInitialCurrency = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("currency") || "USD"
    : "USD";

const getInitialExchangeRate = () =>
  typeof window !== "undefined"
    ? parseFloat(localStorage.getItem("exchangeRate") || "1")
    : 1;

const initialState: LocaleState = {
  locale: getInitialLocale(),
  currency: getInitialCurrency(),
  exchangeRate: getInitialExchangeRate(),
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", action.payload);
      }
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
