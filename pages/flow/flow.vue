<template>
	<view class="list">
		<view class="list-item" v-for="(follow, index) in follows" :key="index">
			<image :src="follow.avatar" class="avatar small"></image>
			<text style="margin-left: 20px;" @tap="gotoDetail(follow.toUId)">{{ follow.nickname }}</text>
		</view>
	</view>
</template>

<script>
	
	var loginRes, _self;
	export default {
		data() {
			return {
				storageData: {
					userId: 0,
					login: false
				},
				articles: [],
				follows: [],
				nickname: '',
				avatar: ''
			};
		},
		onLoad: function() {},
		onShow: function() {
			var _this = this;
			const loginKey = uni.getStorageSync('login_key');
			if (loginKey) {
				this.storageData = {
					login: loginKey.login,
					nickname: loginKey.nickname,
					avatar: loginKey.avatar,
					userId: loginKey.userId
				};
				uni.request({
					url: this.apiServer + '/follow/list',
					method: 'GET',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					data: {
						fromUId: this.storageData.userId
					},
					success: res => {
						_this.follows = res.data.data;
					}
				});
				
			} else {
				this.storageData = {
					login: false
				};
			}
		},
		methods: {
			gotoDetail: function(user) {
				uni.navigateTo({
					url: '../personindex/personindex?user=' + user
				});
			}
		}
	};
</script>

<style>
.avatar{
		border-radius: 50%;	
}
</style>
