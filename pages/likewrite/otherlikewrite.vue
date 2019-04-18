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
				articles: [],
				likes: [],
				nickname: '',
				avatar: '',
				title:'',
				uId:0
			};
		},
		onLoad: function(option) {
			console.log(option.fuId);
			this.uId=option.fuId
		},
		onShow: function() {
			var _this = this;

				uni.request({
					url: this.apiServer + '/like/list',
					method: 'GET',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					data: {
						fromlikeUId: this.uId
					},
					success: res => {
						_this.likes = res.data.data;
					}
				});
		},
		methods: {
			gotoDetail: function(aId) {
				uni.navigateTo({
					url: '../article_detail/article_detail?aId=' + aId + '&userId=' + this.uId
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
