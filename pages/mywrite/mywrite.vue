<template>
			<view class="demo-content">
				<view class="content" v-if="cateCurrentIndex === 0">
					<view class="list">
						<p>写过的文章</p>
						<hr>
						<view class="list-item" v-for="(article, index) in articles" :key="index">
						<uni-swipe-action  @tap="gotoas(article.id)" :options="options">
							<text @tap="gotoDetail(article.id)">{{ article.title }}</text>
						</uni-swipe-action>
						</view>
					</view>
				</view>
			</view>
</template>

<script >
var loginRes, _self;
import uniSwipeAction from "@/components/uni-swipe-action.vue";
export default {
	components: {
        uniSwipeAction
    },
	data() {
		return {
			storageData: {
				userId: 0,
				login: false
			},
			cateCurrentIndex: 0,
			articles: [],
			follows: [],
			nickname: '',
			avatar: '',
			options: [{
                text: '删除',
                style: {
                    backgroundColor: '#007aff'
                }
            }]
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
				url: this.apiServer + '/article/user',
				method: 'GET',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					userId: this.storageData.userId
				},
				success: res => {
					_this.articles = res.data.data;
					/* _this.articles.id=res.data.data.id; */
				}
			});
			
			
		} else {
			this.storageData = {
				login: false
			};
		}
	},
	methods: {
		gotoas: function(id) {
			uni.request({
				url: this.apiServer + '/article/deleted',
				method: 'POST',
				header: { 'content-typie': 'application/x-www-form-urlencoded' },
				data: {
					uId: this.storageData.userId,
					id:id
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '删除成功'
						});
					}
				}
			});
		},
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
