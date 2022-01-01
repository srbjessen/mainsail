/**
 * WebRtcPlayer
 *
 * This Class is to control a webRTC stream. This class is based on the work of vdalex25.
 *
 * @link    https://github.com/vdalex25/WebRtcPlayer
 * @file    This File defines the Index class.
 * @author  vdalex25
 *
 */

export class WebRtcPlayer {
    private server = '127.0.0.1:8083'
    private video: HTMLVideoElement | null = null
    private uuid: string = ''
    private options: any = {
        onStatusChange:null
    }

    private codecLink = ''
    private rsdpLink = ''

    private webrtc: RTCPeerConnection | null = null
    private stream: MediaStream = new MediaStream()

    constructor(videoElement: HTMLVideoElement, server: string, uuid: string, options={}) {
        this.server = server
        this.video = videoElement
        this.uuid = uuid
        Object.assign(this.options, options)
        this.createLinks()
        this.play()
    }

    createLinks() {
        this.codecLink = '//' + this.server + '/stream/codec/' + this.uuid
        this.rsdpLink = '//' + this.server + '/stream/receiver/' + this.uuid
    }

    play() {
        this.webrtc = new RTCPeerConnection({
            iceServers: [{
                urls: ['stun:stun.l.google.com:19302']
            }]
        })
        this.webrtc.onnegotiationneeded = this.handleNegotiationNeeded.bind(this)
        this.webrtc.ontrack = this.onTrack.bind(this)
        fetch(this.codecLink)
            .then((response) => {
                response.json().then((data) => {
                    data.forEach((item: any) => {
                        this.webrtc?.addTransceiver(item.Type, {
                            'direction': 'sendrecv'
                        })
                    })
                })
            })
            .catch((error) => {
                window.console.log(error)
            })

        this.webrtc.onconnectionstatechange = () => {
            if(typeof this.options.onStatusChange == 'function'){
                this.options.onStatusChange(this.webrtc?.connectionState)
            }
        }
    }

    async handleNegotiationNeeded() {
        const offer = await this.webrtc?.createOffer()
        await this.webrtc?.setLocalDescription(offer)
        const formData = new FormData()
        formData.append('suuid', this.uuid)
        formData.append('data', btoa(this.webrtc?.localDescription?.sdp ?? ''))
        fetch(this.rsdpLink, {
            method: 'POST',
            body: formData
        })
            .then((response) => {
                response.text().then((data) => {
                    this.webrtc?.setRemoteDescription(new RTCSessionDescription({
                        type: 'answer',
                        sdp: atob(data)
                    }))
                })
            })
            .catch(() => {})
    }

    onTrack(event: any) {
        this.stream.addTrack(event.track)
        if (this.video) {
            this.video.srcObject = this.stream
            this.video.play()
        }
    }

    load(uuid: string) {
        this.destroy()
        this.uuid = uuid
        this.createLinks()
        this.play()
    }

    destroy() {
        this.webrtc?.close()
        this.webrtc = null
        if (this.video) this.video.srcObject = null
        this.stream = new MediaStream()
    }

    getImageUrl() {
        if (this.video === null) return ''

        const canvas = document.createElement('canvas')
        canvas.width = this.video.videoWidth
        canvas.height = this.video.videoHeight
        canvas?.getContext('2d')?.drawImage(this.video, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL()
        canvas.remove()
        return dataURL
    }
}