<template>
	<view class="container">
		<!-- 顶部头像和昵称区域，纵向排列 -->
		<view class="top">
			<view class="avatar-box">
				<image :src="avatar" mode="scaleToFill" class="avatar"></image>
			</view>
			<view class="info-box">
				<text >{{ nickname }}</text>
			</view>
            
		</view>

		<!-- 中间文章数量、好友数量、消息数量等统计区域，横向排列 -->
		<view class="center" >
			
			<view class="info" @tap="gotoDetail(id)">
				<text class="title">{{ articleCount }}</text>
				<image src="../../static/文章.png" class="avatar1 small"></image>
				<text class="tubiao">他的文章</text>
			</view>
			
			
			<view class="info">
				<text class="title">{{ followCount }}</text>
				<image src="../../static/书架.png" class="avatar1 small"></image>
				<text class="tubiao">他的书架</text>
			</view>
			
			<view class="info">
				<text class="title">{{ messageCount }}</text>
				<image src="../../static/收 藏.png" class="avatar1 small"></image>
				<text class="tubiao">他的收藏</text>
			</view>
			<navigator url="../write/index">
			<!-- <view class="info">
				<text class="title">{{ integral }}</text>
				<image src="../../static/奖励任务.png" class="avatar1 small"></image>
				<text class="tubiao">奖励任务</text>
			</view> -->
			</navigator>
		</view>
	</view>
</template>

<script>
var loginRes, _self;
export default {
	data() {
		return {
			avatar: '',
			nickname: '',
			articleCount: '',
			followCount: '',
			messageCount: '',
			integral: '',
			id:0
		};
	},
	onLoad: function(option) {
		console.log(option.user);
		this.id=option.user
	},
	onShow: function() {
		var _this = this;
		uni.request({
			url: this.apiServer+'/user/' + this.id,
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
	methods: {
		gotoDetail: function(uId) {
				uni.navigateTo({
					url: '../mywrite/otherwrite?uId=' + uId
				});
			},
			gotolike: function(fuId) {
					uni.navigateTo({
						url: '../likewrite/otherlikewrite?fuId=' + fuId
					});
			}
	}
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
