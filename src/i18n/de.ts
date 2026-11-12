/** Deutsche Texte der Oberfläche. Schlüssel müssen mit en.ts übereinstimmen (Test: tests/i18n.spec.js). */
export default {
  app_title: 'Modernes Alarm-Tool',
  app_subtitle: 'Mit 12 Oszillatoren & Live-Recorder (Modular)',
  tab_filter: 'Filter',
  tab_oscillators: 'Oszillatoren',
  tab_recording: 'Aufnahme',
  tab_presets: 'Presets',
  tab_faq: 'FAQ',
  tab_blog: 'Blog',
  tab_blog_title: 'Blog-Artikel: Eigener Alarmton mit dem Alarm-Tool (öffnet in neuem Tab)',

  // Presets
  presets_title: 'Alarm-Presets',
  presets_intro:
    'Fertige Alarmton-Konfigurationen. „Abspielen“ startet ein Preset, „Bearbeiten“ lädt es zum Anpassen in die Oszillatoren, „Aufnehmen“ spielt es ab und öffnet die Aufnahme.',
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
  preset_tornado_name: 'Tornado-Sirene',
  preset_tornado_desc:
    'Auf- und abheulende Sägezahn-Sirene mit Schwebung und tiefem Grollen — brachiale Unwetterwarnung.',
  preset_evacuation_name: 'Evakuierungsalarm',
  preset_evacuation_desc:
    'Harte Dreifach-Rechteckstöße im T3-Feueralarm-Rhythmus mit stechendem Bandpass — sofort räumen.',
  preset_intruder_name: 'Einbruchalarm',
  preset_intruder_desc:
    'Rasend schnelles, schrilles Rechteck-Zweiton-Kreischen — durchdringender Einbruch-Sirenenalarm.',
  preset_foghorn_name: 'Nebelhorn',
  preset_foghorn_desc:
    'Tiefes Orgel-Nebelhorn mit Quinte und pulsierendem Signalton — dumpfe Hafenwarnung im Nebel.',
  preset_tag_sine: 'Sinus',
  preset_tag_triangle: 'Dreieck',
  preset_tag_square: 'Rechteck',
  preset_tag_sawtooth: 'Sägezahn',
  preset_tag_pulse: 'Puls',
  preset_tag_organ: 'Orgel',
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
  osc_undo: 'Rückgängig',
  osc_redo: 'Wiederholen',
  history_title: 'Verlauf',
  history_last: 'Zuletzt',
  history_empty: 'Noch keine Änderungen',
  history_change: 'Änderung',
  history_toggle: 'Ein/Aus',
  history_preset: 'Preset laden',
  key_ctrl: 'Strg',
  osc_sidebar_title: 'Oszillatoren',
  osc_select_title: 'Auswahl',
  settings_menu_title: 'Speicheroptionen',
  osc_title_prefix: 'Oszillator',
  osc_enable: 'Oszillator aktivieren',
  osc_disable: 'Oszillator deaktivieren',
  osc_waveform: 'Wellenform',
  osc_wave_sine: 'Sinus',
  osc_wave_square: 'Rechteck',
  osc_wave_sawtooth: 'Sägezahn',
  osc_wave_triangle: 'Dreieck',
  osc_wave_pulse: 'Puls',
  osc_wave_organ: 'Orgel',
  osc_frequency: 'Frequenz (Hz)',
  osc_volume: 'Lautstärke',
  osc_pan: 'Pan',
  osc_attack: 'Attack (ms)',
  osc_decay: 'Decay (ms)',
  osc_sustain: 'Sustain',
  osc_release: 'Release (ms)',
  osc_copy: 'Einstellungen kopieren',
  osc_paste: 'Einstellungen einfügen',
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
  player_custom: 'Benutzerdefiniert',
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
    'Oszillatoren erzeugen periodische Wellenformen (Sinus, Rechteck, Sägezahn, Dreieck, Puls, Orgel) und sind die Grundlage der Klangerzeugung.',
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
  preset_edit: 'Bearbeiten',
  preset_edit_title: 'Preset laden und im Oszillator-Editor anpassen',
  preset_record: 'Aufnehmen',
  preset_record_title: 'Preset abspielen und zur Aufnahme wechseln',

  // Hearing-safety warning
  hearing_warning_title: 'Gehörschutz-Hinweis',
  hearing_warning_text:
    'Diese Alarmtöne können sehr laut sein und bei hoher Lautstärke das Gehör schädigen. Reduziere die Lautstärke, bevor du abspielst — besonders mit Kopfhörern.',
  hearing_warning_dismiss: 'Verstanden',

  // Preset Reset
  preset_active_label: 'Aktives Preset',
  preset_reset: 'Zurücksetzen',
  preset_reset_title: 'Preset entfernen und Oszillatoren auf Grundeinstellungen zurücksetzen',

  // Toast Messages - Presets
  toast_preset_loaded: 'Preset geladen.',
  toast_preset_load_error: 'Fehler beim Laden des Presets.',
  toast_preset_reset: 'Preset entfernt. Oszillatoren auf Grundeinstellungen zurückgesetzt.',

  // Toast Messages - Undo/Redo
  toast_undo: 'Rückgängig:',
  toast_redo: 'Wiederholt:',

  // Toast Messages - Copy/Paste
  toast_osc_copied: 'Oszillator-Einstellungen kopiert.',
  toast_osc_pasted: 'Oszillator-Einstellungen eingefügt.',

  // Landing-Page
  lp_eyebrow: 'Alarmton-Generator im Browser',
  lp_title: 'Bau deinen eigenen Alarmton aus bis zu 12 Oszillatoren',
  lp_lead:
    'Wellenform wählen, Frequenz und Hüllkurve formen, Rhythmus festlegen und als WAV oder MP3 speichern. Alles läuft direkt im Browser, ohne Installation und ohne Konto.',
  lp_cta_start: 'Alarmton erstellen',
  lp_cta_learn: 'Funktionen ansehen',
  lp_trust_free: 'Kostenlos',
  lp_trust_account: 'Ohne Anmeldung',
  lp_trust_local: 'Klang entsteht lokal im Browser',
  lp_visual_label:
    'Illustration der Oszillator-Ansicht: vier aktive Oszillatoren mit Sinus-, Rechteck-, Sägezahn- und Dreieckwelle ergeben zusammen den Alarmton, der im eingestellten Rhythmus an- und ausgeht.',
  lp_visual_title: 'Oszillatoren',
  lp_visual_active: '4 von 12 aktiv',
  lp_visual_off: 'Aus',
  lp_visual_more: '+ 7 weitere Oszillatoren',
  lp_visual_mix: 'Summe',
  lp_fact_oscillators: 'Oszillatoren gleichzeitig',
  lp_fact_waveforms: 'Wellenformen',
  lp_fact_presets: 'fertige Alarm-Presets',
  lp_fact_uploads: 'Uploads, alles bleibt im Browser',
  lp_features_title: 'Alles für einen Alarmton, der auffällt',
  lp_features_lead:
    'Vom einzelnen Piepton bis zur mehrstimmigen Sirene: Jeder Oszillator hat eigene Wellenform, Frequenz, Lautstärke, Panorama, Hüllkurve und Muster.',
  lp_feat_osc_title: '12 Oszillatoren',
  lp_feat_osc_desc:
    'Sinus, Rechteck, Sägezahn, Dreieck, Puls und Orgel. Frequenz von 50 bis 2000 Hz, Lautstärke und Stereo-Panorama je Oszillator.',
  lp_feat_env_title: 'Hüllkurve und Rhythmus',
  lp_feat_env_desc:
    'Attack, Decay, Sustain und Release formen jeden Ton. Ein Muster aus An- und Aus-Zeiten in Millisekunden gibt den Takt vor.',
  lp_feat_filter_title: 'Globaler Filter',
  lp_feat_filter_desc:
    'Tiefpass, Hochpass, Bandpass oder Notch mit einstellbarer Frequenz und Güte färben den gesamten Klang.',
  lp_feat_rec_title: 'Aufnahme und Export',
  lp_feat_rec_desc:
    'Live als WebM, OGG oder WAV aufnehmen und die Aufnahme anschließend in MP3 oder WAV umwandeln.',
  lp_feat_presets_title: 'Fertige Presets',
  lp_feat_presets_desc:
    'Sirene, Weckton, Herzmonitor und mehr: abspielen, im Editor anpassen oder direkt aufnehmen.',
  lp_feat_history_title: 'Rückgängig und Speichern',
  lp_feat_history_desc:
    'Änderungen rückgängig machen, Einstellungen im Browser speichern oder als Datei exportieren und importieren.',
  lp_steps_title: 'In drei Schritten zum Alarmton',
  lp_step1_title: 'Starten',
  lp_step1_desc: 'Ein Preset als Ausgangspunkt wählen oder mit einem leeren Oszillator beginnen.',
  lp_step2_title: 'Formen',
  lp_step2_desc: 'Wellenform, Frequenz, Hüllkurve und Muster einstellen und sofort anhören.',
  lp_step3_title: 'Speichern',
  lp_step3_desc: 'Aufnehmen und als Datei herunterladen, zum Beispiel als Klingel- oder Weckton.',
  lp_final_title: 'Bereit für deinen Alarmton?',
  lp_final_desc: 'Das Tool öffnet sich direkt im Browser. Keine Installation, kein Konto.',

  // Live-Vorschau der Oszillatoren
  scope_title: 'Live-Vorschau',
  scope_live: 'Wiedergabe',
  scope_empty:
    'Kein Oszillator aktiv. Schalte in der Auswahl einen Oszillator ein, um die Vorschau zu sehen.',
  scope_mix: 'Summe',
  tab_home: 'Start',
  tab_home_title: 'Zur Startseite des Alarmtools',
}
