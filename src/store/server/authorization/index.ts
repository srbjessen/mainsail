import {ServerAuthorizationState} from "@/store/server/authorization/types"
import { Module } from "vuex"
import { actions } from '@/store/server/authorization/actions'
import { mutations } from '@/store/server/authorization/mutations'
import { getters } from '@/store/server/authorization/getters'

export const getDefaultState = (): ServerAuthorizationState => {
	return {
		apiKey: "",
		availableUsers: [],
	}
}

// initial state
const state = getDefaultState()

export const authorization: Module<ServerAuthorizationState, any> = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
