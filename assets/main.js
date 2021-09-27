    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const heading =$('header h2')
    const cdThum  =$('.cd-thumb')
    const audio  =$('#audio')
    const cd =  $('.cd') //even scroll set width and opacity of cd
    const playBtn = $('.btn-toggle-play')
    const  player = $('.player')
    const progress = $('#progress')//thanh tiến độ 
    const prevBtn =$('.btn-prev')
    const nextBtn =$('.btn-next')
    const randomBtn = $('.btn-random')
    const repeatSong = $('.btn-repeat')
    const playlist = $('.playlist')
    


    

var app ={
    
    israndom: false,
    isPlaying: true,
    currentIndex:0,
    isRepeat: false,


    songs:[
        {
            name: 'Hãy trao cho anh',
            singer: 'Sơn Tùng',
            path: './assets/song/song11.mp3',
            image:'./assets/img/song11.jpg'
        },
        
        {
            name: 'Cuồng si',
            singer: 'Lil Shady',
            path: './assets/song/song2.mp3',
            image:'./assets/img/song2.jpg'
        },
        {
            name: 'Thê lương',
            singer: 'Phúc Chinh',
            path: './assets/song/song3.mp3',
            image:'./assets/img/song3.jpg'
        },
        {
            name: 'Day dứ nỗi đau',
            singer: 'Mr.Siro',
            path: './assets/song/song4.mp3',
            image:'./assets/img/song4.jpg'
        },
        {
            name: 'Khóc trong mưa',
            singer: 'Trịnh Thiên Ân',
            path: './assets/song/song10.mp3',
            image:'./assets/img/song10.jpg'
        },
        {
            name: 'Cưới thôi',
            singer: 'B Ray',
            path: './assets/song/song5.mp3',
            image:'./assets/img/song5.jpg'
        },
        {
            name: 'Tình thương phu thuê',
            singer: 'Chí Hướng',
            path: './assets/song/song6.mp3',
            image:'./assets/img/song6.jpg'
        },
        {
            name: 'Ái nộ',
            singer: 'Khôi Vũ',
            path: './assets/song/song7.mp3',
            image:'./assets/img/song7.jpg'
        },
        {
            name: 'Độ tộc 2',
            singer: 'Độ Mixi',
            path: './assets/song/song8.mp3',
            image:'./assets/img/song8.jpg'
        },
        {
            name: 'Câu hẹn câu thề',
            singer: 'Đình Dũng',
            path: './assets/song/song9.mp3',
            image:'./assets/img/song9.jpg'
        },
        {
            name: 'Tình yêu chắp vá',
            singer: 'Mr.Siro',
            path: './assets/song/song1.mp3',
            image:'./assets/img/song1.jpg'
        },
       
        
       
    ],
    render: function(){  //render html-------------------------------
        const html = this.songs.map((song, index)=>{
            return`
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index=${index}>
                <div class="thumb" 
                    style="background-image: url('${song.image}');">         
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = html.join('')
      
    },



    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },
    
    handleEvent: function(){ // xử lí event -----------------------------
        const _this = this;
            //handle zoom cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width =newCdWidth> 0 ? newCdWidth+'px' :0 
            cd.style.opacity = newCdWidth / cdWidth 
        }
        // xử lí cd quay, dừng
        const cdTimeAnimate = cdThum.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration: 9000,  // quay trong bao lâu thì hết 1 vòng
            iterations: Infinity  // quay bao nhiêu lần(infiniti là quay mãi)
        })

        
        cdTimeAnimate.pause()
        // handle click Play and pause 
        playBtn.onclick = function (){
           
            if(_this.isPlaying){
                audio.play()
            } else{
                audio.pause()
            }
            
        }


        // when song play
        audio.onplay = function(){
            _this.isPlaying = false
            player.classList.add('playing')
            cdTimeAnimate.play()
        }
        //when song pause
        audio.onpause = function(){
            _this.isPlaying = true
            player.classList.remove('playing')
            cdTimeAnimate.pause()
        }
        
        //(ontimeupdate)khi tiến độ bài hát thay đổi thì:
        audio.ontimeupdate = function (){
            //lấy ra phần trăm bài hát
            if(audio.duration){  //vì giá trị mặc định đầu tiên của duration là NAN nên phải check
                const progressPersen =  Math.floor(audio.currentTime / audio.duration  *100)
                progress.value = progressPersen
            }
        }
        //xử lí khi tua bài hát
            progress.onchange = function(e){
                const seekTime = e.target.value/100 * audio.duration
                // progress.onmouseup = function(){
                    audio.currentTime = seekTime
                    // }
            }


        //next and prev song
        nextBtn.onclick = function(){
            if(_this.israndom){
                _this.randomSong()
            }else
            _this.nextSong()
            _this.scrollSongToView()
            audio.play()
        }  
        prevBtn.onclick = function(){
            if(_this.israndom){
                _this.randomSong()
            }else
            _this.prevSong()
            audio.play()
            _this.scrollSongToView()
        }   


        //on/off btn random song
        randomBtn.onclick = function(){
            _this.israndom = !_this.israndom
            randomBtn.classList.toggle('active', _this.israndom)//tham số thứ 2 là kiểu boolean: nếu true thì add class, false thì remove class
            
        } 
        

       
        //repeat song ----------------------------------------------------------------------------------------------------------------------------------
       
        repeatSong.onclick = function(){
            // _this.isRepeat = !_this.isRepeat
            // repeatSong.classList.toggle('active', _this.isRepeat)//tham số thứ 2 là kiểu boolean: nếu true thì add class, false thì remove class
            if(_this.isRepeat === false){
                repeatSong.classList.add('active')
                _this.isRepeat = true
            }else{
                repeatSong.classList.remove('active')
                _this.isRepeat = false
            }


        }
         //next song khi bài hát kết thúc
         audio.onended = function(){
             console.log('ketthuc bài hát');
            if(_this.isRepeat){   //khi repeat được active thì phát laị
                audio.play()
            }else{
                nextBtn.click()//hành động nhấn vào nút next
            }
        }

        //vì nếu lắng nghe sự kiện vào thằng .song thì sau này có thể có thêm chức năng thêm
        // bài hát thì bài đó sẽ dc render vào dom sau nên sẽ k lắng nghe dc.
        // nên phải dùng closest để lắng nghe từ thằng cha là playlist 
        //lắng nghe hành vi click vào play list
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(!e.target.closest('.option')){  // closest() trả về chính nó hoặc thằng cha, ông bà của nó
            
               if(songNode){
                _this.currentIndex =  Number(songNode.getAttribute('data-index')); // vì getAtribute trả về chuỗi nên phải chuyển sang number
                _this.loadCurrentSong()
                _this.render()
                audio.play()
               }
               
            } 
            if(e.target.closest('.option')){
                
            }   
        }       
        
        


    },
    //when next song
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.render()
        this.loadCurrentSong()
    },
    //when prev song
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1
        }
        this.render()
        this.loadCurrentSong()
        

    },
    scrollSongToView: function(){
       setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior : 'smooth',
            block :'center'

        });
       }, 400);
    },
    


    // random  Song
    randomSong: function(){
        let newCurrentIndex
        do{
             newCurrentIndex = Math.floor(Math.random() * this.songs.length)
        }while(newCurrentIndex === this.currentIndex)
        this.currentIndex = newCurrentIndex //gán lại giá trị index mới cho currentIndex
        this.loadCurrentSong()
    },

    //    loadCurrentSong----------------------------------------------------------------
    
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThum.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },

    start: function(){ //hàm start ------------------------------------
        this.defineProperties() //định nghĩa các thuộc tính cho object

        this.handleEvent()// 2.lắng nghe và xử lí các sự k iện
        this.loadCurrentSong() //3.tải thông tin bài hất đầu tiên khi chạy ứng dụng

        app.render() //1.render lại play list
        
       
    }
}
app.start()