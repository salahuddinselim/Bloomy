declare module "gifenc" {
  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: string; oneBitAlpha?: boolean | number }
  ): Uint8Array<ArrayBuffer>;
  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: Uint8Array<ArrayBuffer>,
    format?: string
  ): Uint8Array<ArrayBuffer>;
  export interface GIFEncoderInstance {
    writeFrame(
      index: Uint8Array<ArrayBuffer>,
      width: number,
      height: number,
      opts?: { palette?: Uint8Array<ArrayBuffer>; delay?: number; transparent?: boolean; transparentIndex?: number; repeat?: number; dispose?: number }
    ): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
    reset(): void;
  }
  export function GIFEncoder(opts?: { auto?: boolean; initialCapacity?: number }): GIFEncoderInstance;
}