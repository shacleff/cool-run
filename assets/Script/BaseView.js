// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
import {BGMoveDuration} from './Defined';
cc.Class({
    extends: cc.Component,

    properties: {
        baseView: {
            default: null,
            type: cc.Node
        },
        BGImg1: cc.Node, // 背景图
        BGImg2: cc.Node, // 森林
        // foo: { 
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.jumpHeight = 35; // 跳跃高度
        this.sliceGap = 8; // 人物滑动时与地面的间距
        this.bgImgMoveDuration = BGMoveDuration; //背景移动速度
        this.hero = this.baseView.getChildByName("Hero");
        this.heroAnim = this.hero.getComponent(cc.Animation);
        this.sliceBtn = this.baseView.getChildByName('ButtonSlice');
        this.sliceBtn.on(cc.Node.EventType.TOUCH_START, this.onTouchEvent_sliceBtn, this);
        this.sliceBtn.on(cc.Node.EventType.TOUCH_END, this.onTouchEvent_sliceBtn, this);
        this.sliceBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEvent_sliceBtn, this);
        
        this.run();

        this.moveBgImg()

        
    },

    start () { 

    },

    // update (dt) {},

    moveBgImg() {
        var self = this;
        cc.log('this.BGImg1.width',this.BGImg1.width)
        var moveWidth = this.BGImg1.getChildByName("BGImg1").width;
        var callBack = cc.callFunc(function(){
            console.log('bgImgMoveOver');
            this.BGImg1.x = 0;
            startMove();
        }.bind(this),this.BGImg1,this);
        
        var startMove = function() {
            var moveBg = cc.moveBy(self.bgImgMoveDuration,-moveWidth,0);
            var seq = cc.sequence(moveBg,callBack);
            self.BGImg1.runAction(seq);
            
        };
        startMove();
        
        
    },

    onTouchEvent_sliceBtn (target) {
        // console.log('onTouchStart',target)
        var type = target.type;

        // 跳跃 和 滑动 两者不能切换
        var currentClipName = this.getCurrentClipName();
        if( currentClipName === 'Jump') {
            return;
        }

        if(type === 'touchstart') {
            this.hero.y = this.hero.y - this.sliceGap;
            this.slice();
        } else if(type === 'touchend' && currentClipName === 'Slice') { // 如果在跳跃时按住了滑动的按钮，则不 走这里
            this.hero.y = this.hero.y + this.sliceGap;
            this.run();
        } else if(type === 'touchcancel' && currentClipName === 'Slice') { // 如果在跳跃时按住了滑动的按钮，则不走这里
            this.hero.y = this.hero.y + this.sliceGap;
            this.run();
        }
        
    },

    onTouchEvent_jumpBtn(target, type) {
        // cc.log(type);
       
        // 跳跃 和 滑动 两者不能切换
        var currentClipName = this.getCurrentClipName();
        if(currentClipName === 'Slice' || currentClipName === 'Jump') {
            return;
        }
        
        if(type === 'Jump') {
            var jumpUp = cc.moveBy(0.3, 0, this.jumpHeight).easing(cc.easeCubicActionInOut());
            var jumpDown = cc.moveBy(0.3, 0, -this.jumpHeight).easing(cc.easeCubicActionIn());
            var finish = cc.callFunc(function(){
                // console.log('jumpOver');
                this.run();
            }.bind(this), this.hero, this);
            var seq = cc.sequence(jumpUp, jumpDown, finish);
            this.hero.runAction(seq);
            this.heroAnim.play('Jump');

        

        }
    },

    onTouchEnd(target) {
        //cc.log('onTouchEnd',target);
        
    },

    run() {
        this.heroAnim.play('Run')
    },

    slice() {
        this.heroAnim.play('Slice');
    },

    //当前正在播放的动画名称
    getCurrentClipName() {
        return this.heroAnim.currentClip.name 
    },

});
