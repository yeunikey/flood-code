declare module '@mapbox/mbtiles' {
    import { EventEmitter } from 'events';

    interface MBTilesOptions {
        mode?: string;
    }

    export default class MBTiles extends EventEmitter {
        constructor(path: string, callback: (err: Error | null, mbtiles: MBTiles) => void);
        getTile(z: number, x: number, y: number, callback: (err: Error | null, data?: Buffer) => void): void;
        getInfo(callback: (err: Error | null, info?: any) => void): void;
    }
}
