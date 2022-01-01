<style scoped>
    .webcamImage {
        width: 100%;
    }
</style>

<template>
    <video ref="videoElement" autoplay controls muted class="webcamImage" v-observe-visibility="visibilityChanged"></video>
</template>

<script lang="ts">

import {Component, Mixins, Prop} from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import {WebRtcPlayer} from '@/assets/js/WebRtcPlayer'

@Component
export default class Webrtc extends Mixins(BaseMixin) {
    private isVisible = true
    private player: WebRtcPlayer | null = null

    $refs!: {
        videoElement: HTMLVideoElement
    }

    @Prop({ required: true })
    camSettings: any

    @Prop()
    printerUrl: string | undefined

    get url() {
        return this.camSettings.urlStream || ''
    }

    visibilityChanged(isVisible:boolean) {
        this.isVisible = isVisible
    }

    mounted() {
        this.player = new WebRtcPlayer(this.$refs.videoElement, this.url, 'Raspicam')
    }

    beforeDestroy() {
        this.player?.destroy()
    }
}
</script>