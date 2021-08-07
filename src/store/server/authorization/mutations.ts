import { getDefaultState } from './index'
import {MutationTree} from "vuex";
import {ServerAuthorizationState, ServerAuthorizationStateUser} from "@/store/server/authorization/types"
import Vue from "vue";

export const mutations: MutationTree<ServerAuthorizationState> = {
	reset(state) {
		Object.assign(state, getDefaultState())
	},

	updateApiKey(state, apiKey: string) {
		Vue.set(state, "apiKey", apiKey)
	},

	initAvailableUsers(state, users: ServerAuthorizationStateUser[]) {
		Vue.set(state, "availableUsers", users)
	},

	addUser(state, payload: { username: string, created: Date }) {
		state.availableUsers.push({
			username: payload.username,
			created: payload.created.getTime()
		})
	},

	deleteUser(state, username: string) {
		const index = state.availableUsers.findIndex((user: ServerAuthorizationStateUser) => user.username === username)
		if (index !== -1) state.availableUsers.splice(index, 1)
	}
}
