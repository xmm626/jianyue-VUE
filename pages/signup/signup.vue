<template>
	<view class="container">
		<view class="sign-box">
			<input class="uni-input left" type="number" placeholder="输入手机号" v-model="mobile" required="required" />
	<button @tap="getVerifyCode" class="green-btn small-btn right" :disabled="!show">
         <span class="small-btn right" v-show="show">获取验证码</span>
         <span class="small-btn right" v-show="!show">{{count}}s后再获取</span>
    </button>
<!-- 	<button class="green-btn small-btn right" v-show="show" >获取验证码</button>
	<button class="green-btn small-btn right" v-show="!show" @tap="getVerifyCode">{{count}}获取验证码</button> -->
		</view>
		<hr>
		<input class="uni-input" type="number" placeholder="输入验证码" v-model="verifyCode" required="required" />
		<button @tap="checkCode" class="green-btn">下一步</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mobile: '',
			verifyCode: '',
			show:true,
			count: '',
			timer: null
		};
	},
	onLoad() {},
	methods: {
		getVerifyCode: function() {
			var _this = this;
			const TIME_COUNT = 20;
			uni.request({
				url: this.apiServer + '/user/verify',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					mobile: _this.mobile
				},
				success: res => {
					if (res.data.code === 0) {
						uni.showToast({
							title: '验证码已发送'
						});
						_this.disabled = true;
						console.log(_this.disabled);
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg
						});
					}
					if (!this.timer) {
					  this.count = TIME_COUNT;
					  this.show = false;
					  this.timer = setInterval(() => {
					    if (this.count > 0 && this.count <= TIME_COUNT) {
					      this.count--;
					    } else {
					      this.show = true;
					      clearInterval(this.timer);
					      this.timer = null;
					    }
					  }, 1000)
					}
				}
			});
		},
		checkCode: function() {
			var _this = this;
			console.log(_this.verifyCode);
			uni.request({
				url: this.apiServer + '/user/check',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					mobile: _this.mobile,
					verifyCode: _this.verifyCode
				},
				success: res => {
					console.log(res.data);
					if (res.data.code === 0) {
						uni.navigateTo({
							url: '../password/password?mobile=' + _this.mobile
						});
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg
						});
					}
				}
			});
		}
	}
};
</script>

<style>
.sign-box {
	display: flex;
	align-items: center;
}
.left {
	flex: 1 1 70%;
}
.uni-input{
	height: 50px;
	margin-top: 20px;
}
.small-btn {
	width: 110px;
	height: 40px;
	font-size: 13.5px;
}
.small-btn1 {
	width: 110px;
	height: 40px;
	font-size: 13.5px;
}
</style>
