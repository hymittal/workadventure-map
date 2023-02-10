import JitsiTrack from "lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack";

export class JitsiTrackWrapper {
    constructor(private _jitsiTrack: JitsiTrack) {
    }

    get uniqueId(): string {
        const trackId = this._jitsiTrack.getTrackId();
        if (trackId === null) {
            throw new Error("Jitsi Track has no ID");
        }
        return trackId;
    }

    get jitsiTrack(): JitsiTrack {
        return this._jitsiTrack;
    }
}
