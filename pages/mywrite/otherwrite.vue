<template>
			<view class="demo-content">
				<view class="content" v-if="cateCurrentIndex === 0">
					<view class="list">
						<p>写过的文章</p>
						<hr>
						<view class="list-item" v-for="(article, index) in articles" :key="index">
							<text @tap="gotoDetail(article.id)">{{ article.title }}</text>
						</view>
					</view>
				</view>
			</view>
</template>

<script >
var loginRes, _self;
export default {
	data() {
		return {
			userId: 0,
			cateCurrentIndex: 0,
			articles: [],
			follows: [],
			nickname: '',
			avatar: ''
		};
	},
	onLoad: function(option) {
		console.log(option.uId);
		this.userId=option.uId
	},
	onShow: function() {
		var _this = this;
			uni.request({
				url: this.apiServer + '/article/user',
				method: 'GET',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					userId: this.userId
				},
				success: res => {
					_this.articles = res.data.data;
				}
			});
		
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
	.avatar{
			border-radius: 50%;
			
	}
</style>
