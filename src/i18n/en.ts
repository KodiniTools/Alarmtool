/** English UI strings. Keys must match de.ts (test: tests/i18n.spec.js). */
export default {
  app_title: 'Modern Alarm Tool',
  app_subtitle: 'With 12 Oscillators & Live Recorder (Modular)',
  tab_filter: 'Filter',
  tab_oscillators: 'Oscillators',
  tab_recording: 'Recording',
  tab_presets: 'Presets',
  tab_faq: 'FAQ',
  tab_blog: 'Blog',
  tab_blog_title:
    'Blog article: Build your own alarm sound with the Alarm Tool (opens in a new tab)',

  // Presets
  presets_title: 'Alarm Presets',
  presets_intro:
    'Ready-to-use alarm tone configurations. "Play" starts a preset, "Edit" loads it into the oscillators for adjusting, "Record" plays it and opens the recorder.',
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
  preset_tornado_name: 'Tornado Siren',
  preset_tornado_desc:
    'Wailing sawtooth siren sweeping up and down with a beating detune and deep rumble — brutal storm warning.',
  preset_evacuation_name: 'Evacuation Alarm',
  preset_evacuation_desc:
    'Harsh triple square blasts in the T3 fire-alarm cadence with a piercing bandpass — evacuate now.',
  preset_intruder_name: 'Intruder Alarm',
  preset_intruder_desc:
    'Blistering fast, shrill two-tone square screech — a piercing burglar-alarm siren.',
  preset_malfunction_name: 'System Malfunction',
  preset_malfunction_desc:
    'Chaotic glitch stutter of square and sawtooth waves through a resonant filter — a machine in meltdown.',
  preset_foghorn_name: 'Foghorn',
  preset_foghorn_desc:
    'Deep organ foghorn with a fifth and a pulsing beacon tone — muffled harbour warning in the fog.',
  preset_tag_sine: 'Sine',
  preset_tag_triangle: 'Triangle',
  preset_tag_square: 'Square',
  preset_tag_sawtooth: 'Sawtooth',
  preset_tag_pulse: 'Pulse',
  preset_tag_organ: 'Organ',
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
  osc_undo: 'Undo',
  osc_redo: 'Redo',
  history_title: 'History',
  history_last: 'Last change',
  history_empty: 'No changes yet',
  history_change: 'Change',
  history_toggle: 'On/Off',
  history_preset: 'Load preset',
  key_ctrl: 'Ctrl',
  osc_sidebar_title: 'Oscillators',
  osc_select_title: 'Selection',
  settings_menu_title: 'Save options',
  osc_title_prefix: 'Oscillator',
  osc_enable: 'Enable oscillator',
  osc_disable: 'Disable oscillator',
  osc_waveform: 'Waveform',
  osc_wave_sine: 'Sine',
  osc_wave_square: 'Square',
  osc_wave_sawtooth: 'Sawtooth',
  osc_wave_triangle: 'Triangle',
  osc_wave_pulse: 'Pulse',
  osc_wave_organ: 'Organ',
  osc_frequency: 'Frequency (Hz)',
  osc_volume: 'Volume',
  osc_pan: 'Pan',
  osc_attack: 'Attack (ms)',
  osc_decay: 'Decay (ms)',
  osc_sustain: 'Sustain',
  osc_release: 'Release (ms)',
  osc_copy: 'Copy settings',
  osc_paste: 'Paste settings',
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
  player_custom: 'Custom',
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
    'Oscillators generate periodic waveforms (sine, square, sawtooth, triangle, pulse, organ) and are the foundation of sound generation.',
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
  preset_edit: 'Edit',
  preset_edit_title: 'Load preset and adjust it in the oscillator editor',
  preset_record: 'Record',
  preset_record_title: 'Play preset and switch to recording',

  // Hearing-safety warning
  hearing_warning_title: 'Hearing safety notice',
  hearing_warning_text:
    'These alarm tones can be very loud and may damage your hearing at high volume. Lower the volume before playing — especially with headphones.',
  hearing_warning_dismiss: 'Got it',

  // Preset Reset
  preset_active_label: 'Active Preset',
  preset_reset: 'Reset',
  preset_reset_title: 'Remove preset and reset oscillators to defaults',

  // Toast Messages - Presets
  toast_preset_loaded: 'Preset loaded.',
  toast_preset_load_error: 'Error loading preset.',
  toast_preset_reset: 'Preset removed. Oscillators reset to defaults.',

  // Toast Messages - Undo/Redo
  toast_undo: 'Undone:',
  toast_redo: 'Redone:',

  // Toast Messages - Copy/Paste
  toast_osc_copied: 'Oscillator settings copied.',
  toast_osc_pasted: 'Oscillator settings pasted.',

  // Landing page
  lp_eyebrow: 'Alarm sound generator in your browser',
  lp_title: 'Build your own alarm sound from up to 12 oscillators',
  lp_lead:
    'Pick a waveform, shape frequency and envelope, set the rhythm and save as WAV or MP3. Everything runs right in your browser, with no installation and no account.',
  lp_cta_start: 'Create alarm sound',
  lp_cta_learn: 'See features',
  lp_trust_free: 'Free',
  lp_trust_account: 'No sign-up',
  lp_trust_local: 'Sound is generated locally in your browser',
  lp_visual_label:
    'Illustration of the oscillator view: four active oscillators with sine, square, sawtooth and triangle waves add up to the alarm sound, which switches on and off in the set rhythm.',
  lp_visual_title: 'Oscillators',
  lp_visual_active: '4 of 12 active',
  lp_visual_off: 'Off',
  lp_visual_more: '+ 7 more oscillators',
  lp_visual_mix: 'Mix',
  lp_visual_mix_hint: 'Envelope and pattern 300, 150 ms',
  lp_fact_oscillators: 'oscillators at once',
  lp_fact_waveforms: 'waveforms',
  lp_fact_presets: 'ready-made alarm presets',
  lp_fact_uploads: 'uploads, everything stays in your browser',
  lp_features_title: 'Everything for an alarm sound that stands out',
  lp_features_lead:
    'From a single beep to a layered siren: every oscillator has its own waveform, frequency, volume, panning, envelope and pattern.',
  lp_feat_osc_title: '12 oscillators',
  lp_feat_osc_desc:
    'Sine, square, sawtooth, triangle, pulse and organ. Frequency from 50 to 2000 Hz, volume and stereo panning per oscillator.',
  lp_feat_env_title: 'Envelope and rhythm',
  lp_feat_env_desc:
    'Attack, decay, sustain and release shape each tone. A pattern of on and off times in milliseconds sets the beat.',
  lp_feat_filter_title: 'Global filter',
  lp_feat_filter_desc:
    'Low-pass, high-pass, band-pass or notch with adjustable frequency and Q colour the whole sound.',
  lp_feat_rec_title: 'Recording and export',
  lp_feat_rec_desc: 'Record live as WebM, OGG or WAV, then convert the recording to MP3 or WAV.',
  lp_feat_presets_title: 'Ready-made presets',
  lp_feat_presets_desc:
    'Siren, wake-up tone, heart monitor and more: play, adjust in the editor or record right away.',
  lp_feat_history_title: 'Undo and save',
  lp_feat_history_desc:
    'Undo changes, save settings in your browser or export and import them as a file.',
  lp_steps_title: 'Three steps to your alarm sound',
  lp_step1_title: 'Start',
  lp_step1_desc: 'Pick a preset as a starting point or begin with an empty oscillator.',
  lp_step2_title: 'Shape',
  lp_step2_desc: 'Set waveform, frequency, envelope and pattern and listen right away.',
  lp_step3_title: 'Save',
  lp_step3_desc: 'Record and download it as a file, for example as a ringtone or wake-up sound.',
  lp_final_title: 'Ready for your alarm sound?',
  lp_final_desc: 'The tool opens right in your browser. No installation, no account.',
}
