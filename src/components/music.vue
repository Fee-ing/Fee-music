<template>
  	<div class="music-wrapper" @click="hideVoice">  
  		<div class="music-heading centerVertical">
  			<div class="music-search-wrapper flexbox">
  				<input type="text" class="search-input flex1" placeholder="想听什么就搜一搜吧" v-model="searchData.keywords">
  				<a class="option-button search-btn" @click.stop="search">搜索</a>
  				
  			</div>
  		</div>
    	<div class="music-content">
			<div class="music-container music-container-result" ref="musicContainer" :style="{ transform: 'rotateY('+ playSetting.rotateDeg +'deg)' }">
				<div class="song-wrapper flexbox">
					<div class="song-tabbar flexbox">
						<a class="tabbar-item flex1" :class="{ 'active' : songType === '1' }" @click="changeSongType('1')">搜索结果</a>
						<a class="tabbar-item flex1" :class="{ 'active' : songType === '2' }" @click="changeSongType('2')">播放历史</a>
						<a class="tabbar-item flex1" :class="{ 'active' : songType === '3' }" @click="changeSongType('3')">我想听的</a>
					</div>
					<div class="result-wrapper flex1 flexbox">
	  					<div class="result-tip" v-show="songType === '1'">共{{searchData.searchTotalNum}}个搜索结果</div>
	  					<div class="result-tip" v-show="songType === '2'">共{{historySongList.length}}条历史记录（最多记录100条）</div>
              <div class="result-tip" v-show="songType === '3'">共{{favorSongList.length}}首现在想听的（最多记录100首）</div>
	  					<div class="result-list result-list-header">
                <div class="option">{{ songType === '3' ? '移除' : '添加' }}</div>
	  						<div class="songname">歌曲</div>
	  						<div class="singer">歌手</div>
	  						<div class="album">专辑</div>
	  						<div class="duration">时长</div>
	  					</div>
	  					<div class="result-list-wrapper flex1">
	  						<div class="result-list" v-for="(item, index) in songList" :class="{'active': song.songid === item.songid}" @click.stop="getSong(item, index)">
		  						<a class="option iconfont icon-jia" title="添加到我现在想听的" v-if="songType !== '3'" @click.stop="addFavor(item)"></a>
                  <a class="option iconfont icon-sub"  title="从我想听的中移除" v-else  @click.stop="removeFavor(index)"></a>
                  <div class="songname" v-html="item.songname"></div>
		  						<div class="singer" v-html="getSinger(item.singer)"></div>
		  						<div class="album" v-html="item.albumname"></div>
		  						<div class="duration">{{getDuration(item.interval)}}</div>
		  					</div>
		  					<a class="more-song" v-if="songType === '1' && searchData.searchTotalpage > 1 && searchData.searchPage < searchData.searchTotalpage" @click.stop="getMoreSongs">获取更多</a>
	  					</div>
	  				</div>
				</div>

				<div class="lyric-wrapper">
					<div class="lyric-content" :style="{ transform: 'translateY('+ (song.translatePosition - song.transIndex*35) +'px)' }">
						<template v-for="(item, key) in song.lyric">
							<div class="lyric-list centerVertical" :class=" +key === +song.currentLyric ? 'active' : '' " v-if="item">{{item}}</div>
						</template>
					</div>
				</div>
			</div>
			
    	</div>
    	<div class="music-footer">
    		<audio class="audio" autoplay="false" ref="audio" :src="song.songSrc">
			  	<source :src="song.songSrc">
			</audio>
    		<div class="music-footer-content verticalbox">
    			<div class="song-img img" :style="{ backgroundImage: 'url(' + song.imgSrc + ')'}" @click="rotate"></div>
    			<div class="play-wrapper verticalbox">
    				<a class="iconfont icon-shangyishou" @click="preSong" title="上一首"></a>
    				<a class="iconfont icon-cplay1" ref="playOrPause" @click="playSong"></a>
    				<a class="iconfont icon-xiayishou" @click="nextSong" title="下一首"></a>
    			</div>
    			<div class="progress-wrapper flex1">
    				<div class="songinfo-wrapper"><span class="song-name" v-html="song.songname"></span>-<span class="singer" v-html="song.singer"></span></div>
					<div class="song-progress" ref="sProgress" @mousedown.stop="jumpProgress">
						<div class="current" :style="{ width: song.songProgress + '%'}">
							<span class="current-point" @mousedown.stop="getStartX"></span>
						</div>
					</div>
    				<div class="song-time">
    					<span class="now-time">{{getDuration(song.currentTime)}}</span>
    					<span class="total-time">{{getDuration(song.duration)}}</span>
    				</div>
    			</div>
    			<div class="option-wrapper verticalbox">
    				<a class="iconfont play-type" :class="{ 'icon-xunhuan' : playSetting.playType === '1', 'icon-danquxunhuan' : playSetting.playType === '2', 'icon-suiji' : playSetting.playType === '3' }" @click="changePlayType"></a>
    				<a class="iconfont icon-xiazai" title="下载" :href="song.songSrc" :download="song.songname"></a>
    				<a class="iconfont icon-shengyin" ref="voiceControl" title="音量" @click.stop="showVoice">
    					<div class="voice-progress-wrapper">
	    					<input type="range" class="voice-progress" ref="voiceRange" :style="{ backgroundSize: song.voiceProgress + '% 100%'}" v-model="song.voiceProgress" @change.stop="changeVoiceProgress" @click.stop="stopPro">	
	    				</div>
    				</a>
    				<span class="voice-num">{{song.voiceProgress}}</span>
    			</div>
    		</div>
    	</div>
  	</div>
</template>

<script>
import Func from '../assets/js/common.js'
import Base64 from '../assets/js/base64';

export default {
	data(){
	    return {
	    	searchData: {
		      	keywords: '',
		      	songList: [],
		      	searchPage: 1,
		      	searchTotalpage: 1,
		      	searchTotalNum: 0
	    	},
	    	songList: [],
	    	historySongList: [],
        	favorSongList: [],
	    	songIndex: null,
	    	songType: '2',
	    	song: {
	    		songname: '无歌曲信息',
	    		songid: '',
	    		singer: '无歌手信息',
	    		songSrc: '',
	    		imgSrc: '',
	    		duration: 0,
	    		songProgress: 0,
	    		voiceProgress: 50,
	    		lyric: {},
	    		currentTime: 0,
	    		currentLyric: '0',
	    		transIndex: 0,
	    		translatePosition: 300,
	    	},
	    	playSetting: {
	    		rotateDeg: 0,
	    		playType: '1',
	    		randomSongList: [],
	    		randomIndex: 0,
          		isPause: true
	    	}
	    }
	},
	mounted() {
		let that = this;

		Func.getStorage('Fee_historySongList') ? this.historySongList = JSON.parse(Func.getStorage('Fee_historySongList')) : this.historySongList = [];
		Func.getStorage('Fee_favorSongList') ? this.favorSongList = JSON.parse(Func.getStorage('Fee_favorSongList')) : this.favorSongList = [];
		this.songList = this.historySongList;
		if (this.historySongList.length > 0) {
			that.getSong(this.historySongList[0]);
		} else {
			that.playSetting.isPause = false;
		}

		that.$refs.audio.volume = that.song.voiceProgress/100;

	 	this.$refs.audio.addEventListener('timeupdate',function(){ 
	 		
	        let currentTime = parseInt(this.currentTime);
	           
	        if (currentTime !== that.song.currentTime) {		//避免在同一时段内多次更新数据

	        	if (that.song.lyric[currentTime]) {
	        		let transIndex = 0;
		        	for (let key in that.song.lyric) {
			        	if (that.song.lyric[key] && +key < currentTime) {
			        		transIndex++;
			        	}
			        }
		        	that.$set(that.song, 'transIndex', transIndex);			//确定歌词向上平移的距离

		        	that.$set(that.song, 'currentLyric', currentTime);		//确定展示哪一条歌词
		        }

		        that.$set(that.song, 'currentTime', currentTime);		//更新歌曲已播放的时长

		    }
	        
	    });
	    this.$refs.audio.addEventListener('pause',function(){  
	        that.$refs.playOrPause.className = 'iconfont icon-cplay1';
	    });
	    this.$refs.audio.addEventListener('play',function(){  
	        that.$refs.playOrPause.className = 'iconfont icon-bofang';
			if (that.playSetting.isPause) {
				this.pause();
				that.playSetting.isPause = false;
			}
	    });
	    this.$refs.audio.addEventListener('canplay',function(){  
	        this.play();
	    });
	    this.$refs.audio.addEventListener('ended',function(){
			if(that.playSetting.playType !== '2') {
				that.playSetting.randomIndex >= that.playSetting.randomSongList.length - 1 ? that.playSetting.randomIndex = 0 : that.playSetting.randomIndex += 1;
			}
	    	let index = that.playSetting.randomSongList[that.playSetting.randomIndex];
	    	let song  = that.songList[index];
	        that.getSong(song, index);
	    });
	    this.$refs.audio.addEventListener('error',function(){  
	    	if (that.song.songSrc) {
	    		Func.toast('获取歌曲失败');
	        	this.pause();
	    	}
	    });
	    this.$refs.audio.addEventListener('stalled',function(){  
	        Func.toast('请检查网络');
	        this.pause();
	    });
	    this.$refs.audio.addEventListener('waiting',function(){  
	    	Func.toast('加载中');
	        this.pause();
	    });

      document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
          that.search();
        }
      };
	},
	watch: {
	    'song.currentTime': 'updateSongProgress',
	    'songList': 'getRandomSongList'
	},
  	methods: {
  		stopPro(){},
  		changeSongType(type) {
  			if (type === '1') {
  				this.songList = this.searchData.songList;
  			} else if (type === '2') {
  				this.songList = this.historySongList;
  			} else if (type === '3') {
          this.songList = this.favorSongList;
  			}
  			this.songType = type;
  		},
  		initResult() {
  			this.searchData.songList = [];
            this.searchData.searchPage = 1;
            this.searchData.searchTotalpage = 1;
            this.searchData.searchTotalNum = 0;
  		},
  		hideVoice() {
  			this.$refs.voiceControl.className = this.$refs.voiceControl.className.replace(/ active/g, '');
  		},
  		search() {
  			if (this.searchData.keywords.replace(/(^\s*)|(\s*$)/g, '') === '') {
  				Func.toast('请输入关键词');
  				return;
  			}
  			this.initResult();
  			this.$http.jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
  				params: {
  					format: 'jsonp',
  					n: 20,
  					w: this.searchData.keywords,
  					p: this.searchData.searchPage
  				},
  				jsonp: 'jsonpCallback'
  			}).then((response) => {
	            this.songIndex = null;
              this.songType = '1';
	            this.searchData.songList = response.data.data.song.list;
	            this.songList = this.searchData.songList;
	            this.searchData.searchPage = response.data.data.song.curpage;
	            this.searchData.searchTotalpage = parseInt(response.data.data.song.totalnum/20) + (parseInt(response.data.data.song.totalnum%20) > 0 ? 1 : 0);
	            this.searchData.searchTotalNum = response.data.data.song.totalnum;
	        })
	        .catch((response) => {
	            Func.toast('搜索失败');
	        })
  		},
  		getDuration(time) {
			let s = parseInt(time%60) > 9 ? parseInt(time%60) : '0' + parseInt(time%60);
			let m = parseInt(time/60) > 9 ? parseInt(time/60) : '0' + parseInt(time/60);
			return m + ' : ' + s;
		},
  		getSinger(singers) {
			if (singers.length === 0) {
				return '';
			}
			let arr = [];
			singers.map(function(item) { 
  				if (item.name) {
  					arr.push(item.name);
  				}
			});
			return arr.join(' / ');
		},
  		getMoreSongs() {
  			this.$http.jsonp('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
  				params: {
  					format: 'jsonp',
  					n: 20,
  					w: this.searchData.keywords,
  					p: this.searchData.searchPage + 1
  				},
  				jsonp: 'jsonpCallback'
  			}).then((response) => {
	            this.searchData.songList = this.searchData.songList.concat(response.data.data.song.list);
	            this.songList = this.searchData.songList;
	            this.searchData.searchPage = response.data.data.song.curpage;
	            this.searchData.searchTotalpage = parseInt(response.data.data.song.totalnum/20) + (parseInt(response.data.data.song.totalnum%20) > 0 ? 1 : 0);
	            this.searchData.searchTotalNum = response.data.data.song.totalnum;
	        })
	        .catch((response) => {
	            Func.toast('获取失败');
	        })
  		},
  		setHistorySong(song) {
  			for(let i = 0, len = this.historySongList.length;i < len;i ++) {
  				if (song.songid === this.historySongList[i].songid) {
  					return;
  				}
  			}
  			if (this.historySongList.length >= 100) {
  				this.historySongList.splice(99, 1);
  			}
  			this.historySongList = [song].concat(this.historySongList);
        if (this.songType === '2') {
          this.songList = this.historySongList;
        }
  			Func.setStorage('Fee_historySongList', JSON.stringify(this.historySongList));
  		},
  		getSong(song, index) {
  			this.songIndex = index || 0;
  			if (this.playSetting.playType !== '3') {
  				this.playSetting.randomIndex = index;
  			} else {
  				for(let i = 0, len = this.playSetting.randomSongList.length;i < len;i ++) {
  					if (this.playSetting.randomSongList[i] === index) {
  						this.playSetting.randomIndex = i;
  						break;
  					}
  				}
  			}

  			let voiceProgress = this.song.voiceProgress;
  			this.song = {
  				songname: song.songname,
  				songid: song.songid,
  				singer: this.getSinger(song.singer),
  				songSrc: 'http://dl.stream.qqmusic.qq.com/'+song.songid+'.m4a?fromtag=66',
  				imgSrc: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + song.albummid + '.jpg?max_age=2592000',
  				duration: song.interval,
  				songProgress: 0,
  				voiceProgress: voiceProgress,
  				lyric: {},
  				currentTime: 0,
  				currentLyric: '0',
  				transIndex: 0,
  				translatePosition: 300
  			};
  			
  			this.$refs.audio.currentTime = 0;
  			this.$refs.audio.pause();

  			this.hideVoice();
  			this.setHistorySong(song);

  			this.$http.jsonp("https://api.darlin.me/music/lyric/"+song.songid+"/?").then(response =>{
  				let base = new Base64();
             	let lyric = base.decode(response.body.lyric);
             	this.song.lyric = Func.parseLyric(lyric);
            })
            .catch((response) => {
	            Func.toast('获取歌词失败');
	        })
  		},
  		playSong() {
  			let that = event.currentTarget;
  			if (that.className.indexOf('icon-bofang') >= 0) {
  				this.$refs.audio.pause();
  			} else {
  				this.$refs.audio.play();
  			}
  		},
  		preSong() {
			this.playSetting.randomIndex <= 0 ? this.playSetting.randomIndex = this.playSetting.randomSongList.length - 1 : this.playSetting.randomIndex -= 1;
	    	let index = this.playSetting.randomSongList[this.playSetting.randomIndex];
	    	let song  = this.songList[index];
	        this.getSong(song, index);
  		},
  		nextSong() {
			this.playSetting.randomIndex >= this.playSetting.randomSongList.length - 1 ? this.playSetting.randomIndex = 0 : this.playSetting.randomIndex += 1;
	    	let index = this.playSetting.randomSongList[this.playSetting.randomIndex];
			let song  = this.songList[index];
	        this.getSong(song, index);
  		},
  		updateSongProgress() {
  			this.song.songProgress = parseFloat(this.song.currentTime/this.song.duration*100).toFixed(3);
  		},
  		changeSongProgress() {
  			this.$refs.audio.currentTime = parseInt(this.$refs.audio.duration*this.song.songProgress/100)+1;

  			let transIndex = 0;
        	for (let key in this.song.lyric) {
	        	if (this.song.lyric[key] && +key < this.$refs.audio.currentTime) {
	        		transIndex++;
	        	}
	        }
	        this.song.transIndex = transIndex-1;

	        for(let i = this.$refs.audio.currentTime; i >= 0; i --) {
	        	let index = i.toString();
	        	if (this.song.lyric[index]) {
	        		this.song.currentLyric = index;
	        		break;
	        	}
	        }
  		},
		jumpProgress() {
			this.song.songProgress = parseFloat(event.offsetX/event.currentTarget.offsetWidth*100).toFixed(3)
			this.changeSongProgress()
		},
		getStartX() {
			let songWidth = this.$refs.sProgress.offsetWidth
			let startX = event.clientX
			let that = this
			let progress = parseFloat(that.song.songProgress)
			document.onmousemove = function(e){
				e.stopPropagation()
				e.preventDefault()
				let moveX = e.clientX
				if (that.song.songProgress >= 0 && that.song.songProgress <= 100) {
					that.song.songProgress = progress + (moveX - startX)/songWidth*100
					that.changeSongProgress()
				}
			}
			document.onmouseup = function(e) {
				e.stopPropagation()
				e.preventDefault()
				let endX = e.clientX
				if (that.song.songProgress >= 0 && that.song.songProgress <= 100) {
					that.song.songProgress = progress + (endX - startX)/songWidth*100
					that.changeSongProgress()
				}
				document.onmousemove = null
				document.onmouseup = null
			}
		},
  		showVoice() {
  			let that = event.currentTarget;
  			if (that.className.indexOf('active') >= 0) {
  				that.className = that.className.replace(/ active/g, '');
  			} else {
  				that.className += ' active';
  			}
  		},
  		changeVoiceProgress() {
  			this.$refs.voiceRange.style.backgroundSize = this.song.voiceProgress + '% 100%';
  			this.$refs.audio.volume = this.song.voiceProgress/100;
  			if (this.song.voiceProgress <= 0) {
  				this.$refs.voiceControl.className = this.$refs.voiceControl.className.replace(/shengyin/g, 'jingyin');
  			} else {
  				this.$refs.voiceControl.className = this.$refs.voiceControl.className.replace(/jingyin/g, 'shengyin');
  			}
  		},
  		rotate() {
  			this.playSetting.rotateDeg += 180;
  			let musicContainer = this.$refs.musicContainer;
  			if (musicContainer.className.indexOf('result') >= 0) {
  				this.$refs.musicContainer.className = musicContainer.className.replace(/result/g, 'lyric');
  			} else {
  				this.$refs.musicContainer.className = musicContainer.className.replace(/lyric/g, 'result');
  			}
  		},
  		changePlayType() {
  			let index = this.songIndex;
			let len = this.songList.length;
  			if (this.playSetting.playType === '1') {
  				this.playSetting.playType = '2';
  				this.playSetting.randomSongList = Array.apply(null, { length: len }).map((v, i) => i);
  				this.playSetting.randomIndex = index;
  			} else if (this.playSetting.playType === '2') {
  				this.playSetting.playType = '3';
  				let arr = Array.apply(null, { length: len }).map((v, i) => i);
  				arr.splice(index, 1);
  				arr = Func.randomArr(arr);
  				arr = [index].concat(arr);
  				this.playSetting.randomSongList = arr;
  				this.playSetting.randomIndex = 0;
  			} else if (this.playSetting.playType === '3') {
  				this.playSetting.playType = '1';
  				this.playSetting.randomSongList = Array.apply(null, { length: len }).map((v, i) => i);
  				this.playSetting.randomIndex = index;
			  }
  		},
  		getRandomSongList() {
  			let index = this.songIndex;
			let len = this.songList.length;
  			if (this.playSetting.playType === '1') {
  				this.playSetting.randomSongList = Array.apply(null, { length: len }).map((v, i) => i);
  				this.playSetting.randomIndex = index;
  			} else if (this.playSetting.playType === '2') {
  				this.playSetting.randomSongList = [index];
  				this.playSetting.randomIndex = 0;
  			} else if (this.playSetting.playType === '3') {
  				let arr = Array.apply(null, { length: len }).map((v, i) => i);
  				arr.splice(index, 1);
  				arr = Func.randomArr(arr);
  				arr = [index].concat(arr);
  				this.playSetting.randomSongList = arr;
  				this.playSetting.randomIndex = 0;
  			}
  		},
  		addFavor(song) {
        for(let i = 0, len = this.favorSongList.length;i < len;i ++) {
          if (song.songid === this.favorSongList[i].songid) {
            Func.toast('已存在');
            return;
          }
        }
        if (this.favorSongList.length >= 100) {
          Func.toast('超过限制');
          return;
        }
        this.favorSongList = [song].concat(this.favorSongList);
  			Func.toast('添加成功');
        Func.setStorage('Fee_favorSongList', JSON.stringify(this.favorSongList));
  		},
      removeFavor(index) {
        this.favorSongList.splice(index, 1);
        Func.toast('移除成功');
        Func.setStorage('Fee_favorSongList', JSON.stringify(this.favorSongList));
      }
  	}
}
</script>
 
<style lang="less" scoped>
	.audio{
		width: 0;
		height: 0;
	}
	/*横条样式*/  
	input[type=range] {  
	  -webkit-appearance: none;
	  width: 100%;  
	  background: -webkit-linear-gradient(#444, #444) no-repeat, #ccc;
	  background-size: 0% 100%;
	  height: 10px;
	  border-radius: 5px;
	  outline: none;
	  cursor: pointer;
	}  
	/*拖动块的样式*/  
	input[type=range]::-webkit-slider-thumb {  
	  	-webkit-appearance: none;
	  	height: 20px;
	 	width: 20px;
	  	background: #fff;
	  	border-radius: 50%; 
	  	border: 1px solid #444;
	  	cursor: pointer;
	} 
	.music-container{
		height: 100%;
		position: relative;
		transition: all 0.5s;
		&.music-container-result{
			.song-wrapper{
				z-index: 10;
			}
			.lyric-wrapper{
				z-index: 5;
			}
		}
		&.music-container-lyric{
			.result-wrapper{
				z-index: 5;
			}
			.lyric-wrapper{
				z-index: 10;
			}
		}
	}
	.song-wrapper{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		flex-direction: column;
		background-color: #f0f0f0;
		padding-bottom: 120px;
		.song-tabbar{
			height: 40px;
			line-height: 40px;
			margin: 20px 0 10px; 
			.tabbar-item{
				text-align: center;
				border-bottom: 1px solid #333;
				border-top-left-radius: 20px;
				border-top-right-radius: 20px;
				&:hover{
					color: #666;
				}
				&.active{
					border: 1px solid #333;
					border-bottom: none;
				}
			}
		}
		.to-login-wrapper{
			flex-direction: column;
			.to-login-btn{
				width: 100px;
				height: 34px;
			}
			.to-login-tip{
				margin-top: 10px;
				text-align: center;
			}
		}
		.result-wrapper{
			flex-direction: column;
			.result-tip{
				text-align: center;
				height: 30px;
				line-height: 30px;
				color: #999;
				font-size: 12px;
			}
			.more-song{
				display: block;
				height: 40px;
				line-height: 40px;
				color: #999;
				font-size: 12px;
				text-align: center;
				&:hover{
					color: #777;
				}
			}
			.result-list-wrapper{
				overflow-y: auto;
				padding-bottom: 5px;
				&::-webkit-scrollbar {
				    width: 8px;
				    height: 8px;
				}
				&::-webkit-scrollbar-button{
				    display: none;
				}
				&::-webkit-scrollbar-track{
				    background: #444;
				}
				&::-webkit-scrollbar-track-piece{
				    background: #fff;
				}
				&::-webkit-scrollbar-thumb{
				    background: #444;
				    border-radius: 4px;
				}
			}
			.result-list{
				display: -webkit-box; 
			    display: -moz-box; 
			    display: -ms-flexbox; 
			    display: -webkit-flex; 
			    display: flex; 
			    -webkit-box-align: center;
			    -moz-align-items: center;
			    -webkit-align-items: center;
			    align-items: center;
				height: 30px;
				line-height: 30px;
				font-size: 12px;
				cursor: pointer;
				text-align: center;
				border-radius: 5px;
				transition: all 0.2s;
				&.active{
					background-color: #ddd;
					color: #333;
				}
				&:hover{
					background-color: #ccc;
					color: #333;
				}
				&.result-list-header{
					color: #fff;
					font-size: 14px;
					cursor: inherit;
					background-color: #444;
					&:hover{
						background-color: #444;
						color: #fff;
					}
				}
				div{
					height: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					padding: 0 5px;
				}
        .option{
          width: 8%;
        }
				.songname{
					width: 38%;
				}
				.singer{
					width: 17%;
				}
				.album{
					width: 20%;
				}
				.duration{
					width: 17%;
				}
			}
		}
	}
	.lyric-wrapper{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		overflow: hidden;
		background-color: #f0f0f0;
		transform: rotateY(-180deg);
		.lyric-content{
			transition: all 0.5s;
			.lyric-list{
				width: 100%;
				height: 35px;
				font-size: 12px;
				color: #999;
				transition: all 0.2s;
				&.active{
					color: #333;
					font-weight: bold;
					font-size: 13px;
				}
			}
		}
	} 
	.music-footer{
		position: fixed;
		width: 100%;
		height: 120px;
		bottom: 0;
		left: 0;
      	z-index: 100;
      	background-color: rgba(255, 255, 255, 0.5);
      	.music-footer-content{
      		width: 800px;
      		height: 100%;
      		margin: 0 auto;
      		padding: 20px 0;
      		.song-img{
      			width: 80px;
      			height: 80px;
      			cursor: pointer;
      		}
      		.play-wrapper{
      			margin: 0 30px;
      			.iconfont{
      				font-size: 30px;
      				&:first-child{
      					margin-left: 0;
      				}
      				&.icon-bofang, &.icon-cplay1{
      					font-size: 40px;
      					margin: 0 20px;
      				}
      				&.icon-cplay1{
      					position: relative;
      					top: 3px;
      				}
      			}
      		}
      		.progress-wrapper{
      			.songinfo-wrapper{
      				.song-name{
      					font-size: 16px;
      					margin-right: 15px;
      					max-width: 50%;
      					text-overflow: ellipsis;
      				}
      				.singer{
      					color: #666;
      					font-size: 12px;
      					margin-left: 15px;
      					max-width: 40%;
      					text-overflow: ellipsis;
      				}
      			}
				.song-progress{
					width: 100%;
					height: 10px;
					background-color: #ccc;
					border-radius: 5px;
					margin: 10px 0;
					.current{
						width: 50%;
						height: 100%;
						position: relative;
						background-color: #444;
						border-radius: 5px;
						.current-point{
							position: absolute;
							height: 20px;
							width: 20px;
							background: #fff;
							border-radius: 50%; 
							border: 1px solid #444;
							cursor: pointer;
							right: -10px;
							top: -5px;
							z-index: 10;
						}
					}
				}
				.song-time{
					overflow: hidden;
					span{
						float: left;
						width: 50%;
						font-size: 12px;
					}
					.now-time{
						
					}
					.total-time{
						text-align: right;
					}
				}
      		}
      		.option-wrapper{
      			position: relative;
      			margin-left: 30px;
      			.iconfont{
      				font-size: 20px;
      				margin-left: 15px;
      				&:first-child{
      					margin-left: 0;
      				}
      				&.icon-shengyin, &.icon-jingyin{
      					position: relative;
      					top: -2px;
      					&.active .voice-progress-wrapper{
      						display: block;
      					}
      				}
      				&.play-type{
      					width: 20px;
      				}
      			}
      			.voice-num{
					width: 18px;
      				font-size: 10px;
      				margin-left: 5px;
      			}
      			.voice-progress-wrapper{
      				display: none;
      				position: absolute;
      				width: 90px;
      				bottom: 62px;
      				right: -30px;
      				-webkit-transform: rotate(-90deg);
      				.voice-progress{
  						height: 6px;
  						&::-webkit-slider-thumb{
  							width: 14px;
  							height: 14px;
  						}
  					}
      			}
      			
      		}
      	}
	}
	.music-search-wrapper{
		width: 800px;
		height: 40px;
		border: 1px solid #444;
		border-radius: 20px;
		position: relative;
		.search-input{
			border: none;
			outline: none;
			background-color: transparent;
			padding: 5px 30px;
		}
		.search-btn{
			width: 100px;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;
		}
	}
	
</style>