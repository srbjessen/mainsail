import {ActionTree} from "vuex";
import {ServerAuthorizationState} from "@/store/server/authorization/types";
import {RootState} from "@/store/types";
import axios from "axios";

export const actions: ActionTree<ServerAuthorizationState, RootState> = {
	reset({ commit }) {
		commit('reset')
	},

	async init({ commit, rootGetters, getters }) {
		const apiUrl = rootGetters['socket/getUrl']


		await axios.get(apiUrl+"/access/api_key")
			.then((response) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})

		await axios.get(apiUrl+"/access/users/list")
			.then((response) => {
				commit("initAvailableUsers", response.data?.result?.users ?? [])
			})
			.catch((error) => {
				window.console.error(error)
				commit("initAvailableUsers", [])
			})
	},

	refreshApiKey({ commit, rootGetters }) {
		const apiUrl = rootGetters['socket/getUrl']

		axios.post(apiUrl+"/access/api_key")
			.then((response) => {
				commit("updateApiKey", response.data?.result ?? "")
			})
			.catch((error) => {
				window.console.error(error)
				commit("updateApiKey", "")
			})
	},

	async storeUser({ rootGetters }, payload) {
		const apiUrl = rootGetters['socket/getUrl']

		return await axios.post(apiUrl+"/access/user", {
				username: payload.username,
				password: payload.password,
			})
			.then((response) => {
				return (response.status === 200)
			})
			.catch((error) => { window.console.error(error) })
	},

	async deleteUser({ rootGetters }, username) {
		const apiUrl = rootGetters['socket/getUrl']

		return axios.delete(apiUrl+"/access/user", {
                params: {
                    username
                }
            })
            .then((response) => {
				return (response.status === 200)
			})
            .catch((error) => { window.console.error(error) })
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