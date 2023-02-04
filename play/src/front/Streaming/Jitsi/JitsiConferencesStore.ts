/**
 * This store contains a list of all the Jitsi conferences we are subscribed in.
 */


import {writable} from "svelte/store";
import {JitsiConferenceWrapper} from "./JitsiConferenceWrapper";

/**
 * A store that contains the list of Jitsi conferences a user is part of
 */
function createJitsiConferencesStore() {
    const { subscribe, set, update } = writable(new Map<string, JitsiConferenceWrapper>());

    return {
        subscribe,
        addNewConference(jitsiRoom: string, conference: JitsiConferenceWrapper) {
            update((conferences) => {
                conferences.set(jitsiRoom, conference);
                return conferences;
            });
        },
        removePeer(jitsiRoom: string) {
            update((conferences) => {
                conferences.delete(jitsiRoom);
                return conferences;
            });
        },
        cleanupStore() {
            set(new Map<string, JitsiConferenceWrapper>());
        },
    };
}

export const jitsiConferencesStore = createJitsiConferencesStore();
