export interface ILanguageOption {
  code: string;
  label: string;
}

export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'pl', label: 'Polski' },
  { code: 'uk', label: 'Українська' },
  { code: 'es', label: 'Español' },
];
