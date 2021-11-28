import Component from 'vue-class-component'
import BaseMixin from '@/components/mixins/base'
import {ServerJobQueueStateJob} from '@/store/server/jobQueue/types'
import {thumbnailBigMin, thumbnailSmallMax, thumbnailSmallMin} from '@/store/variables'
import {formatPrintTime} from '@/plugins/helpers'

@Component
export default class JobqueueMixin extends BaseMixin {
    formatPrintTime = formatPrintTime

    get jobs() {
        return this.$store.getters['server/jobQueue/getJobs']
    }

    get queueState() {
        return this.$store.state.server.jobQueue.queue_state ?? ''
    }


    startJobqueue() {
        this.$store.dispatch('server/jobQueue/start')
    }

    pauseJobqueue() {
        this.$store.dispatch('server/jobQueue/pause')
    }

    getSmallThumbnail(item: ServerJobQueueStateJob) {
        if (item?.metadata?.thumbnails?.length) {
            const thumbnail = item?.metadata?.thumbnails.find((thumb: any) =>
                thumb.width >= thumbnailSmallMin && thumb.width <= thumbnailSmallMax &&
                thumb.height >= thumbnailSmallMin && thumb.height <= thumbnailSmallMax
            )
            const path = item.filename.lastIndexOf('/') !== -1 ? 'gcodes/'+item.filename.slice(0, item.filename.lastIndexOf('/')) : 'gcodes'

            if (thumbnail && 'relative_path' in thumbnail) return this.apiUrl+'/server/files/'+path+'/'+encodeURIComponent(thumbnail.relative_path)+'?timestamp='+item.metadata?.modified.getTime()
        }

        return ''
    }

    getBigThumbnail(item: ServerJobQueueStateJob) {
        if (item?.metadata?.thumbnails?.length) {
            const thumbnail = item?.metadata?.thumbnails.find((thumb: any) => thumb.width >= thumbnailBigMin)
            const path = item.filename.lastIndexOf('/') !== -1 ? 'gcodes/'+item.filename.slice(0, item.filename.lastIndexOf('/')) : 'gcodes'

            if (thumbnail && 'relative_path' in thumbnail) return this.apiUrl+'/server/files/'+path+'/'+encodeURIComponent(thumbnail.relative_path)+'?timestamp='+item.metadata?.modified.getTime()
        }

        return ''
    }

    getDescription(item: ServerJobQueueStateJob) {
        let output = ''

        output += this.$t('Files.Filament')+': '
        if (item.metadata?.filament_total || item.metadata.filament_weight_total) {
            if (item.metadata?.filament_total) output += item.metadata.filament_total.toFixed()+' mm'
            if (item.metadata?.filament_total && item.metadata.filament_weight_total) output += ' / '
            if (item.metadata?.filament_weight_total) output += item.metadata.filament_weight_total.toFixed(2)+' g'
        } else output += '--'

        output += ', '+this.$t('Files.PrintTime')+': '
        if (item.metadata?.estimated_time) output += formatPrintTime(item.metadata.estimated_time)
        else output += '--'

        return output
    }

    existMetadata(item: ServerJobQueueStateJob) {
        return item?.metadata?.metadataPulled
    }

}