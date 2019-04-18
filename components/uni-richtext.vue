<template>
	<view>
		<view class="mask" v-show="showMask" @click="hideInputPopup"></view>
		<view class="popup popup-insert-text" v-show="showInsertTextPopup">
			<view class="toolbar">
				<!-- #ifdef H5 -->
				<view class="iconfont">
					<colorPicker v-model="textareaDataColor" />
				</view>
				<!-- #endif -->
				<view class="iconfont icon-bold" @click="toolBarClick('bold')"></view>
				<view class="iconfont icon-italic" @click="toolBarClick('italic')"></view>
				<view class="iconfont icon-configure" @click="toolBarClick('fontsize')"></view>
				<view class="iconfont icon-underline" @click="toolBarClick('underline')"></view>
				<view class="iconfont icon-strike" @click="toolBarClick('strike')"></view>
				<view class="iconfont icon-alignleft" @click="toolBarClick('alignleft')"></view>
				<view class="iconfont icon-aligncenter" @click="toolBarClick('aligncenter')"></view>
				<view class="iconfont icon-alignright" @click="toolBarClick('alignright')"></view>
			</view>
			<view class="input-content">
				<view :style="textareaDataStyle">{{content}}</view>
				<textarea auto-height maxlength="-1" v-model="content"></textarea>
			</view>
			<view style="position: fixed;bottom: 0;width: 100%;">
				<view style="display: flex;box-shadow: 0 0 10px rgba(0,0,0,.1);">
					<view style="font-size: 14px;line-height: 40px;width: 50%;text-align: center;" @click="textareaDataSave('input')">提交</view>
					<view style="font-size: 14px;line-height: 40px;width: 50%;text-align: center;" @click="textareaDataCancel">取消</view>
				</view>
			</view>
		</view>
		<view class="popup popup-bottom" v-show="showPopup">
			<view style="display: flex;flex-wrap:wrap;">
				<view class="popup-bottom-button" @click="showInsertText">
					插文字
				</view>
				<view class="popup-bottom-button" @click="showEditText">
					改文字
				</view>
				<view class="popup-bottom-button" @tap="insertRichItem('image')">
					插图片
				</view>
				<view class="popup-bottom-button" @tap="showInsertText">
					插标题
				</view>
				<view class="popup-bottom-button" @click="deleteRichItem">
					删除
				</view>
				<view class="popup-bottom-button" @tap="postArticle">
					发布文章
				</view>
			</view>
		</view>
		<view class="content">
			<view class="placeholder-tip" @click="showInputPopup(-1)" v-if="richList.length==0">请输入内容</view>
			<view ref="richtext" v-for="(item,index) in richList" :key="index" :style="index==richListIndex?'background:#cce0f2;':''" @click="showInputPopup(index,item)">
				<view v-if="item.tagType=='p'" :style="item.style">{{item.value}}</view>
				<image v-if="item.tagType=='image'" :src="item.value"></image>
				<video v-if="item.tagType=='video'" :src="item.value" controls></video>
			</view>
		</view>
	</view>	
</template>

<script>
	export default {
		name: "uni-richtext",
		data: () => {
			return {
				showMask: false,
				showPopup: false,
				showInsertTextPopup: false,
				fontSizeList: ["14px", "16px", "20px", "28px", "35px"],
				richListIndex: 0,
				textareaDataType: "",
				content:'',
				textareaDataStyle: "padding:10px;font-size:14px;",
				textareaDataColor: "",
				tmpTag: "",
				title: '',
				userId: uni.getStorageSync('login_key').userId,
				imgs: []
			}
		},
		props: {
			richList: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		watch: {
			richList() {
				this.$emit('update:richList', this.richList)
			},
			textareaDataColor(newValue, oldValue) {
				this.textareaDataStyle = this.textareaDataStyle.replace(/^color:.*;$/, "")
				this.textareaDataStyle += "color:" + newValue + ";";
			}
		},
		methods: {
			insertRichItem(type) {
				if (type == "image") {
					var _this = this;
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album'],
						success: function(res) {
							console.log(JSON.stringify(res.tempFilePaths));
							uni.uploadFile({
								url: _this.apiServer + '/upload',
								filePath: res.tempFilePaths[0],
								name: 'file',
								success: uploadFileRes => {
									//图片上传成功，回显图片地址
									console.log(uploadFileRes.data);
									//将图片地址加入imgs数组
									_this.imgs.push(uploadFileRes.data);
									//将图片地址拼接HTML标签，加入文章内容
									_this.content += '<img src="' + uploadFileRes.data + '" width = "100%"/>';
								}
							});
						}
					});
				} else if (type == "video") {
					uni.chooseVideo({
						count: 1,
						sourceType: ['camera', 'album'],
						success: res => {
							uni.showLoading({
								mask: true,
							})
							uni.uploadFile({
								url: 'http://120.78.87.84:8080/conduit/file/uploadFile', //仅为示例，非真实的接口地址
								filePath: res.tempFilePath,
								name: 'video',
								success: (uploadFileRes) => {
									console.log(JSON.stringify(uploadFileRes))
									if (this.richListIndex == -1) {
										this.richList.push({
											"tagType": "video",
											"value": uploadFileRes.data,
											"style": ""
										});
									} else {
										this.richList.splice(this.richListIndex + 1, 0, {
											"tagType": "video",
											"value": uploadFileRes.data,
											"style": ""
										});
									}
								},
								fail: function(error) {
									console.log(JSON.stringify(error))
								},
								complete: () => {
									uni.hideLoading()
									this.hideInputPopup()
								}
							});
						},
					});
				}
			},
			postArticle: function() {
				var _this = this;
				uni.request({
					url: this.apiServer + '/article/add',
					method: 'POST',
					header: { 'content-type': 'application/x-www-form-urlencoded' },
					data: {
						uId: this.userId,
						title: this.title,
						content: '<div>' + this.content + '</div>'
					},
					success: res => {
						if (res.data.code === 0) {
							//获得发布文章成功返回的文章id
							var aId = res.data.data;
							console.log(aId);
							uni.showToast({
								title: '发布成功'
							});
							//将文章id和文章对应的图片地址数组传到后台，存入数据库
							uni.request({
								url: this.apiServer + '/img/add',
								method: 'POST',
								header: { 'content-type': 'application/x-www-form-urlencoded' },
								data: {
									aId: aId,
									imgs: JSON.stringify(_this.imgs)  //序列化imgs数组
								},
								success: res => {
									if (res.data.code === 0) {
										console.log('文章图片地址已写入数据库');
									}
								}
							});
							uni.switchTab({
								url: '../index/index'
							});
						}
					}
				});
			},
			deleteRichItem(index) {
				if (index != -1) {
					this.richList.splice(index, 1);
					this.hideInputPopup();
				}
			},
			textareaDataCancel() {
				this.content = "";
				this.textareaDataColor = "";
				this.textareaDataStyle = "padding:10px;font-size:14px";
				this.showInsertTextPopup = false;
			},
			textareaDataSave() { //保存文字输入
				if (this.textareaDataType == "input") //插入文字
				{
					if (this.richListIndex == -1) {
						this.richList.push({
							"tagType": "p",
							"value": this.content,
							"style": this.textareaDataStyle
						});
					} else {
						this.richList.splice(this.richListIndex + 1, 0, {
							"tagType": "p",
							"value": this.content,
							"style": this.textareaDataStyle
						});
					}
				} else if (this.textareaDataType == "edit") {
					this.richList[this.richListIndex] = {
						"tagType": "p",
						"value": this.content,
						"style": this.textareaDataStyle
					};
				}
				this.content = '';
				this.textareaDataColor = "";
				this.textareaDataStyle = "padding:10px;font-size:14px";
				this.showInsertTextPopup = false;
			},
			toolBarClick(type) { //文字编辑工具栏点击
				switch (type) {
					case "bold":
						if (this.textareaDataStyle.indexOf("font-weight:bold;") != -1) {
							this.textareaDataStyle = this.textareaDataStyle.replace(/font-weight:bold;/, "");
						} else {
							this.textareaDataStyle += "font-weight:bold;";
						}
						break;
					case "italic":
						if (this.textareaDataStyle.indexOf("font-style:italic;") != -1) {
							this.textareaDataStyle = this.textareaDataStyle.replace(/font-style:italic;/, "");
						} else {
							this.textareaDataStyle += "font-style:italic;";
						}
						break;
					case "fontsize":
						uni.showActionSheet({
							itemList: this.fontSizeList,
							success: (res) => {
								let fontsize = this.fontSizeList[res.tapIndex];
								this.textareaDataStyle = this.textareaDataStyle.replace(/^font-size:.*px;$/, "");
								this.textareaDataStyle += "font-size:" + fontsize + ";";
							}
						})
						break;
					case "alignleft":
						this.textareaDataStyle = this.textareaDataStyle.replace(/^text-align:.*;$/, "");
						this.textareaDataStyle += "text-align:left;";
						break;
					case "aligncenter":
						this.textareaDataStyle = this.textareaDataStyle.replace(/^text-align:.*;$/, "");
						this.textareaDataStyle += "text-align:center;";
						break;
					case "alignright":
						this.textareaDataStyle = this.textareaDataStyle.replace(/^text-align:.*;$/, "");
						this.textareaDataStyle += "text-align:right;";
						break;
					case "underline":
						if (this.textareaDataStyle.indexOf("text-decoration: underline;") != -1) {
							this.textareaDataStyle = this.textareaDataStyle.replace(/text-decoration: underline;/, "");
						} else {
							this.textareaDataStyle = this.textareaDataStyle.replace(/^text-decoration:.*;$/, "");
							this.textareaDataStyle += "text-decoration: underline;";
						}
						break;
					case "strike":
						if (this.textareaDataStyle.indexOf("text-decoration: line-through;") != -1) {
							this.textareaDataStyle = this.textareaDataStyle.replace(/text-decoration: line-through;/, "");
						} else {
							this.textareaDataStyle = this.textareaDataStyle.replace(/^text-decoration:.*;$/, "");
							this.textareaDataStyle += "text-decoration: line-through;";
						}
						break;
				}
			},
			showInsertText() { //显示插入文字编辑框
				this.textareaDataType = "input";
				this.hideInputPopup()
				this.showInsertTextPopup = true;
			},
			showEditText() {
				if (this.richList.length == 0) {
					this.showInsertText()
					return;
				}
				this.textareaDataType = "edit";
				this.content = this.tmpTag.value;
				this.textareaDataStyle = this.tmpTag.style;
				this.hideInputPopup()
				this.showInsertTextPopup = true;
			},
			hideInputPopup() {
				this.showMask = false;
				this.showPopup = false;
			},
			showInputPopup(index, tmpTag) {
				this.tmpTag = tmpTag;
				this.richListIndex = index;
				this.showMask = true;
				this.showPopup = true;
			}
		}
	}
</script>

<style>
	
	.content {
		padding: 20px;
	}
	.placeholder-tip {
		width: 100%;
		font-size: 30upx;
		color: #c7c7cd;
	}
	.mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .3);
	}
	.popup {
		position: fixed;
		z-index: 999;
		background-color: #ffffff;
		-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
	}
	.popup-insert-text {
		width: 100%;
		height: 100vh;
	}
	.popup-bottom {
		bottom: 0;
		width: 100%;
	}
	.popup-bottom-button {
		width: 20%;
		font-size: 14px;
		text-align: center;
		line-height: 40px;
		display: flex;
		justify-content: center;
	}
	.popup-bottom-button:last-child {
		color: red;
	}
	.input-content {
		width: 100%;
	}
	.input-content textarea {
		padding: 8px 12px 8px 12px;
		font-size: 14px;
		min-height: 250px;
		line-height: 1.5;
	}
	.preview {
		border-top: 1px solid #e0e0e0;
		width: 100%;
	}
	.toolbar {
		width: 100%;
		border: none;
		box-shadow: 0 0px 2px rgba(0, 0, 0, 0.157), 0 0px 2px rgba(0, 0, 0, 0.227);
	}
	.toolbar .iconfont {
		display: inline-block;
		cursor: pointer;
		height: 30px;
		width: 30px;
		margin: 6px 0 5px 0px;
		font-size: 16px;
		padding: 5px 6px 5px 4px;
		color: #757575;
		border-radius: 5px;
		text-align: center;
		background: none;
		border: none;
		outline: none;
		line-height: 2.2;
		vertical-align: middle;
	}
	.input-content {
		min-height: ;
	}
</style>
