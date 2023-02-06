import {Readable, readable, Unsubscriber, Writable, writable} from "svelte/store";
import JitsiParticipant from "lib-jitsi-meet/types/hand-crafted/JitsiParticipant";
import JitsiTrack from "lib-jitsi-meet/types/hand-crafted/modules/RTC/JitsiTrack";
import { MapStore } from "@workadventure/store-utils";
import JitsiConnection from "lib-jitsi-meet/types/hand-crafted/JitsiConnection";
import JitsiConference from "lib-jitsi-meet/types/hand-crafted/JitsiConference";
import {jitsiLocalTracksStore} from "./JitsiLocalTracksStore";
import {JitsiLocalTracks} from "./JitsiLocalTracks";

export type DeviceType = "video" | "audio" | "desktop";

export class JitsiConferenceWrapper {
    public readonly participantStore : MapStore<string, JitsiParticipant>;

    public readonly streamStore : Readable<JitsiTrack[]>;

    private readonly _broadcastDevicesStore : Writable<DeviceType[]>;

    private localTracksStoreUnsubscribe: Unsubscriber|undefined;

    constructor(private jitsiConference: JitsiConference) {
        this._broadcastDevicesStore = writable<DeviceType[]>([]);
    }

    public static join(connection: JitsiConnection, jitsiRoomName: string): Promise<JitsiConferenceWrapper> {

        return new Promise((resolve, reject) => {
            const JitsiMeetJS = window.JitsiMeetJS;
            const room = connection.initJitsiConference(jitsiRoomName, {});

            const jitsiConferenceWrapper = new JitsiConferenceWrapper(room);

            let isJoined = false;
            let localTracks: any[] = [];
            room.on(
                JitsiMeetJS.events.conference.CONFERENCE_JOINED,
                () => {
                    isJoined = true;
                    resolve(jitsiConferenceWrapper);
                    console.error("conference joined")
                });
            room.on(
                JitsiMeetJS.events.conference.CONFERENCE_FAILED,
                (e) => {
                    reject(e);
                    console.error("conference failed")
                });
            room.on(
                JitsiMeetJS.events.conference.CONNECTION_ESTABLISHED,
                () => {
                    console.error("CONNECTION_ESTABLISHED")
                });
            room.on(
                JitsiMeetJS.events.conference.CONNECTION_INTERRUPTED,
                () => {
                    console.error("CONNECTION_INTERRUPTED")
                });
            room.on(
                JitsiMeetJS.events.conference.CONNECTION_RESTORED,
                () => {
                    console.error("CONNECTION_RESTORED")
                });




            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // TODO continue here
            // function onLocalTracks(tracks) {
            //     console.error("ONLOCALTRACKS", tracks)
            //     localTracks = tracks;
            //     for (let i = 0; i < localTracks.length; i++) {
            //         localTracks[i].addEventListener(
            //             JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            //             audioLevel => console.log(`Audio Level local: ${audioLevel}`));
            //         localTracks[i].addEventListener(
            //             JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            //             () => console.log('local track muted'));
            //         localTracks[i].addEventListener(
            //             JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            //             () => console.log('local track stopped'));
            //         localTracks[i].addEventListener(
            //             JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            //             deviceId =>
            //                 console.log(
            //                     `track audio output device was changed to ${deviceId}`));
            //         if (localTracks[i].getType() === 'video') {
            //             console.error("OUTPUTTING VIDEO")
            //             /*   const video = document.createElement("video");
            //                video.id = `localVideo${i}`;
            //                video.autoplay = true;
            //
            //                window.document.body.prepend(video);
            //
            //                //$('body').append(`<video autoplay='1' id='localVideo${i}' />`);
            //                localTracks[i].attach($(`#localVideo${i}`)[0]);*/
            //         } else {
            //             console.error("AUDIO ONLY")
            //             /*$('body').append(
            //                 `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            //             localTracks[i].attach($(`#localAudio${i}`)[0]);*/
            //         }
            //         if (isJoined) {
            //             room.addTrack(localTracks[i]).catch(e => console.error(e));
            //         }
            //     }
            // }

            let oldTracks = new JitsiLocalTracks([]);

            jitsiConferenceWrapper.localTracksStoreUnsubscribe = jitsiLocalTracksStore.subscribe((result) => {
                if (!result) {
                    return;
                }
                if (result.ok) {
                    const tracks = result.value;
                    if (tracks.audio !== oldTracks.audio) {
                        if (tracks.audio === undefined && oldTracks.audio !== undefined) {
                            room.removeTrack(oldTracks.audio);
                        } else if (tracks.audio !== undefined) {
                            if (oldTracks.audio !== undefined) {
                                room.replaceTrack(oldTracks.audio, tracks.audio).catch(e => console.error("Error replacing track", e));
                            } else {
                                console.log("ADDING AUDIO TRACK")
                                room.addTrack(tracks.audio).catch(e => console.error("Error adding track", e));
                            }
                        }
                    }

                    if (tracks.video !== oldTracks.video) {
                        if (tracks.video === undefined && oldTracks.video !== undefined) {
                            room.removeTrack(oldTracks.video);
                        } else if (tracks.video !== undefined) {
                            if (oldTracks.video !== undefined) {
                                room.replaceTrack(oldTracks.video, tracks.video).catch(e => console.error("Error replacing track", e));
                            } else {
                                console.log("ADDING VIDEO TRACK")
                                room.addTrack(tracks.video).catch(e => console.error("Error adding track", e));
                            }
                        }
                    }

                    if (tracks.screenSharing !== oldTracks.screenSharing) {
                        if (tracks.screenSharing === undefined && oldTracks.screenSharing !== undefined) {
                            room.removeTrack(oldTracks.screenSharing);
                        } else if (tracks.screenSharing !== undefined) {
                            if (oldTracks.screenSharing !== undefined) {
                                room.replaceTrack(oldTracks.screenSharing, tracks.screenSharing).catch(e => console.error("Error replacing track", e));
                            } else {
                                room.addTrack(tracks.screenSharing).catch(e => console.error("Error adding track", e));
                            }
                        }
                    }

                    oldTracks = tracks;
                } else {
                    console.error(result.error);
                }
            });


            let remoteTracks: JitsiTrack[] = [];

            /**
             * Handles remote tracks
             * @param track JitsiTrack object
             */
            function onRemoteTrack(track: JitsiTrack) {
                if (track.isLocal()) {
                    return;
                }
                const participant = track.getParticipantId();

                if (!remoteTracks[participant]) {
                    remoteTracks[participant] = [];
                }
                const idx = remoteTracks[participant].push(track);

                track.addEventListener(
                    JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
                    audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
                track.addEventListener(
                    JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                    () => console.log('remote track muted'));
                track.addEventListener(
                    JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                    () => console.log('remote track stopped'));
                track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
                    deviceId =>
                        console.log(
                            `track audio output device was changed to ${deviceId}`));
                const id = participant + track.getType() + idx;

                if (track.getType() === 'video') {
                    $('body').prepend(
                        `<video autoplay='1' id='${participant}video${idx}' />`);
                } else {
                    $('body').prepend(
                        `<audio autoplay='1' id='${participant}audio${idx}' />`);
                }
                track.attach(document.getElementById(`${id}`));
            }


            room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
            room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
                console.log(`track removed!!!${track}`);
            });

            /*room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
                console.log('user join');
                remoteTracks[id] = [];
            });
            room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
            room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
                console.log(`${track.getType()} - ${track.isMuted()}`);
            });
            room.on(
                JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
                (userID, displayName) => console.log(`${userID} - ${displayName}`));
            room.on(
                JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
                (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
            room.on(
                JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
                () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));*/
            room.join("");
        });
    }

    public broadcast(devices: ("video" | "audio" | "desktop")[]) {
        this._broadcastDevicesStore.set(devices);
    }

    public leave(reason?: string): Promise<unknown> {
        if (this.localTracksStoreUnsubscribe) {
            this.localTracksStoreUnsubscribe();
        }
        return this.jitsiConference.leave(reason);
    }

    get broadcastDevicesStore(): Readable<DeviceType[]> {
        return this._broadcastDevicesStore;
    }
}
