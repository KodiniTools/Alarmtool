import de from './de'
import en from './en'

/** Alle Übersetzungen, nach Sprache. Die Texte liegen in de.ts und en.ts. */
export const translations = { de, en }

/** Unterstützte Sprachcodes, z. B. 'de' | 'en'. */
export type Lang = keyof typeof translations
