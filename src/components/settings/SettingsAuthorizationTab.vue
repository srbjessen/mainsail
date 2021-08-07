<template>
    <div>
        <v-card flat v-if="!form.bool">
            <v-card-text>
                <settings-row :title="$t('Settings.AuthorizationTab.ApiKey')">
                    <v-text-field
                        :value="apiKey"
                        prepend-icon="mdi-refresh"
                        append-icon="mdi-content-copy"
                        @click:append="copyKey"
                        @click:prepend="refreshKey"
                        readonly outlined dense hide-details
                    ></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <template v-for="(user, index) in availableUsers">
                    <settings-row :title="user.username" v-bind:key="index">
                        <v-btn small outlined @click="deleteUser(user.username)" class="ml-3 minwidth-0 px-2" color="error">
                            <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                    </settings-row>
                    <v-divider class="my-2" v-bind:key="'divider_'+index"></v-divider>
                </template>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
                <v-btn text color="primary" @click="createUser">{{ $t("Settings.AuthorizationTab.CreateUser")}}</v-btn>
            </v-card-actions>
        </v-card>
        <v-card flat v-else-if="form.bool">
            <v-form v-model="form.valid" @submit.prevent="saveUser" >
                <v-card-title>{{ form.index === null ? $t('Settings.AuthorizationTab.CreateHeadline') : $t('Settings.AuthorizationTab.EditHeadline') }}</v-card-title>
                <v-card-text>
                    <v-row class="mt-3" v-if="form.error">
                        <v-col class="py-0">
                            <v-alert dense text type="error">{{ $t('Settings.AuthorizationTab.ErrorSaving')}}</v-alert>
                        </v-col>
                    </v-row>
                    <settings-row :title="$t('Settings.AuthorizationTab.Username')">
                        <v-text-field
                            v-model="form.username"
                            hide-details="auto"
                            :rules="[rules.required, rules.unique]"
                            dense
                            outlined
                            :name="'username_'+(Math.random()*1000).toFixed()"
                            autocomplete="off"
                        ></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.AuthorizationTab.Password')">
                        <v-text-field
                            v-model="form.password"
                            hide-details="auto"
                            dense
                            outlined
                            :append-icon="form.passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required]"
                            :type="form.passwordShow ? 'text' : 'password'"
                            counter
                            @click:append="form.passwordShow = !form.passwordShow"
                            :name="'password_'+(Math.random()*1000).toFixed()"
                            autocomplete="off"
                        ></v-text-field>
                    </settings-row>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn text @click="form.bool = false" >
                        {{ $t('Settings.Cancel') }}
                    </v-btn>
                    <v-btn color="primary" text type="submit" >
                        {{ form.index === null ? $t("Settings.AuthorizationTab.StoreButton") : $t("Settings.AuthorizationTab.UpdateButton") }}
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import SettingsRow from "@/components/settings/SettingsRow.vue"
import axios from "axios";
@Component({
    components: {SettingsRow}
})
export default class SettingsAuthorizationTab extends Mixins(BaseMixin) {
    private form = {
        bool: false,
        error: false,
        index: null,
        username: "",
        password: "",
        passwordShow: false
    }

    private rules = {
        required: (value: string) => value !== '' || 'required',
        unique: (value: string) => !this.existsUsername(value) || 'Name already exists',
    }

    get apiKey() {
        return this.$store.state.server.authorization.apiKey ?? ""
    }

    get availableUsers() {
        return this.$store.state.server.authorization.availableUsers ?? []
    }

    existsUsername(name: string) {
        return (this.availableUsers.findIndex((user: any, index: number) => user.username === name && index != this.form.index) >= 0)
    }

    copyKey() {
        navigator.clipboard.writeText(this.apiKey)
    }

    refreshKey() {
        this.$store.dispatch("server/authorization/refreshApiKey")
    }

    deleteUser(username: string) {
        this.$store.dispatch("server/authorization/deleteUser", username)
    }

    clearForm() {
        this.form.bool = false
        this.form.error = false
        this.form.index = null
        this.form.username = ""
        this.form.password = ""
        this.form.passwordShow = false
    }

    createUser() {
        this.clearForm()
        this.form.bool = true
    }

    saveUser() {
        if (this.form.index !== null) {
            window.console.log("update user", this.form.index)
        } else this.storeUser()
    }

    async storeUser() {
        const output = await this.$store.dispatch('server/authorization/storeUser', {
            username: this.form.username,
            password: this.form.password,
        })

        if (output) this.clearForm()
        else this.form.error = true
    }
}
</script>