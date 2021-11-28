<style lang="scss" scoped>

</style>

<template v-if="moonrakerComponents.includes('job_queue') && jobs.length">
    <div>
        <v-divider class="my-0"></v-divider>
        <v-container class="py-0">
            <v-row>
                <v-col>
                    <strong>{{ $t("Panels.StatusPanel.JobQueue") }}</strong>
                </v-col>
            </v-row>
            <v-row v-for="item in nextJobs" v-bind:key="item.job_id">
                <v-col class="col-auto py-1 pr-0 d-flex align-center " width="16">
                    <template v-if="getSmallThumbnail(item)">
                        <vue-load-image class="d-flex">
                            <img slot="image" :src="getSmallThumbnail(item)" width="20" height="20" />
                            <v-progress-circular slot="preloader" indeterminate color="primary"></v-progress-circular>
                            <v-icon slot="error">mdi-file</v-icon>
                        </vue-load-image>
                    </template>
                    <template v-else>
                        <v-icon small>mdi-file</v-icon>
                    </template>
                </v-col>
                <v-col class="py-0 d-flex align-center">
                    {{ item.filename }}
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import {Mixins} from 'vue-property-decorator'
import JobqueueMixin from '@/components/mixins/jobqueue'
@Component
export default class StatusPanelJobqueue extends Mixins(JobqueueMixin) {

    get nextJobs() {
        return this.jobs.slice(0, 3)
    }
}
</script>