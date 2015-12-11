function updateDraw(){
			for(var id in entitys){
				var entity = entitys[id];
				if(!entity.isHide){
					var dataObj = entity.getDrawData();
					drawPool.push(dataObj);
				}
			}
			
			if(drawPool.length > 0)
				drawPool.sort(orderDepthNode);
			
			for(var i=0;i<drawPool.length;i++){
				var data = drawPool[i];
				if(data.text){
					context.fillStyle = data.clr;
					context.font = data.size+"px WC ROUGHTRAD  Bta,santasy"
					context.fillText(data.text,data.x,data.y);
				}else{
					if(data.direct)
						drawJsonImg(data.name,data.x,data.y,true,true,data.offsetX,data.offsetY);
					else
						drawJsonImg2(data.name,data.x,data.y,true,true,data.offsetX,data.offsetY);
				}
					
				
			}
			while(drawPool.length >0){
				drawPool.pop();
			}
		}
		
function orderDepthNode(nodeA,nodeB){
			if(nodeA.depth > nodeB.depth)	
				return 1;
			else if(nodeA.depth < nodeB.depth)
				return -1;
			else 
				return 0;
		}
		
function drawScaleImg(context,name,x,y,scale){
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(true){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.drawImage(img_sencha,dx,dy,dw,dh,x+rectX,y+rectY,dw*scale,dh*scale);
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh*scale-rectY,rectX,dh*scale,dw*scale);
				context.restore();
			}
		};
function drawJsonImg(context,name,x,y,init,border,boxoffsetX,boxoffsetY){
			if(!boxoffsetX)
				boxoffsetX = 0;
			if(!boxoffsetY)
				boxoffsetY = 0;
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(!init){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.drawImage(img_sencha,dx,dy,dw,dh,x+rectX+boxoffsetX,y+rectY+boxoffsetY,dw,dh);
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh-rectY+boxoffsetY,rectX+boxoffsetX,dh,dw);
				context.restore();
			}
			if(border)
				drawPoint(x,y,initW,initH);
		};

function drawJsonImg2(name,x,y,init,border,boxoffsetX,boxoffsetY){
			var data = jsonObj[name];
			var d1 = data[0];
			var dx = d1[0];
			var dy = d1[1];
			var dw = d1[2];
			var dh = d1[3];
			var offsetX = data[1][0];
			var offsetY = data[1][0];
			var initW = data[4][0];
			var initH = data[4][1];
			var rectX = data[3][0];
			var rectY = data[3][1];
			if(!init){
				rectX = 0;
				rectY = 0;
				initW = dw;
				initH = dh;
			}
			var isRote = (data[2] == 1);
			if(!isRote){
				context.save();
				context.setTransform(1,0,0,1,0,0);
				context.translate(x,y);
				context.scale(-1,1);
				context.drawImage(img_sencha,dx,dy,dw,dh,-rectX-dw+boxoffsetX,rectY+boxoffsetY,dw,dh);
				context.restore();
			}else{
				context.save();
				context.setTransform(1,0,0,1,0,0);
				var angle = -90*(Math.PI/180);
				context.translate(x,y);
				context.rotate(angle);
				context.scale(1,-1)
				context.drawImage(img_sencha,dx,dy,dh,dw,-dh-rectY+boxoffsetY,-dw-(initW-dw-rectX)+boxoffsetX,dh,dw);
				context.restore();
			}
			if(border)
				drawPoint(x,y,initW,initH);
		};
		
function drawPoint(x,y,w,h){
			context.fillStyle = "red";
			context.fillRect(x,y,2,2);
			context.strokeStyle = "black";
			context.strokeRect(x,y,w,h);
		}


function drawCircle(x,y){
	context.fillStyle = "yellow";
	context.beginPath();
	context.arc(x,y,3,0,Math.PI*2,true);
	context.closePath();
	context.fill();
}

//flat :1 尖顶 0 平顶
function drawHexagon(ctx,x,y,r,clr,clrborder,flat){
			if(flat == null)
				flat = 0;
			if(clr)
				ctx.fillStyle = clr;
			if(clrborder==null)
				clrborder = clr;
			ctx.strokeStyle = clrborder;
			//ctx.fillRect(x,y,4,4);
			ctx.beginPath();
			var x0 = x;
			var y0 = y;
			var ang = 0;
			for(var i=0;i<12;i++){
				ang = i * (Math.PI/6)+(Math.PI/6*flat);
				x0 = x - r*Math.sin(ang);
				y0 = y + r*Math.cos(ang);
				if(i==0){
					ctx.moveTo(x0,y0);
				}		
				else{
					if(i%2==0)
						ctx.lineTo(x0,y0);
				}
				    
				//ctx.fillText(i.toString(),x0,y0);
			}

			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

function drawText(ctx,x,y,fontDis,txtArray){
			for(var i=0;i<txtArray.length;i++){
				ctx.fillText(txtArray[i],x,y+i*fontDis);
			}
		}
