<template>
    <div>
        <panel
            icon="mdi-tray-full"
            :title="$t('JobQueue.JobQueue')"
            card-class="jobqueue-panel"
        >
            <template v-slot:buttons>
                <v-btn
                    color="success"
                    @click="startJobqueue"
                    :loading="loadings.includes('resumeJobqueue')"
                    icon
                    tile
                    v-if="queueState === 'paused'"
                >
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">mdi-play</v-icon>
                        </template>
                        <span>{{ $t('JobQueue.Start') }}</span>
                    </v-tooltip>
                </v-btn>
                <v-btn
                    color="warning"
                    @click="pauseJobqueue"
                    :loading="loadings.includes('pauseJobqueue')"
                    icon
                    tile
                    v-if="['ready', 'loading'].includes(queueState)"
                >
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">mdi-pause</v-icon>
                        </template>
                        <span>{{ $t('JobQueue.Pause') }}</span>
                    </v-tooltip>
                </v-btn>
            </template>
            <v-data-table
                :items="jobs"
                class="jobqueue-table"
                sort-by="time_added"
                :items-per-page.sync="countPerPage"
                :footer-props="{
                    itemsPerPageText: $t('JobQueue.Jobs'),
                    itemsPerPageAllText: $t('JobQueue.AllJobs'),
                    itemsPerPageOptions: [10,25,50,100,-1]
                }"
                mobile-breakpoint="0">

                <template #no-data>
                    <div class="text-center">{{ $t('JobQueue.Empty') }}</div>
                </template>

                <template #item="{ index, item }">
                    <tr
                        :key="item.job_id"
                        v-longpress:600="(e) => showContextMenu(e, item)"
                        @contextmenu="showContextMenu($event, item)"
                        class="file-list-cursor user-select-none"
                    >
                        <td class="pr-0 text-center" style="width: 32px;">
                            <template v-if="getSmallThumbnail(item) && getBigThumbnail(item)">
                                <v-tooltip v-if="!item.isDirectory && getSmallThumbnail(item) && getBigThumbnail(item)" top content-class="tooltip__content-opacity1">
                                    <template v-slot:activator="{ on, attrs }">
                                        <vue-load-image>
                                            <img slot="image" :src="getSmallThumbnail(item)" width="32" height="32" v-bind="attrs" v-on="on" />
                                            <v-progress-circular slot="preloader" indeterminate color="primary"></v-progress-circular>
                                            <v-icon slot="error">mdi-file</v-icon>
                                        </vue-load-image>
                                    </template>
                                    <span><img :src="getBigThumbnail(item)" width="250" /></span>
                                </v-tooltip>
                            </template>
                            <template v-else-if="getSmallThumbnail(item)">
                                <vue-load-image>
                                    <img slot="image" :src="getSmallThumbnail(item)" width="32" height="32" />
                                    <v-progress-circular slot="preloader" indeterminate color="primary"></v-progress-circular>
                                    <v-icon slot="error">mdi-file</v-icon>
                                </vue-load-image>
                            </template>
                            <template v-else>
                                <v-icon>mdi-file</v-icon>
                            </template>
                        </td>
                        <td class=" ">
                            {{ item.filename }}
                            <template v-if="existMetadata(item)">
                                <br />
                                <small>{{ getDescription(item) }}</small>
                            </template>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </panel>
        <v-menu v-model="contextMenu.shown" :position-x="contextMenu.x" :position-y="contextMenu.y" absolute offset-y>
            <v-list>
                <v-list-item @click="deleteJob(contextMenu.item)">
                    <v-icon class="mr-1">mdi-delete</v-icon> {{ $t('JobQueue.Delete') }}
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import {Component, Mixins} from 'vue-property-decorator'
import JobqueueMixin from '@/components/mixins/jobqueue'
import {ServerHistoryStateJob} from '@/store/server/history/types'
import {formatFilesize} from '@/plugins/helpers'
import Panel from '@/components/ui/Panel.vue'
import {ServerJobQueueStateJob} from '@/store/server/jobQueue/types'
@Component({
    components: {Panel}
})
export default class JobqueuePanel extends Mixins(JobqueueMixin) {
    formatFilesize = formatFilesize

    private contextMenu = {
        shown: false,
        touchTimer: undefined,
        x: 0,
        y: 0,
        item: {}
    }

    get countPerPage() {
        return this.$store.state.gui.jobqueue.countPerPage
    }

    set countPerPage(newVal) {
        this.$store.dispatch('gui/saveSetting', { name: 'jobqueue.countPerPage', value: newVal })
    }
    
    showContextMenu (e: any, item: ServerHistoryStateJob) {
        if (!this.contextMenu.shown) {
            e?.preventDefault()
            this.contextMenu.shown = true
            this.contextMenu.x = e?.clientX || e?.pageX || window.screenX / 2
            this.contextMenu.y = e?.clientY || e?.pageY || window.screenY / 2
            this.contextMenu.item = item
            this.$nextTick(() => {
                this.contextMenu.shown = true
            })
        }
    }

    deleteJob(item: ServerJobQueueStateJob) {
        this.$store.dispatch('server/jobQueue/deleteFromQueue', [item.job_id])
    }
}
</script>
