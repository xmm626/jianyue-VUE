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

			</view>
            <navigator url="../flow/flow" v-if="storageData.login"><p class="set">关注</p></navigator> 
		</view>

		<!-- 中间文章数量、好友数量、消息数量等统计区域，横向排列 -->
		<view class="center" v-if="storageData.login">
			<navigator url="../mywrite/mywrite">
			<view class="info">
				<text class="title">{{ articleCount }}</text>
				<image src="../../static/文章.png" class="avatar1 small"></image>
				<text class="tubiao">我的文章</text>
			</view>
			</navigator>
			
			<view class="info">
				<text class="title">{{ followCount }}</text>
				<image src="../../static/书架.png" class="avatar1 small"></image>
				<text class="tubiao">我的书架</text>
			</view>
			
			<navigator url="../likewrite/likewrite">
			<view class="info">
				<text class="title">{{ messageCount }}</text>
				<image src="../../static/收 藏.png" class="avatar1 small"></image>
				<text class="tubiao">喜欢收藏</text>
			</view>
			</navigator>
			
			<view class="info">
				<text class="title">{{ integral }}</text>
				<image src="../../static/奖励任务.png" class="avatar1 small"></image>
				<text class="tubiao">奖励任务</text>
			</view>
			
		</view>

		<view class="content" v-if="storageData.login">
			<view class="list">
				<view class="biaoti">简阅会员</view>
			</view>
			<hr>
			<view class="list">
				<view class="biaoti">简阅活动</view>
			</view>
			<hr>
			<view class="list">
				<view class="biaoti">简东西</view>
			</view>
			<hr>
			<view class="list">
				<view class="biaoti">我的钱包</view>
			</view>
			<hr>
			<view class="list">
				<view class="biaoti">我的文集/专题</view>
			</view>
			<hr>
			<view class="list">
				<view class="biaoti">浏览历史</view>
			</view>
			<hr>
			<navigator url="../setting/setting" v-if="storageData.login">
			<view class="list">
				<view class="biaoti">设置</view>
			</view>
			</navigator>
			<hr>
			<view class="list">
				<view class="biaoti">帮助与反馈</view>
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
			articleCount: '',
			followCount: '',
			messageCount: '',
			integral: ''
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
			url: this.apiServer+'/user/' + uni.getStorageSync('login_key').userId,
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
	height: 70px;
	margin-top: 5px;
}
.avatar-box {
	flex: 1 1 30%;
	margin-right: 100%;
}
.info-box {
	flex: 1 1 70%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -60px;
	margin-left: -120px;
}

.setting-txt {
	color: #00b26a;
	margin-left: 15px;
}
.center {
	display: flex;
	justify-content: center;
}
.set{
	margin-left: 25%;
	font-size: 13px;

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
.avatar1{
		width: 65upx;
		height: 65upx;
		margin-left: 25px;
		
	}

.avatar{
		border-radius: 50%;	
}
.list{
	margin-top: 5px;
	margin-bottom: 5px;
}
.biaoti{
	font-size: 20px;
	color: green;
}
</style>