## 微信小程序Canvas自绘图表之 仪表图（表盘）

大家好，我是梦辛工作室的灵，最近在开始画仪表图，一如既往的先看实现图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020072216063864.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTM5MjEwNQ==,size_16,color_FFFFFF,t_70#pic_center)

实现代码如下：

```javascript

function drawCircle(item, that) {
	//定义画图大小	
  let width = that.data.width * 0.7;
  let height = that.data.width * 0.7;

//获取中心坐标
  let centerPoint = {
    x: width / 2,
    y: height / 2
  }

  let ctx = wx.createCanvasContext('circle');

  ctx.save();
  ctx.translate(width / 2, height / 2);	//画布移动到中心


  let each = 5; //每个线之间的间距度数
  let len = 270 / each; //总共画270度 每次5度 需要画多少条线
  let bili = 50 / 45; //比例 每一度代表多少值，用于画值 这里是 45度代表 50℃

  let line = 30; //每根线的长度
  let offset = 10; // 特殊度数的额外长度

  let smallCircleWidth = 1.5; //小点的半径
  let offsetCircle = 10;	//小点距离线底部的距离

  let astart = 99;
  let bstart = 52;
  let cstart = 161;

  let aend = 216;
  let bend = 54;
  let cend = 115;

  let aeach = (aend - astart) / len;
  let beach = (bend - bstart) / len;
  let ceach = (cend - cstart) / len;

  ctx.rotate(45 * Math.PI / 180);

  if(!item.curtemp){
    item.curtemp = 125;
  }

  let pre = parseInt(item.curtemp / bili / each); //计算当前温度在第几根线

  ctx.setLineWidth(2);
  for (let i = 0; i < len; i++) {
    if (i > pre) {
      ctx.setStrokeStyle("#E0E0E0");
    } else {
      ctx.setStrokeStyle("rgb(" + (astart + i * aeach) + "," + (bstart + i * beach) + "," + (cstart + i * ceach) + ")");
    }
    ctx.beginPath();
    let point = {
      x: 0,
      y: centerPoint.y
    }
    let arrivePoint = {
      x: 0,
      y: point.y - line
    }
    if (i == len / 2) {
      point.y = centerPoint.y;
    } else {
      point.y = centerPoint.y - offset;
    }
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(arrivePoint.x, arrivePoint.y);
    ctx.stroke();

    ctx.setFillStyle("#F2F2F2");
    ctx.beginPath();
    ctx.arc(arrivePoint.x, arrivePoint.y - offsetCircle - smallCircleWidth, smallCircleWidth, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(each * Math.PI / 180);
  }

  ctx.restore();

  //画字
  let value = (item.curtemp + "") || "125";
  let centerFontSize = 50;
  ctx.setFontSize(centerFontSize);
  ctx.setTextAlign("center");
  ctx.setTextBaseline("middle");
  ctx.setFillStyle("#000");
  ctx.fillText(value, centerPoint.x, centerPoint.y);

  //画单位
  let unitFontSize = 15;
  ctx.setFontSize(unitFontSize);
  ctx.setTextAlign("left");
  ctx.setTextBaseline("top");
  ctx.setFillStyle("#000");
  ctx.fillText("℃", centerPoint.x + (value.length * centerFontSize / 3.5), centerPoint.y - centerFontSize / 2);

  unitFontSize = 10;
  ctx.setTextAlign("center");
  ctx.setTextBaseline("middle");
  ctx.setFillStyle("#CCCCCC");

  ctx.setFontSize(unitFontSize);
  ctx.fillText(bili * 45 + "", line + offset + offsetCircle + smallCircleWidth * 2, centerPoint.y);

  ctx.setFontSize(unitFontSize);
  ctx.fillText(bili * 135 + "", centerPoint.x, line + offset + offsetCircle + smallCircleWidth * 2);

  ctx.setFontSize(unitFontSize);
  ctx.fillText(bili * 225 + "", centerPoint.x * 2 - (line + offset + offsetCircle + smallCircleWidth * 2), centerPoint.y);

  //画开启中
  let stateStr = "未开启";
  if (item.state) {
    ctx.setFillStyle("rgba(0,168,255,1)");
    stateStr = "开启中";
  }

  ctx.setFontSize(15);
  ctx.setTextAlign("center");
  ctx.setTextBaseline("top");
  ctx.fillText(stateStr, centerPoint.x, centerPoint.y + centerFontSize / 2);


  ctx.draw();

}
```
wxml:

```javascript
<view class="flex_column flex_center" style="height:20vh">
  <text hidden="{{usetimestr.length == 0}}" class="text_hint">当前已使用</text>
  <text class="text_name">{{usetimestr}}</text>
</view>

<view style="width:100vw;height:50vh;" class="flex_column flex_center">
  <canvas canvas-id="circle" style="width:70vw;height:70vw;"></canvas>
</view>

<view bindtap="doRefresh" class="btn_class">刷新</view>
```
wxss:

```javascript
/* pages/devdetail/devdetail.wxss */

page{
  background: #fff;
}

.text_hint{ 
  font-size:80%;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(204,204,204,1);
}

.text_name{ 
  margin-top: 5px;
  font-size:100%;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(0,0,0,1);
}

.btn_class{
  width:30vw;
  margin-top: 3vh;
  padding: 5vw;
  margin-left: 30vw;
  background:rgba(0,168,255,1);
  box-shadow:0px 10px 30px 0px rgba(0,168,255,0.4);
  border-radius:60px;
  color: #fff;
  text-align: center;
}
```
2021年4月10日
应小伙伴的要求，增加了下触摸事件去实现如何通过触摸控制当前度数，下面是代码
先在xml上给canvas添加监听触摸事件

```javascript
 <canvas bindtouchmove="doTouchMove" bindtouchstart="doTouchStart"   canvas-id="circle" style="width:70vw;height:70vw;"></canvas>
```
然后回到JS里面添加代码：

```javascript
 doTouchStart:function(res){
    this.doTouchMove(res);
  },
  //监听触发事件
  doTouchMove:function(res){ 
    let nowtime = (new Date()).getTime();

    //100ms触发一次 减少不必要的绘图
    if(nowtime - lasttime < 100){ 
      return;
    }
    lasttime = nowtime;
    console.log(res);

     let x  = res.touches[0].x;
     let y  = res.touches[0].y;

     let width = app.globalData.width * 0.7;
     let height = app.globalData.width * 0.7;
   
    //获取中心坐标
    let centerPoint = {
      x: width / 2,
      y: height / 2
    }

    //刻度起点坐标
    let startPoint = {
      x:centerPoint.x - centerPoint.x * Math.sin(Math.PI / 4),
      y:centerPoint.y + centerPoint.y * Math.cos(Math.PI / 4),
    }

    let line = 30; //每根线的长度

    //最大圆的距离
    let maxDistance = centerPoint.y;

    //最小圆的距离
    let minDistance = centerPoint.y - line;

    //计算到圆心的距离
    let distance = Math.sqrt(Math.pow(centerPoint.x - x,2) + Math.pow(centerPoint.y - y,2));

    //触摸点再刻度上
    if(distance <= maxDistance && distance >= minDistance){

      //最大温度值
      let maxTemp = 300;  

      //当前触摸点与起点之间的夹角度数
      let curtemp = 0;    
      let offset = 0;

      //去掉不显示刻度的区域点击
      if(x > (startPoint.x + offset) && x < (centerPoint.x * 2 - (startPoint.x + offset) ) && y > centerPoint.y){
        return;
     }

    //判断区域

    let targetPoint = {
      x:0,
      y:0,
      angle:0,
    }

    if(x < startPoint.x && y > centerPoint.y){
      //从左往右第一个区域
      targetPoint.x = startPoint.x;
      targetPoint.y = startPoint.y;
      targetPoint.angle = 0;
    } else if (x < centerPoint.x && y < centerPoint.y){
      //从左往右第二个区域
      targetPoint.x = 0;
      targetPoint.y = centerPoint.y;
      targetPoint.angle = Math.PI / 4;
    } else if (x > centerPoint.x && y < centerPoint.y){
      //从左往右第三个区域
      targetPoint.x = centerPoint.x;
      targetPoint.y = 0;
      targetPoint.angle =  (Math.PI * 3) / 4;
    } else if (x > centerPoint.x && y > centerPoint.y){
      //从左往右第四个区域
      targetPoint.x = centerPoint.x * 2;
      targetPoint.y = centerPoint.y;
      targetPoint.angle =  (Math.PI * 5) / 4;
    } 

    //计算玄长
    let xuanDistance = Math.sqrt(Math.pow(targetPoint.x - x,2) + Math.pow(targetPoint.y - y,2));

    //计算夹角
    let jiaoDu = Math.asin((xuanDistance / 2) / centerPoint.y ) * 2 + targetPoint.angle;
  
      curtemp = ((jiaoDu / (Math.PI * 3 / 2)) * maxTemp).toFixed(0);
      drawCircle({curtemp },this); 

    } 

  }
```

好啦，就可以实现触摸到哪里就显示那里的度数，简单吧 

已将源码上传至github，传送门：[https://github.com/wintton/YiBiaoCanvas](https://github.com/wintton/YiBiaoCanvas)