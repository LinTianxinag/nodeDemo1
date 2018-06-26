/**
 * Created by Administrator on 2018/2/2.
 */




function initMap(ctx,mapOrigin, map,snakeArr, imgs,unit) {
    //将环境的数值归为原始值
    for(var k=0;k<mapOrigin.length;k++){
        for(var p=0;p<mapOrigin[k].length;p++){
            map[k][p]=mapOrigin[k][p];
        }
    }

    for(var i=0;i<snakeArr.length;i++){
        if(i==0){
            map[snakeArr[i][0]][snakeArr[i][1]]=2;
        }else{
            map[snakeArr[i][0]][snakeArr[i][1]]=3;
        }
    }
    for(var i=0;i<map.length;i++){
        for(var j=0;j<map[i].length;j++){
                    ctx.drawImage(imgs[map[i][j]],i*unit,j*unit,unit,unit);
        }
    }




}


//开始游戏的操作
//进行蛇的移动，碰撞(实物和墙体)，状态改变
//目前 设计为一条具有自主功能的蛇
function beginGame(ctx, map,dir,snakeArr, imgs,unit) {
    var num = 0;//起始方向：0,1,2,3：上，左，下，右
    var snakeInt = setInterval(function () {
    //     console.log("dir: "+dir.val());
    // console.log("before: "+snakeArr);
        moveDir(dir.val(),snakeArr);
        // console.log("after: "+snakeArr);
        if(snakeArr[0][0]<0||snakeArr[0][0]>=map.length||snakeArr[0][1]<0||snakeArr[0][1]>=map[0].length){
            console.log('结束');
            alert("结束");
            clearInterval(snakeInt);
        }else{
            initMap(ctx,mapOrigin,map,snakeArr,imgs,unit);
        }



    },500)
}
//单纯的模块，进行方向的移动，如果走不通，就进行下一个方向的移动一次是上(0)，左(1)，下(2)，右(3)
//判断将要移动的方向是不是空的，并且不是跟现有的方向相反
//先做一个手动控制的，再做一个只能运行的。
function moveDir(dir,snakeArr) {
    switch (Number(dir)){
        case 0:
            if(dir!=2){
                snakeArr.unshift([snakeArr[0][0],snakeArr[0][1]-1]);
                snakeArr.pop(snakeArr[snakeArr.length]);
            }
            // else{
            //     moveDir(1);
            // }
            break;
        case 1:
            if(dir!=3){
                snakeArr.unshift([snakeArr[0][0]-1,snakeArr[0][1]]);
                snakeArr.pop(snakeArr[snakeArr.length]);
            }
            break;
        case 2:
            if(dir!=0){
                snakeArr.unshift([snakeArr[0][0],snakeArr[0][1]+1]);
                snakeArr.pop(snakeArr[snakeArr.length]);
            }
            break;
        case 3:
            if(dir!=1){
                snakeArr.unshift([snakeArr[0][0]+1,snakeArr[0][1]]);
                snakeArr.pop(snakeArr[snakeArr.length]);
            }
            break;
        default:
            break;
    }

}

