exports.install = function(Vue, options) {
	Vue.prototype.judge_addproduct = function(arr) {
		for(let i = 0; i < arr.length; i++) {
			if(Number(arr[i])) {				
			} else {
				this.$message.error('您的输入有误，请核对')
				return false
			}			
		}
		return true
	}
	Vue.prototype.judge_inbound = function(arr) {
		if(Number.isInteger(Number(String(arr).replace(/[/]/g, '')))) {
			
		}else {
			this.$message.error('您的输入有误,请重新输入')
			return false
		}
		return true
	}
	Vue.prototype.judge_subject_arrs = function(arr) {
		let temp = 0
		arr.some((data) => {
			if (data.includes('-')) {
				temp = 1
				return true
			}
		})
		if (temp) {
			this.$message.info("属性不能包含 '-' 符号")
			return false
		}
		return true
	}
	Vue.prototype.setActiveItem = function() {
		this.$refs.elcarousel.setActiveItem(0)
		this.$refs.elcarousel2.setActiveItem(0)
	}
	Vue.prototype.setActiveItemSingle = function() {
		this.$refs.elcarousel.setActiveItem(0)
	}
}