// Typen für den genutzten Teil der gebündelten MP3-Bibliothek lamejs.js.

export class Mp3Encoder {
  constructor(channels: number, sampleRate: number, kbps: number)
  /** Encodes one block of 16-bit samples (right only for stereo); returns MP3 bytes. */
  encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array<ArrayBuffer>
  /** Flushes the remaining MP3 bytes. */
  flush(): Int8Array<ArrayBuffer>
}
