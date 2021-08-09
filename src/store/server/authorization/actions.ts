import {ActionTree} from "vuex";
import {ServerAuthorizationState} from "@/store/server/authorization/types";
import {RootState} from "@/store/types";
import {AxiosError, AxiosResponse} from "axios";
import Vue from "vue";

export const actions: ActionTree<ServerAuthorizationState, RootState> = {
	reset({ commit }) {
		commit('reset')
	},

	async init({ commit, rootGetters, getters }) {
		await Vue.$httpClient.get("/access/api_key", {
				headers: { 'Content-Type': 'application/json' }
			})
			.then((response: AxiosResponse) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})

		await Vue.$httpClient.get("/access/users/list", {
				headers: { 'Content-Type': 'application/json' }
			})
			.then((response: AxiosResponse) => {
				commit("initAvailableUsers", response.data?.result?.users ?? [])
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("initAvailableUsers", [])
			})
	},

	refreshApiKey({ commit, rootGetters }) {
		Vue.$httpClient.post("/access/api_key", {
				headers: { 'Content-Type': 'application/json' }
			})
			.then((response: AxiosResponse) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error: AxiosError) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})
	},

	async storeUser({ rootGetters }, payload) {
		return await Vue.$httpClient.post("/access/user", {
				username: payload.username,
				password: payload.password,
			}, {
				headers: { 'Content-Type': 'application/json' }
			})
			.then((response: AxiosResponse) => {
				return (response.status === 200)
			})
			.catch((error: AxiosError) => { window.console.error(error) })
	},

	async deleteUser({ rootGetters }, username) {
		return Vue.$httpClient.delete("/access/user", {
				headers: { 'Content-Type': 'application/json' },
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