const app = {
	state: {
		skipPage: 1,
		isSkip: false,
	},
	mutations: {
		SET_SKIPPAGE: (state, skipPage) => {
			state.skipPage = skipPage
		},
		SET_ISFALSE: (state, isSkip) => {
			state.isSkip = isSkip
		},
	},
	actions: {
		setSkipPage({ commit }, skipPage) {
			commit('SET_SKIPPAGE', skipPage)
		},
		setIsSkip({ commit }, isSkip) {
			commit('SET_ISFALSE', isSkip)
		},
	}
}

export default app