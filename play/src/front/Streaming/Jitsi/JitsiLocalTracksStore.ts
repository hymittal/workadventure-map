

// This store is in charge of returning Jitsi local tracks (video, audio, desktop)
// Those tracks should be fetched when:
// - a webcam or microphone is up
// - at least one Jitsi conference requires broadcast

import {derived} from "svelte/store";
import {jitsiConferencesStore} from "./JitsiConferencesStore";
import {requestedCameraState, requestedMicrophoneState} from "../../Stores/MediaStore";

export const jitsiLocalTracksStore = derived([jitsiConferencesStore, requestedCameraState, requestedMicrophoneState], ([$jitsiConferencesStore, $requestedCameraState, $requestedMicrophoneState]) => {
    // TODO: check jitsiConferencesStore and filter with requestedCameraState and requestedMicrophoneState
    // TODO: also think about "disposing" the tracks when not needed anymore!
});

const JitsiMeetJS = window.JitsiMeetJS;

JitsiMeetJS.createLocalTracks({
    devices
}).then(onLocalTracks).catch(e => console.error(e));

