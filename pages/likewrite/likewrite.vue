<template>
	<view class="list">
		<view class="list-item" v-for="(like, index) in likes" :key="index">
			<image :src="like.avatar" class="avatar small"></image>
			<text class="jo">作者:{{ like.nickname }}</text>
			<text class="jojo" @tap="gotoDetail(like.tolikeAId)">文章:{{ like.title }}</text>
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
				likes: [],
				nickname: '',
				avatar: '',
				title:''
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
					userId: loginKey.userId,
					title: loginKey.title
				};
				uni.request({
					url: this.apiServer + '/like/list',
					method: 'GET',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					data: {
						fromlikeUId: this.storageData.userId
					},
					success: res => {
						_this.likes = res.data.data;
					}
				});
				
			} else {
				this.storageData = {
					login: false
				};
			}
		},
		methods: {
			gotoDetail: function(aId) {
				uni.navigateTo({
					url: '../article_detail/article_detail?aId=' + aId + '&userId=' + this.userId
				});
			}
		}
	};
</script>

<style>
	.jo{
		margin-left: 10px;
		margin-top: -40px;
	}
	.jojo{
		margin-left: -80px;
		margin-top: 20px;
		color: green;
	}
	.avatar{
			border-radius: 50%;
			
	}
</style>
