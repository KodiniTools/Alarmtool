export const translations = {
  de: {
    page_title: "Modernes Alarm-Tool mit 12 Oszillatoren & Live-Recorder",
    app_title: "Modernes Alarm-Tool",
    app_subtitle: "Mit 12 Oszillatoren & Live-Recorder (Modular)",
    tab_filter: "Filter",
    tab_oscillators: "Oszillatoren",
    tab_recording: "Aufnahme",
    tab_faq: "FAQ",
    
    // Filter
    filter_title: "Globale Filtersteuerung",
    filter_type: "Filtertyp",
    filter_frequency: "Frequenz (Hz)",
    filter_freq_help: "Ändert die Grenzfrequenz des Filters (20 Hz - 20 kHz)",
    filter_q: "Q-Faktor",
    filter_q_help: "Steuert die Filtersteilheit (0.1 = sanft, 20 = scharf)",
    filter_none: "Kein Filter",
    filter_lowpass: "Tiefpass",
    filter_highpass: "Hochpass",
    filter_bandpass: "Bandpass",
    filter_notch: "Notch",
    
    // Oscillators
    osc_title: "12 Oszillator-Einstellungen",
    osc_title_prefix: "Oszillator",
    osc_waveform: "Wellenform",
    osc_wave_sine: "Sinus",
    osc_wave_square: "Rechteck",
    osc_wave_sawtooth: "Sägezahn",
    osc_wave_triangle: "Dreieck",
    osc_frequency: "Frequenz (Hz)",
    osc_volume: "Lautstärke",
    osc_pan: "Pan",
    osc_attack: "Attack (ms)",
    osc_release: "Release (ms)",
    osc_pattern: "Pattern",
    osc_pattern_help: "Kommagetrennt: Zeit in ms für (an, aus, an, aus, ...)",
    
    // Recording
    rec_title: "Live aufnehmen (MediaRecorder)",
    rec_duration: "Dauer:",
    rec_select: "-- Wähle eine Dauer --",
    rec_1min: "1 Minute",
    rec_2min: "2 Minuten",
    rec_3min: "3 Minuten",
    rec_5min: "5 Minuten",
    rec_format: "Format:",
    rec_auto: "Automatisch (beste Qualität)",
    rec_start: "Aufnahme starten",
    rec_download: "Download",
    rec_running: "Aufnahme läuft:",
    rec_remaining: "verbleibend",
    rec_help: "Erst den Alarm starten, dann Aufnahme; nach der gewählten Dauer wird ein Download-Link angezeigt.",
    
    // Settings
    settings_title: "Einstellungen verwalten",
    settings_save: "Speichern",
    settings_load: "Laden",
    settings_export: "Exportieren",
    settings_import: "Importieren",
    
    // Player
    player_title: "Media Player Steuerung",
    player_info: "Steuerung: Leertaste = Play/Pause | Esc = Stop | M = Mute | L = Loop",
    
    // FAQ
    faq_title: "Häufig gestellte Fragen (FAQ)",
    faq_q1: "Was ist das Alarm-Tool?",
    faq_a1: "Das Alarm-Tool ist eine webbasierte Anwendung zur Erzeugung komplexer Audiosignale mit 12 individuell konfigurierbaren Oszillatoren.",
    faq_q2: "Wie starte ich einen Alarm?",
    faq_a2: "Konfiguriere die Oszillatoren nach deinen Wünschen und klicke auf 'Alarm starten'. Die Töne werden sofort abgespielt.",
    faq_q3: "Kann ich meine Einstellungen speichern?",
    faq_a3: "Ja! Nutze die Buttons 'Einstellungen speichern' und 'Einstellungen laden' um deine Konfiguration zu sichern.",
    faq_q4: "Welche Browser werden unterstützt?",
    faq_a4: "Alle modernen Browser mit Web Audio API Support: Chrome, Firefox, Safari, Edge (aktuelle Versionen).",
    faq_q5: "Was sind Oszillatoren?",
    faq_a5: "Oszillatoren erzeugen periodische Wellenformen (Sinus, Rechteck, Sägezahn, Dreieck) und sind die Grundlage der Klangerzeugung.",
    faq_q6: "Wie funktioniert der globale Filter?",
    faq_a6: "Der globale Filter verändert das Frequenzspektrum aller Oszillatoren gleichzeitig. Tiefpass dämpft hohe Frequenzen, Hochpass dämpft tiefe.",
    faq_q7: "Kann ich Aufnahmen exportieren?",
    faq_a7: "Ja, mit dem Recording-Tab kannst du deine Alarme aufnehmen und als Audio-Datei herunterladen.",
    faq_q8: "Was bedeutet Attack und Release?",
    faq_a8: "Attack ist die Einschaltzeit, Release die Ausschaltzeit eines Tons. Sie formen die Hüllkurve (Envelope) des Klangs.",
    faq_q9: "Wie funktionieren Pattern?",
    faq_a9: "Pattern definieren Rhythmen als Zahlenfolge: an-Zeit, aus-Zeit, an-Zeit, aus-Zeit... (z.B. '500,200' für 500ms an, 200ms aus).",
    faq_q10: "Ist das Tool kostenlos?",
    faq_a10: "Ja, das Alarm-Tool ist vollständig kostenlos und Open Source. Du kannst es frei nutzen und anpassen.",

    // Donate
    donate_message: "Wenn Ihnen dieses Projekt gefällt und Sie die Entwicklung unterstützen möchten, können Sie gerne spenden:",
    donate_button_text: "Spenden via PayPal",

    // Background Color
    bg_color_tooltip: "Hintergrundfarbe anpassen",
    bg_color_reset: "Standardfarbe wiederherstellen"
  },
  en: {
    page_title: "Modern Alarm Tool with 12 Oscillators & Live Recorder",
    app_title: "Modern Alarm Tool",
    app_subtitle: "With 12 Oscillators & Live Recorder (Modular)",
    tab_filter: "Filter",
    tab_oscillators: "Oscillators",
    tab_recording: "Recording",
    tab_faq: "FAQ",
    
    // Filter
    filter_title: "Global Filter Control",
    filter_type: "Filter Type",
    filter_frequency: "Frequency (Hz)",
    filter_freq_help: "Changes the cutoff frequency of the filter (20 Hz - 20 kHz)",
    filter_q: "Q-Factor",
    filter_q_help: "Controls filter steepness (0.1 = gentle, 20 = sharp)",
    filter_none: "No Filter",
    filter_lowpass: "Lowpass",
    filter_highpass: "Highpass",
    filter_bandpass: "Bandpass",
    filter_notch: "Notch",
    
    // Oscillators
    osc_title: "12 Oscillator Settings",
    osc_title_prefix: "Oscillator",
    osc_waveform: "Waveform",
    osc_wave_sine: "Sine",
    osc_wave_square: "Square",
    osc_wave_sawtooth: "Sawtooth",
    osc_wave_triangle: "Triangle",
    osc_frequency: "Frequency (Hz)",
    osc_volume: "Volume",
    osc_pan: "Pan",
    osc_attack: "Attack (ms)",
    osc_release: "Release (ms)",
    osc_pattern: "Pattern",
    osc_pattern_help: "Comma-separated: time in ms for (on, off, on, off, ...)",
    
    // Recording
    rec_title: "Live Recording (MediaRecorder)",
    rec_duration: "Duration:",
    rec_select: "-- Select duration --",
    rec_1min: "1 Minute",
    rec_2min: "2 Minutes",
    rec_3min: "3 Minutes",
    rec_5min: "5 Minutes",
    rec_format: "Format:",
    rec_auto: "Automatic (best quality)",
    rec_start: "Start Recording",
    rec_download: "Download",
    rec_running: "Recording in progress:",
    rec_remaining: "remaining",
    rec_help: "Start the alarm first, then start recording; after the selected duration, a download link will appear.",
    
    // Settings
    settings_title: "Manage Settings",
    settings_save: "Save",
    settings_load: "Load",
    settings_export: "Export",
    settings_import: "Import",
    
    // Player
    player_title: "Media Player Control",
    player_info: "Control: Spacebar = Play/Pause | Esc = Stop | M = Mute | L = Loop",
    
    // FAQ
    faq_title: "Frequently Asked Questions (FAQ)",
    faq_q1: "What is the Alarm Tool?",
    faq_a1: "The Alarm Tool is a web-based application for generating complex audio signals with 12 individually configurable oscillators.",
    faq_q2: "How do I start an alarm?",
    faq_a2: "Configure the oscillators as desired and click 'Start Alarm'. The sounds will play immediately.",
    faq_q3: "Can I save my settings?",
    faq_a3: "Yes! Use the 'Save Settings' and 'Load Settings' buttons to save your configuration.",
    faq_q4: "Which browsers are supported?",
    faq_a4: "All modern browsers with Web Audio API support: Chrome, Firefox, Safari, Edge (current versions).",
    faq_q5: "What are oscillators?",
    faq_a5: "Oscillators generate periodic waveforms (sine, square, sawtooth, triangle) and are the foundation of sound generation.",
    faq_q6: "How does the global filter work?",
    faq_a6: "The global filter modifies the frequency spectrum of all oscillators simultaneously. Lowpass attenuates high frequencies, highpass attenuates low frequencies.",
    faq_q7: "Can I export recordings?",
    faq_a7: "Yes, with the Recording tab you can record your alarms and download them as audio files.",
    faq_q8: "What do Attack and Release mean?",
    faq_a8: "Attack is the fade-in time, Release is the fade-out time of a sound. They shape the envelope of the sound.",
    faq_q9: "How do patterns work?",
    faq_a9: "Patterns define rhythms as number sequences: on-time, off-time, on-time, off-time... (e.g. '500,200' for 500ms on, 200ms off).",
    faq_q10: "Is the tool free?",
    faq_a10: "Yes, the Alarm Tool is completely free and Open Source. You can use and modify it freely.",

    // Donate
    donate_message: "If you like this project and would like to support its development, feel free to donate:",
    donate_button_text: "Donate via PayPal",

    // Background Color
    bg_color_tooltip: "Customize background color",
    bg_color_reset: "Reset to default color"
  }
}
