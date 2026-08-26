export const translations = {
  de: {
    page_title: 'Modernes Alarm-Tool mit 12 Oszillatoren & Live-Recorder',
    app_title: 'Modernes Alarm-Tool',
    app_subtitle: 'Mit 12 Oszillatoren & Live-Recorder (Modular)',
    tab_filter: 'Filter',
    tab_oscillators: 'Oszillatoren',
    tab_recording: 'Aufnahme',
    tab_presets: 'Presets',
    tab_faq: 'FAQ',

    // Presets
    presets_title: 'Alarm-Presets',
    presets_intro:
      'Fertige Alarmton-Konfigurationen zum sofortigen Laden. Klicke auf "Laden" um ein Preset zu aktivieren.',
    presets_load: 'Laden',
    preset_emergency_name: 'Klassische Notfallsirene',
    preset_emergency_desc:
      'Zwei-Ton Hi-Lo Sirene (660/880 Hz) mit Oberwelle — klassischer Rettungsdienst-Alarm.',
    preset_industrial_name: 'Industrielles Warnsignal',
    preset_industrial_desc:
      'Schwerer, tieffrequenter Warnton mit Sägezahn- und Rechteckwellen. Tiefpassfilter mit Resonanzspitze.',
    preset_wakeup_name: 'Sanfter Weckalarm',
    preset_wakeup_desc:
      'Harmonischer C-Dur-Akkord mit langen Ein-/Ausblendzeiten. Ideal als Wecker oder Meditationstimer.',
    preset_heartbeat_name: 'Herzmonitor-Alarm',
    preset_heartbeat_desc:
      'Kurze Doppelpulse simulieren einen medizinischen Monitor. Bandpassfilter fokussiert den typischen Klinik-Sound.',
    preset_scifi_name: 'Sci-Fi Stereo-Sweep',
    preset_scifi_desc:
      'Futuristischer Alarm mit 9 Oszillatoren, Schwebungseffekt und vollem Stereopanorama.',
    preset_airraid_name: 'Luftschutzsirene',
    preset_airraid_desc:
      'Auf- und abschwellende Sägezahn-Heulsirene mit resonanter Tiefpass-Spitze — maximale Alarmwirkung.',
    preset_klaxon_name: 'Alarm-Klaxon',
    preset_klaxon_desc:
      'Harter Rechteck-Hupton wie ein U-Boot-Tauchalarm. Kurze, stechende AOOGA-Stöße.',
    preset_panic_name: 'Panik-Alarm',
    preset_panic_desc:
      'Durchdringendes, hochfrequentes Kreischen mit Hochpassfilter. Schnelle, dissonante Stakkato-Impulse.',
    preset_redalert_name: 'Roter Alarm',
    preset_redalert_desc:
      'Aggressiver Gefechtsalarm mit dissonantem Tritonus und fokussiertem Bandpass — höchste Dringlichkeit.',
    preset_malfunction_name: 'Systemfehler',
    preset_malfunction_desc:
      'Chaotisches Glitch-Stottern aus Rechteck- und Sägezahnwellen mit resonantem Filter — Maschine im Ausnahmezustand.',
    preset_tag_sine: 'Sinus',
    preset_tag_triangle: 'Dreieck',
    preset_tag_square: 'Rechteck',
    preset_tag_sawtooth: 'Sägezahn',
    preset_tag_lowpass: 'Tiefpass',
    preset_tag_highpass: 'Hochpass',
    preset_tag_bandpass: 'Bandpass',
    preset_tag_stereo: 'Stereo',
    preset_tag_soft: 'Sanft',
    preset_tag_medical: 'Medizinisch',
    preset_tag_aggressive: 'Aggressiv',
    preset_tag_siren: 'Sirene',
    preset_tag_harsh: 'Hart',

    // Filter
    filter_title: 'Globale Filtersteuerung',
    filter_type: 'Filtertyp',
    filter_frequency: 'Frequenz (Hz)',
    filter_freq_help: 'Ändert die Grenzfrequenz des Filters (20 Hz - 20 kHz)',
    filter_q: 'Q-Faktor',
    filter_q_help: 'Steuert die Filtersteilheit (0.1 = sanft, 20 = scharf)',
    filter_none: 'Kein Filter',
    filter_lowpass: 'Tiefpass',
    filter_highpass: 'Hochpass',
    filter_bandpass: 'Bandpass',
    filter_notch: 'Notch',
    filter_inactive_info: 'Wähle einen Filtertyp, um die Klangfarbe anzupassen',
    // Dynamic filter labels
    filter_freq_cutoff: 'Grenzfrequenz (Hz)',
    filter_freq_center: 'Mittenfrequenz (Hz)',
    filter_freq_notch: 'Sperrfrequenz (Hz)',
    filter_freq_help_lowpass: 'Frequenzen oberhalb werden gedämpft',
    filter_freq_help_highpass: 'Frequenzen unterhalb werden gedämpft',
    filter_freq_help_bandpass: 'Nur Frequenzen um diesen Wert werden durchgelassen',
    filter_freq_help_notch: 'Frequenzen um diesen Wert werden ausgeblendet',
    filter_q_resonance: 'Resonanz (Q)',
    filter_q_bandwidth: 'Bandbreite (Q)',
    filter_q_width: 'Sperrbreite (Q)',
    filter_q_help_lowpass: 'Höhere Werte = stärkere Resonanz an der Grenzfrequenz',
    filter_q_help_highpass: 'Höhere Werte = stärkere Resonanz an der Grenzfrequenz',
    filter_q_help_bandpass: 'Höhere Werte = schmaleres Frequenzband',
    filter_q_help_notch: 'Höhere Werte = schmalere Sperrkerbe',

    // Oscillators
    osc_title: '12 Oszillator-Einstellungen',
    osc_undo: 'Rückgängig',
    osc_redo: 'Wiederherstellen',
    osc_title_prefix: 'Oszillator',
    osc_enable: 'Oszillator aktivieren',
    osc_disable: 'Oszillator deaktivieren',
    osc_waveform: 'Wellenform',
    osc_wave_sine: 'Sinus',
    osc_wave_square: 'Rechteck',
    osc_wave_sawtooth: 'Sägezahn',
    osc_wave_triangle: 'Dreieck',
    osc_frequency: 'Frequenz (Hz)',
    osc_volume: 'Lautstärke',
    osc_pan: 'Pan',
    osc_attack: 'Attack (ms)',
    osc_decay: 'Decay (ms)',
    osc_sustain: 'Sustain',
    osc_release: 'Release (ms)',
    osc_copy: 'Einstellungen kopieren',
    osc_paste: 'Einstellungen einfügen',
    osc_advanced_show: 'Erweiterte Optionen anzeigen',
    osc_advanced_hide: 'Erweiterte Optionen ausblenden',
    osc_pattern: 'Pattern',
    osc_pattern_help: 'Kommagetrennt: Zeit in ms für (an, aus, an, aus, ...)',
    osc_disabled_label: 'Deaktiviert',
    osc_editor_placeholder: 'Wähle einen Oszillator aus der Liste',
    osc_adsr_section: 'Hüllkurve & Muster',
    osc_section_basics: 'Grundparameter',
    osc_active_suffix: 'aktiv',

    // Recording
    rec_title: 'Live aufnehmen (MediaRecorder)',
    rec_duration: 'Dauer:',
    rec_select: '-- Wähle eine Dauer --',
    rec_30sec: '30 Sekunden',
    rec_1min: '1 Minute',
    rec_2min: '2 Minuten',
    rec_3min: '3 Minuten',
    rec_5min: '5 Minuten',
    rec_format: 'Format:',
    rec_format_auto: 'Automatisch (beste Qualität)',
    rec_format_webm: 'WebM (Opus)',
    rec_format_ogg: 'OGG (Opus)',
    rec_format_wav: 'WAV (unkomprimiert)',
    rec_channels: 'Kanäle',
    rec_channels_stereo: 'Stereo (2 Kanäle)',
    rec_channels_mono: 'Mono (1 Kanal)',
    rec_start: 'Aufnahme starten',
    rec_download: 'Download',
    rec_dismiss: 'Abbrechen',
    rec_running: 'Aufnahme läuft:',
    rec_remaining: 'verbleibend',
    rec_success: 'Aufnahme fertig! Klicke auf Download.',
    rec_convert_label: 'Umwandeln in:',
    rec_converting: 'Konvertierung läuft...',
    rec_help:
      'Erst den Alarm starten, dann Aufnahme; nach der gewählten Dauer wird ein Download-Link angezeigt.',

    // Settings
    settings_title: 'Einstellungen verwalten',
    settings_save: 'Speichern',
    settings_save_desc: 'Im Browser speichern',
    settings_load: 'Laden',
    settings_load_desc: 'Aus Browser laden',
    settings_export: 'Exportieren',
    settings_export_desc: 'Als JSON-Datei',
    settings_import: 'Importieren',
    settings_import_desc: 'JSON-Datei laden',
    settings_group_local: 'Browser',
    settings_group_file: 'Datei',

    // Player
    player_title: 'Media Player',
    player_status_stopped: 'Bereit',
    player_status_playing: 'Läuft',
    player_status_paused: 'Pausiert',
    player_play: 'Abspielen (Leertaste)',
    player_pause: 'Pause',
    player_resume: 'Fortsetzen (Leertaste)',
    player_stop: 'Stoppen (Esc)',
    player_progress: 'Fortschritt',
    player_mute_on: 'Ton einschalten (M)',
    player_mute_off: 'Stumm schalten (M)',
    player_volume: 'Lautstärke',
    player_loop_on: 'Loop deaktivieren (L)',
    player_loop_off: 'Loop aktivieren (L)',
    player_info: 'Steuerung: Leertaste = Play/Pause | Esc = Stop | M = Mute | L = Loop',

    // FAQ
    faq_title: 'Häufig gestellte Fragen (FAQ)',
    faq_q1: 'Was ist das Alarm-Tool?',
    faq_a1:
      'Das Alarm-Tool ist eine webbasierte Anwendung zur Erzeugung komplexer Audiosignale mit 12 individuell konfigurierbaren Oszillatoren.',
    faq_q2: 'Wie starte ich einen Alarm?',
    faq_a2:
      "Konfiguriere die Oszillatoren nach deinen Wünschen und klicke auf 'Alarm starten'. Die Töne werden sofort abgespielt.",
    faq_q3: 'Kann ich meine Einstellungen speichern?',
    faq_a3:
      "Ja! Nutze die Buttons 'Einstellungen speichern' und 'Einstellungen laden' um deine Konfiguration zu sichern.",
    faq_q4: 'Welche Browser werden unterstützt?',
    faq_a4:
      'Alle modernen Browser mit Web Audio API Support: Chrome, Firefox, Safari, Edge (aktuelle Versionen).',
    faq_q5: 'Was sind Oszillatoren?',
    faq_a5:
      'Oszillatoren erzeugen periodische Wellenformen (Sinus, Rechteck, Sägezahn, Dreieck) und sind die Grundlage der Klangerzeugung.',
    faq_q6: 'Wie funktioniert der globale Filter?',
    faq_a6:
      'Der globale Filter verändert das Frequenzspektrum aller Oszillatoren gleichzeitig. Tiefpass dämpft hohe Frequenzen, Hochpass dämpft tiefe.',
    faq_q7: 'Kann ich Aufnahmen exportieren?',
    faq_a7:
      'Ja, mit dem Recording-Tab kannst du deine Alarme aufnehmen und als Audio-Datei herunterladen.',
    faq_q8: 'Was bedeutet Attack, Decay, Sustain und Release?',
    faq_a8:
      'ADSR beschreibt die Hüllkurve eines Tons: Attack = Anstiegszeit zum Spitzenwert, Decay = Abklingzeit zum Sustain-Pegel, Sustain = Haltepegel während der Ton aktiv ist, Release = Ausklingzeit nach dem Abschalten.',
    faq_q9: 'Wie funktionieren Pattern?',
    faq_a9:
      "Pattern definieren Rhythmen als Zahlenfolge: an-Zeit, aus-Zeit, an-Zeit, aus-Zeit... (z.B. '500,200' für 500ms an, 200ms aus).",
    faq_q10: 'Ist das Tool kostenlos?',
    faq_a10:
      'Ja, das Alarm-Tool ist vollständig kostenlos und Open Source. Du kannst es frei nutzen und anpassen.',

    // Toast Messages - Settings
    toast_settings_saved: 'Einstellungen erfolgreich gespeichert.',
    toast_settings_save_error: 'Fehler beim Speichern der Einstellungen.',
    toast_settings_loaded: 'Gespeicherte Einstellungen wurden geladen.',
    toast_settings_load_error: 'Fehler beim Laden der Einstellungen.',
    toast_settings_none: 'Keine gespeicherten Einstellungen gefunden.',
    toast_settings_exported: 'Einstellungen als JSON-Datei exportiert.',
    toast_settings_export_error: 'Fehler beim Exportieren der Einstellungen.',
    toast_settings_imported: 'Einstellungen erfolgreich importiert.',
    toast_settings_import_error:
      'Import fehlgeschlagen. Bitte stelle sicher, dass die JSON-Datei korrekt ist.',
    toast_settings_apply_error: 'Fehler beim Anwenden der Einstellungen.',

    // Toast Messages - Player
    toast_alarm_started: 'Alarm gestartet. Leertaste = Pause, Esc = Stop.',
    toast_alarm_start_error: 'Fehler beim Starten des Alarms.',
    toast_alarm_paused: 'Alarm pausiert. Leertaste zum Fortsetzen.',
    toast_alarm_resumed: 'Alarm fortgesetzt.',
    toast_alarm_stopped: 'Alarm gestoppt.',
    toast_mute_on: 'Ton stummgeschaltet.',
    toast_mute_off: 'Ton wieder aktiviert.',
    toast_loop_on: 'Loop-Modus aktiviert (5 Min. Zyklus).',
    toast_loop_off: 'Loop-Modus deaktiviert.',

    // Toast Messages - Recording
    toast_rec_no_alarm: 'Bitte starte zuerst den Alarm, bevor du eine Aufnahme beginnst.',
    toast_rec_no_duration: 'Bitte wähle eine gültige Aufnahmedauer.',
    toast_rec_started: 'Aufnahme gestartet. Der Alarm wird aufgezeichnet.',
    toast_rec_start_error: 'Fehler beim Starten der Aufnahme.',
    toast_rec_file_error: 'Fehler beim Erstellen der Aufnahme-Datei.',
    toast_rec_error_not_supported: 'Dein Browser unterstützt diese Aufnahmefunktion nicht.',
    toast_rec_error_security: 'Sicherheitsfehler: Aufnahme nicht erlaubt.',
    toast_rec_error_invalid_state: 'Aufnahme befindet sich in einem ungültigen Zustand.',
    toast_rec_error_generic: 'Aufnahme-Fehler aufgetreten.',
    toast_rec_complete: 'Aufnahme abgeschlossen! Klicke auf Download, um die Datei zu speichern.',
    toast_convert_complete: 'Konvertierung abgeschlossen! Klicke auf Download.',
    toast_convert_error:
      'Fehler bei der Konvertierung. Dein Browser unterstützt dieses Format möglicherweise nicht.',
    toast_rec_dismissed: 'Aufnahme verworfen.',

    // Preset Play (via sticky player)
    preset_play: 'Abspielen',

    // Preview Player
    preview_play: 'Vorschau abspielen / pausieren',
    preview_stop: 'Vorschau stoppen',
    preview_volume: 'Vorschau-Lautstärke',
    preview_playing: 'Vorschau läuft...',
    preview_paused: 'Vorschau pausiert',

    // Preset Reset
    preset_active_label: 'Aktives Preset',
    preset_reset: 'Zurücksetzen',
    preset_reset_title: 'Preset entfernen und Oszillatoren auf Grundeinstellungen zurücksetzen',

    // Toast Messages - Presets
    toast_preset_loaded: 'Preset geladen.',
    toast_preset_load_error: 'Fehler beim Laden des Presets.',
    toast_preset_reset: 'Preset entfernt. Oszillatoren auf Grundeinstellungen zurückgesetzt.',

    // Toast Messages - Undo/Redo
    toast_undo: 'Änderung rückgängig gemacht.',
    toast_redo: 'Änderung wiederhergestellt.',

    // Toast Messages - Copy/Paste
    toast_osc_copied: 'Oszillator-Einstellungen kopiert.',
    toast_osc_pasted: 'Oszillator-Einstellungen eingefügt.',

    // Donate
    donate_message:
      'Wenn Ihnen dieses Projekt gefällt und Sie die Entwicklung unterstützen möchten, können Sie gerne spenden:',
    donate_button_text: 'Spenden via PayPal',
  },
  en: {
    page_title: 'Modern Alarm Tool with 12 Oscillators & Live Recorder',
    app_title: 'Modern Alarm Tool',
    app_subtitle: 'With 12 Oscillators & Live Recorder (Modular)',
    tab_filter: 'Filter',
    tab_oscillators: 'Oscillators',
    tab_recording: 'Recording',
    tab_presets: 'Presets',
    tab_faq: 'FAQ',

    // Presets
    presets_title: 'Alarm Presets',
    presets_intro: 'Ready-to-use alarm tone configurations. Click "Load" to activate a preset.',
    presets_load: 'Load',
    preset_emergency_name: 'Classic Emergency Siren',
    preset_emergency_desc:
      'Two-tone Hi-Lo siren (660/880 Hz) with overtone — classic emergency services alarm.',
    preset_industrial_name: 'Industrial Warning Signal',
    preset_industrial_desc:
      'Heavy, low-frequency warning tone with sawtooth and square waves. Lowpass filter with resonance peak.',
    preset_wakeup_name: 'Gentle Wake-Up Alarm',
    preset_wakeup_desc:
      'Harmonic C-major chord with long fade-in/fade-out times. Ideal as alarm clock or meditation timer.',
    preset_heartbeat_name: 'Heartbeat Monitor Alert',
    preset_heartbeat_desc:
      'Short double pulses simulate a medical monitor. Bandpass filter focuses the typical clinical sound.',
    preset_scifi_name: 'Sci-Fi Stereo Sweep',
    preset_scifi_desc:
      'Futuristic alarm with 9 oscillators, beat frequency effect, and full stereo panorama.',
    preset_airraid_name: 'Air-Raid Siren',
    preset_airraid_desc:
      'Rising and falling sawtooth wail with a resonant lowpass peak — maximum alarm impact.',
    preset_klaxon_name: 'Alarm Klaxon',
    preset_klaxon_desc:
      'Harsh square-wave horn like a submarine dive alarm. Short, stabbing AOOGA blasts.',
    preset_panic_name: 'Panic Alarm',
    preset_panic_desc:
      'Piercing high-frequency screech with a highpass filter. Fast, dissonant staccato pulses.',
    preset_redalert_name: 'Red Alert',
    preset_redalert_desc:
      'Aggressive battle-stations alarm with a dissonant tritone and focused bandpass — top urgency.',
    preset_malfunction_name: 'System Malfunction',
    preset_malfunction_desc:
      'Chaotic glitch stutter of square and sawtooth waves through a resonant filter — a machine in meltdown.',
    preset_tag_sine: 'Sine',
    preset_tag_triangle: 'Triangle',
    preset_tag_square: 'Square',
    preset_tag_sawtooth: 'Sawtooth',
    preset_tag_lowpass: 'Lowpass',
    preset_tag_highpass: 'Highpass',
    preset_tag_bandpass: 'Bandpass',
    preset_tag_stereo: 'Stereo',
    preset_tag_soft: 'Soft',
    preset_tag_medical: 'Medical',
    preset_tag_aggressive: 'Aggressive',
    preset_tag_siren: 'Siren',
    preset_tag_harsh: 'Harsh',

    // Filter
    filter_title: 'Global Filter Control',
    filter_type: 'Filter Type',
    filter_frequency: 'Frequency (Hz)',
    filter_freq_help: 'Changes the cutoff frequency of the filter (20 Hz - 20 kHz)',
    filter_q: 'Q-Factor',
    filter_q_help: 'Controls filter steepness (0.1 = gentle, 20 = sharp)',
    filter_none: 'No Filter',
    filter_lowpass: 'Lowpass',
    filter_highpass: 'Highpass',
    filter_bandpass: 'Bandpass',
    filter_notch: 'Notch',
    filter_inactive_info: 'Select a filter type to adjust the sound character',
    // Dynamic filter labels
    filter_freq_cutoff: 'Cutoff Frequency (Hz)',
    filter_freq_center: 'Center Frequency (Hz)',
    filter_freq_notch: 'Notch Frequency (Hz)',
    filter_freq_help_lowpass: 'Frequencies above this will be attenuated',
    filter_freq_help_highpass: 'Frequencies below this will be attenuated',
    filter_freq_help_bandpass: 'Only frequencies around this value pass through',
    filter_freq_help_notch: 'Frequencies around this value will be removed',
    filter_q_resonance: 'Resonance (Q)',
    filter_q_bandwidth: 'Bandwidth (Q)',
    filter_q_width: 'Notch Width (Q)',
    filter_q_help_lowpass: 'Higher values = stronger resonance at cutoff frequency',
    filter_q_help_highpass: 'Higher values = stronger resonance at cutoff frequency',
    filter_q_help_bandpass: 'Higher values = narrower frequency band',
    filter_q_help_notch: 'Higher values = narrower notch',

    // Oscillators
    osc_title: '12 Oscillator Settings',
    osc_undo: 'Undo',
    osc_redo: 'Redo',
    osc_title_prefix: 'Oscillator',
    osc_enable: 'Enable oscillator',
    osc_disable: 'Disable oscillator',
    osc_waveform: 'Waveform',
    osc_wave_sine: 'Sine',
    osc_wave_square: 'Square',
    osc_wave_sawtooth: 'Sawtooth',
    osc_wave_triangle: 'Triangle',
    osc_frequency: 'Frequency (Hz)',
    osc_volume: 'Volume',
    osc_pan: 'Pan',
    osc_attack: 'Attack (ms)',
    osc_decay: 'Decay (ms)',
    osc_sustain: 'Sustain',
    osc_release: 'Release (ms)',
    osc_copy: 'Copy settings',
    osc_paste: 'Paste settings',
    osc_advanced_show: 'Show advanced options',
    osc_advanced_hide: 'Hide advanced options',
    osc_pattern: 'Pattern',
    osc_pattern_help: 'Comma-separated: time in ms for (on, off, on, off, ...)',
    osc_disabled_label: 'Disabled',
    osc_editor_placeholder: 'Select an oscillator from the list',
    osc_adsr_section: 'Envelope & Pattern',
    osc_section_basics: 'Base parameters',
    osc_active_suffix: 'active',

    // Recording
    rec_title: 'Live Recording (MediaRecorder)',
    rec_duration: 'Duration:',
    rec_select: '-- Select duration --',
    rec_30sec: '30 Seconds',
    rec_1min: '1 Minute',
    rec_2min: '2 Minutes',
    rec_3min: '3 Minutes',
    rec_5min: '5 Minutes',
    rec_format: 'Format:',
    rec_format_auto: 'Automatic (best quality)',
    rec_format_webm: 'WebM (Opus)',
    rec_format_ogg: 'OGG (Opus)',
    rec_format_wav: 'WAV (uncompressed)',
    rec_channels: 'Channels',
    rec_channels_stereo: 'Stereo (2 channels)',
    rec_channels_mono: 'Mono (1 channel)',
    rec_start: 'Start Recording',
    rec_download: 'Download',
    rec_dismiss: 'Dismiss',
    rec_running: 'Recording in progress:',
    rec_remaining: 'remaining',
    rec_success: 'Recording complete! Click Download.',
    rec_convert_label: 'Convert to:',
    rec_converting: 'Converting...',
    rec_help:
      'Start the alarm first, then start recording; after the selected duration, a download link will appear.',

    // Settings
    settings_title: 'Manage Settings',
    settings_save: 'Save',
    settings_save_desc: 'Save to browser',
    settings_load: 'Load',
    settings_load_desc: 'Load from browser',
    settings_export: 'Export',
    settings_export_desc: 'Download as JSON',
    settings_import: 'Import',
    settings_import_desc: 'Load JSON file',
    settings_group_local: 'Browser',
    settings_group_file: 'File',

    // Player
    player_title: 'Media Player',
    player_status_stopped: 'Ready',
    player_status_playing: 'Playing',
    player_status_paused: 'Paused',
    player_play: 'Play (Space)',
    player_pause: 'Pause',
    player_resume: 'Resume (Space)',
    player_stop: 'Stop (Esc)',
    player_progress: 'Progress',
    player_mute_on: 'Unmute (M)',
    player_mute_off: 'Mute (M)',
    player_volume: 'Volume',
    player_loop_on: 'Disable Loop (L)',
    player_loop_off: 'Enable Loop (L)',
    player_info: 'Control: Spacebar = Play/Pause | Esc = Stop | M = Mute | L = Loop',

    // FAQ
    faq_title: 'Frequently Asked Questions (FAQ)',
    faq_q1: 'What is the Alarm Tool?',
    faq_a1:
      'The Alarm Tool is a web-based application for generating complex audio signals with 12 individually configurable oscillators.',
    faq_q2: 'How do I start an alarm?',
    faq_a2:
      "Configure the oscillators as desired and click 'Start Alarm'. The sounds will play immediately.",
    faq_q3: 'Can I save my settings?',
    faq_a3: "Yes! Use the 'Save Settings' and 'Load Settings' buttons to save your configuration.",
    faq_q4: 'Which browsers are supported?',
    faq_a4:
      'All modern browsers with Web Audio API support: Chrome, Firefox, Safari, Edge (current versions).',
    faq_q5: 'What are oscillators?',
    faq_a5:
      'Oscillators generate periodic waveforms (sine, square, sawtooth, triangle) and are the foundation of sound generation.',
    faq_q6: 'How does the global filter work?',
    faq_a6:
      'The global filter modifies the frequency spectrum of all oscillators simultaneously. Lowpass attenuates high frequencies, highpass attenuates low frequencies.',
    faq_q7: 'Can I export recordings?',
    faq_a7:
      'Yes, with the Recording tab you can record your alarms and download them as audio files.',
    faq_q8: 'What do Attack, Decay, Sustain, and Release mean?',
    faq_a8:
      'ADSR describes the envelope of a sound: Attack = rise time to peak level, Decay = fall time to sustain level, Sustain = hold level while the tone is active, Release = fade-out time after the tone is turned off.',
    faq_q9: 'How do patterns work?',
    faq_a9:
      "Patterns define rhythms as number sequences: on-time, off-time, on-time, off-time... (e.g. '500,200' for 500ms on, 200ms off).",
    faq_q10: 'Is the tool free?',
    faq_a10:
      'Yes, the Alarm Tool is completely free and Open Source. You can use and modify it freely.',

    // Toast Messages - Settings
    toast_settings_saved: 'Settings saved successfully.',
    toast_settings_save_error: 'Error saving settings.',
    toast_settings_loaded: 'Saved settings have been loaded.',
    toast_settings_load_error: 'Error loading settings.',
    toast_settings_none: 'No saved settings found.',
    toast_settings_exported: 'Settings exported as JSON file.',
    toast_settings_export_error: 'Error exporting settings.',
    toast_settings_imported: 'Settings imported successfully.',
    toast_settings_import_error: 'Import failed. Please make sure the JSON file is valid.',
    toast_settings_apply_error: 'Error applying settings.',

    // Toast Messages - Player
    toast_alarm_started: 'Alarm started. Space = Pause, Esc = Stop.',
    toast_alarm_start_error: 'Error starting the alarm.',
    toast_alarm_paused: 'Alarm paused. Press Space to resume.',
    toast_alarm_resumed: 'Alarm resumed.',
    toast_alarm_stopped: 'Alarm stopped.',
    toast_mute_on: 'Sound muted.',
    toast_mute_off: 'Sound unmuted.',
    toast_loop_on: 'Loop mode enabled (5 min cycle).',
    toast_loop_off: 'Loop mode disabled.',

    // Toast Messages - Recording
    toast_rec_no_alarm: 'Please start the alarm first before recording.',
    toast_rec_no_duration: 'Please select a valid recording duration.',
    toast_rec_started: 'Recording started. The alarm is being captured.',
    toast_rec_start_error: 'Error starting the recording.',
    toast_rec_file_error: 'Error creating the recording file.',
    toast_rec_error_not_supported: 'Your browser does not support this recording feature.',
    toast_rec_error_security: 'Security error: Recording not allowed.',
    toast_rec_error_invalid_state: 'Recording is in an invalid state.',
    toast_rec_error_generic: 'A recording error occurred.',
    toast_rec_complete: 'Recording complete! Click Download to save the file.',
    toast_convert_complete: 'Conversion complete! Click Download.',
    toast_convert_error: 'Conversion error. Your browser may not support this format.',
    toast_rec_dismissed: 'Recording dismissed.',

    // Preset Play (via sticky player)
    preset_play: 'Play',

    // Preview Player
    preview_play: 'Preview play / pause',
    preview_stop: 'Stop preview',
    preview_volume: 'Preview volume',
    preview_playing: 'Preview playing...',
    preview_paused: 'Preview paused',

    // Preset Reset
    preset_active_label: 'Active Preset',
    preset_reset: 'Reset',
    preset_reset_title: 'Remove preset and reset oscillators to defaults',

    // Toast Messages - Presets
    toast_preset_loaded: 'Preset loaded.',
    toast_preset_load_error: 'Error loading preset.',
    toast_preset_reset: 'Preset removed. Oscillators reset to defaults.',

    // Toast Messages - Undo/Redo
    toast_undo: 'Change undone.',
    toast_redo: 'Change restored.',

    // Toast Messages - Copy/Paste
    toast_osc_copied: 'Oscillator settings copied.',
    toast_osc_pasted: 'Oscillator settings pasted.',

    // Donate
    donate_message:
      'If you like this project and would like to support its development, feel free to donate:',
    donate_button_text: 'Donate via PayPal',
  },
}
