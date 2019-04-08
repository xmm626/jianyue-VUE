<template>
	<view class="content">
		<view class="article-box">
			<view class="article" v-for="(article,index) in articles" :key="index">
				<text class="article-title" @tap="gotoDetail(article.id)">{{article.title}}</text>
				<!-- 大于三张 -->
				<view class="" v-if="article.imgs.length >=3">
					<view class="thumbnail-box">
						<view class="thumbnail-item" v-for="(item,index) in article.imgs" :key="index" >
							<image :src="item.imgUrl">
							</image>
						</view>
					</view>
				</view>
				<!-- 小于三张 -->
				<view class="" v-else-if="article.imgs.length <=3">
					<view class="text-img-box">
						<view class="left">
							<text>{{handleContent(article.content)}}</text>
						</view>
						<view class="right">
							<image :src="article.imgs[article.imgs.length - 1].imgUrl"></image>
						</view>
					</view>
				</view>
				<!-- 没有图片的显示方式 -->
				<view class="text-box" v-else>
					<text>{{article.title}}</text>
				</view>
				<!-- 文章作者等信息 -->
				<view class="article-info">
					<image :src="article.avatar" class="avatar small"></image>
					<text class="info-text">{{article.nickname}}</text>
					<text class="info-text">{{ handleTime(article.createTime) }}</text>
				</view>
				<hr>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articles: []
			}
		},
		onLoad: function() {
			this.getArticles();
		},
		onShow: function() {},
		onPullDownRefresh: function() {
			this.getArticles();
		},
		methods: {
			getArticles: function() {
				var _this = this;
				uni.request({
					url: this.apiServer + '/article/list',
					method: 'GET',
					header: {
						'content-type': 'application/x-www.form-urlencoded'
					},
					success: res => {
						_this.articles = res.data.data;
					},
					complete: function() {
						uni.stopPullDownRefresh();
					}
				});
			},
			gotoDetail: function(aId) {
				uni.navigateTo({
					url: '../article_detail/article_detail?aId=' + aId
				});
			},
			handleTime: function(datetime) {
				let date = new Date(datetime);
				let Y = date.getFullYear() + '-';
				let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
				let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
				let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			},
			handleContent: function(msg) {
				let description = msg;
				description = description.replace(/(\n)/g, "");
				description = description.replace(/(\t)/g, "");
				description = description.replace(/(\r)/g, "");
				description = description.replace(/<\/?[^>]*>/g, "");
				description = description.replace(/\s*/g, "");
				return description;
			}
		}
	}
</script>

<style>
	.content {
		text-align: center;
		
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.add-title {
		/* float: right; */
		width: 15%;
		position: absolute;
		right: 0px;
		bottom: 0px;
	}


	hr{
		
	}
	.article{
		display: flex;
		flex-direction: column;
		width: 100%;
		
	}
	.article-title{
		font-weight:bold;
		margin-right: 85%;
	}
	.text-img-box{
		display: flex;
		flex-direction: row;
	}
	.thumbnail-box{
		display: flex;
		flex-direction: row;
	}
	.thumbnail-item image{
		width: 220upx;
		height: 220upx;
		margin-left: 25upx;
	}
	.left{
		flex: 1 1 60%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
	}
	.right{
		flex: 1 1 40%;
		width: 100%;
		height: 100%;
	}
	.right image{
		width: 90%;
		height: 200upx;
	}
	.article-info{
		color: #E9E9E9;
		width: 100%;
		margin-left: 10upx;

	}
	.avatar{
		width: 75upx;
		height: 75upx;
		border-radius: 50%;
		
	}


	

</style>
