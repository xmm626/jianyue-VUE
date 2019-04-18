<template>
	<view style="flex: 1;">
	<view class="content">
		<view class="article-box">
			<view class="article" v-for="(article,index) in articles" :key="index">
				<text class="article-title" @tap="gotoDetail(article.id,article.userId)">{{article.title}}</text>
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
				<view class="" v-else-if="article.imgs.length <=3 && article.imgs.length >=1">
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
					<!-- <image src="../../static/钻石.png" class="avatar1 small"></image>
					<text class="info-text2">1.254</text> -->
					<!-- <image :src="article.avatar" class="avatar small"></image> -->
					<text class="info-text1">{{article.nickname}} </text>
					<text class="info-text1">{{article.comments}}评论</text>
					<text class="info-text">{{ handleTime(article.createTime) }}</text>
				</view>
				<hr>
			</view>
		</view>
		<navigator url="../write/index">
				<button class="jh">+</button>
		</navigator>
	</view>
	<uni-load-more  :loadingType="loadingType" :contentText="contentText" ></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';
		
		 
			var	page = 0,
				timer = null;
		// 定义全局参数,控制数据加载

	export default {
		components: {//2注册组件
        uniLoadMore
    },
		data() {
			return {
				articles: [],
				comments: [],
				loadingText: '加载中...',
				loadingType: 0,//定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
        contentText: {
            contentdown:'上拉显示更多',
            contentrefresh: '正在加载...',
            contentnomore: '没有更多数据了'
        }
			}
			/* userId: uni.getStorageSync('login_key').userId */
		},
		onLoad: function() {
			this.getArticles();
		},
		onShow: function() {
			this.getArticles();
		},
		onPullDownRefresh: function() {
			this.getArticles();
		},
		onReachBottom: function() {
			var _this = this;
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
		if (timer != null) {
		    clearTimeout(timer);
		}
		timer = setTimeout(function() {
		    _this.getmorenews();
		}, 50);
				
				// 正常应为:
				// _self.getmorenews();
    },
		methods: {
			/* getArticles: function() {
				var _this = this;
				uni.request({
					url: this.apiServer + '/article/list1',
					method: 'GET',
					data:{
						page:1
					},
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
			}, */
			getArticles: function() {
					var _this = this;
					uni.request({
						url: this.apiServer + '/article/list1',
						method: 'GET',
						header: {
							'content-type': 'application/x-www.form-urlencoded'
						},
						success: res => {
							_this.articles = res.data.data;
							page++;
						},
						complete: function() {
							uni.stopPullDownRefresh();
						}
					});
				},
				getmorenews: function() {
							var _this = this;
			    if (_this.loadingType !== 0) {//loadingType!=0;直接返回
			        return false;
			    }
			    _this.loadingType = 1;
			    uni.showNavigationBarLoading();//显示加载动画
			    uni.request({
			        url: this.apiServer + '/article/list1',
			        method: 'GET',
									header: {
										'content-type': 'application/x-www-form-urlencoded'
									},
									data: {
										pageNo: page,
										pageSize: 4,
									},
			        success: function(res) {
			            console.log(JSON.stringify(res));
			            if (res.data.data == '') {//没有数据
			                _this.loadingType = 2;
			                uni.hideNavigationBarLoading();//关闭加载动画
			                return;
			            }
			            page++;//每触底一次 page +1
			            _this.articles = _this.articles.concat(res.data.data);
			            _this.loadingType = 0;//将loadingType归0重置
			            uni.hideNavigationBarLoading();//关闭加载动画
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
	.avatar1{
		width: 65upx;
		height: 65upx;
		border-radius: 50%;
		margin-right: 10px;
		
	}
	.info-text1{
		margin-right: 10px;
	}
	.info-text2{
		margin-right: 10px;
		color: red;
	}
	.jh{
		background: linear-gradient(bottom,orange,#fff); 
		background: -ms-linear-gradient(bottom,blue,#fff); 
		background: -webkit-linear-gradient(bottom,blue,#fff); 
		background: -o-linear-gradient(bottom,blue,#fff); 
		background: -moz-linear-gradient(bottom,blue,#fff);
	
		width:45px; 
		height:45px; 
		border-radius:50%; 
		text-align: center; 
		vertical-align: middle;
		right: 5%; 
		position: fixed;
		top: 80%;
		
	 
	}
	.circle-btn {
		position: fixed;
		bottom: 10%;
		right: 5%;
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background-color: #de533a;
		background: linear-gradient(40deg, #ffd86f, #fc6262);
		/* background-image: url(../../static/Pencil32.png); */
		box-shadow: 2px 5px 10px #aaa;
		cursor: pointer;
		border: none;
		outline: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	

</style>
