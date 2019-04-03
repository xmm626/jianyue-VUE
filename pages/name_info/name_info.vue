<template>
		<view class="uni-flex uni-column container">
		<input
			class="uni-input"
			type="text"
			value=""
			v-model="renickname"
			required="required"
		/>
		<button class="green-btn" @tap="changeNickname(renickname)">确认修改</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			renickname:'',
		};
	},
	onLoad() {
	},
	methods: {
		changeNickname: function(renickname) {
			var _this = this;
			uni.request({
				url: 'http://****:8080/api/user/nickname?id='+uni.getStorageSync('login_key').userId,
				method: 'put',
				data:renickname,
				header: { 'content-type': 'application/json' },
				success: res => {
					uni.navigateBack();
				}
			});
		}
	}
};
</script>

<style>
input {
	height: 50px;
	border-bottom: 1px solid #eee;
	margin-bottom: 5px;
}
</style>

