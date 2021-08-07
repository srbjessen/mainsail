import {ActionTree} from "vuex";
import {ServerAuthorizationState} from "@/store/server/authorization/types";
import {RootState} from "@/store/types";
import axios, {AxiosError, AxiosResponse} from "axios";
import Vue from "vue";

export const actions: ActionTree<ServerAuthorizationState, RootState> = {
	reset({ commit }) {
		commit('reset')
	},

	async init({ commit, rootGetters, getters }) {
		await Vue.prototype.$httpClient.get("/access/api_key")
			.then((response: AxiosResponse) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})

		await Vue.prototype.$httpClient.get("/access/users/list")
			.then((response: AxiosResponse) => {
				commit("initAvailableUsers", response.data?.result?.users ?? [])
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("initAvailableUsers", [])
			})
	},

	refreshApiKey({ commit, rootGetters }) {
		Vue.prototype.$httpClient.post("/access/api_key")
			.then((response: AxiosResponse) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})
	},

	async storeUser({ rootGetters }, payload) {
		return await Vue.prototype.$httpClient.post("/access/user", {
				username: payload.username,
				password: payload.password,
			})
			.then((response: AxiosResponse) => {
				return (response.status === 200)
			})
			.catch((error: AxiosError) => { window.console.error(error) })
	},

	async deleteUser({ rootGetters }, username) {
		return Vue.prototype.$httpClient.delete("/access/user", {
                params: {
                    username
                }
            })
            .then((response: AxiosResponse) => {
				return (response.status === 200)
			})
            .catch((error: AxiosError) => { window.console.error(error) })
	},

	notifyUserCreated({ commit }, payload) {
		commit('addUser', {
			username: payload.username,
			created: new Date()
		})
	},

	notifyUserDeleted({ commit }, payload) {
		commit('deleteUser', payload.username)
	}
}