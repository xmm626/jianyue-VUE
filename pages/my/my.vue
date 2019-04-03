<template>
	<view class="container">
		<!-- 顶部头像和昵称区域，纵向排列 -->
		<view class="top">
			<view class="avatar-box">
				<image src="../../static/default.png" mode="scaleToFill" class="avatar" v-if="!storageData.login"></image>
				<image :src="avatar" mode="scaleToFill" class="avatar" v-if="storageData.login"></image>
			</view>
			<view class="info-box">
				<navigator url="../signin/signin" v-if="!storageData.login">点击登录</navigator>
				<text v-if="storageData.login">{{ nickname }}</text>
				<navigator url="../setting/setting" v-if="storageData.login"><text class="setting-txt">个人设置</text></navigator>
			</view>
		</view>

		<!-- 中间文章数量、好友数量、消息数量等统计区域，横向排列 -->
		<view class="center" v-if="storageData.login">
			<view class="info">
				<text class="title">{{ articleCount }}</text>
				<text>文章</text>
			</view>
			<view class="info">
				<text class="title">{{ followCount }}</text>
				<text>关注</text>
			</view>
			<view class="info">
				<text class="title">{{ messageCount }}</text>
				<text>消息</text>
			</view>
			<view class="info">
				<text class="title">{{ integral }}</text>
				<text>积分</text>
			</view>
		</view>

		<view class="content" v-if="storageData.login">
			<view class="list">
				<view class="list-item" v-for="(article, index) in articles" :key="index">
					<text>{{ article.title }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
var loginRes, _self;
export default {
	data() {
		return {
			storageData: {},
			avatar: '',
			nickname: '',
			articleCount: 10,
			followCount: 5,
			messageCount: 67,
			integral: 100,
			articles: [
				{
					id: 1,
					title: '第一篇文章'
				},
				{
					id: 2,
					title: '第二篇文章'
				},
				{
					id: 3,
					title: '第三篇文章'
				},
				{
					id: 4,
					title: '第四篇文章'
				}
			]
		};
	},
	onLoad: function() {},
	onShow: function() {
		var _this = this;
		const loginKey = uni.getStorageSync('login_key');
		if (loginKey) {
			// console.log(loginKey);
			this.storageData = {
				login: loginKey.login,
				nickname: loginKey.nickname,
				avatar: loginKey.avatar
			};
		} else {
			this.storageData = {
				login: false
			};
		}
		uni.request({
			url: 'http://****:8080/api/user/' + uni.getStorageSync('login_key').userId,
			method: 'GET',
			header: { 'content-type': 'application/json' },
			success: res => {
				if (res.data.code === 0) {
					console.log(res.data.data.avatar+'————————————');
					_this.avatar = res.data.data.avatar;
					_this.nickname = res.data.data.nickname;
				}
			}
		});
	},
	methods: {}
};
</script>

<style scoped>
.top {
	display: flex;
	flex-direction: column;
	text-align: center;
	height: 100px;
	margin-top: 5px;
}
.avatar-box {
	flex: 1 1 30%;
}
.info-box {
	flex: 1 1 70%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.setting-txt {
	color: #00b26a;
	margin-left: 15px;
}
.center {
	display: flex;
	justify-content: center;
}
.info {
	flex: 1 1 25%;
	display: flex;
	flex-direction: column;
	text-align: center;
	border-right: 1px solid #eee;
}
.title {
	font-size: 14pt;
}
.content {
	margin-top: 20px;
}
</style>