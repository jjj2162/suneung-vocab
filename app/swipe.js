// Card motion is limited to touch/pen swipes. Buttons keep moveCard's instant change.
let swipeGesture=null,swipeAnimation=null,swipeEpoch=0;
const reducedCardMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function cancelCardMotion(){swipeEpoch++;swipeGesture=null;if(swipeAnimation){swipeAnimation.cancel();swipeAnimation=null}const card=$('learnList').querySelector('.word-card');if(card){card.style.transform='';card.style.opacity='';card.style.willChange=''}}
function restoreCardVisit(){if(learningStarted&&!$('learnPanel').hidden&&!$('home').hidden)observeCard(learningCards()[page])}
function finishCardDrag(g,commit){
 const token=++swipeEpoch,card=g.card,delta=g.dx<0?1:-1;
 const nextIndex=page+delta,canMove=nextIndex>=0&&nextIndex<learningCards().length;
 if(commit&&delta>0&&nextIndex===learningCards().length){cancelCardMotion();showLearningFinish();return}
 if(reducedCardMotion()){card.style.transform='';if(commit&&canMove)moveCard(delta);else restoreCardVisit();return}
 const width=$('learnList').clientWidth;
 const target=commit&&canMove?(delta>0?-width-35:width+35):0;
 swipeAnimation=card.animate([{transform:card.style.transform||'translateX(0)',opacity:1},{transform:`translateX(${target}px) rotate(${target?Math.sign(target)*3:0}deg)`,opacity:target?0.2:1}],{duration:target?170:210,easing:'cubic-bezier(.22,.75,.25,1)',fill:'forwards'});
 swipeAnimation.finished.then(()=>{if(token!==swipeEpoch)return;if(!target){swipeAnimation.cancel();swipeAnimation=null;card.style.transform='';card.style.willChange='';restoreCardVisit();return}
 moveCard(delta);cancelCardVisit();const incoming=$('learnList').querySelector('.word-card'),arrival=swipeEpoch;
 swipeAnimation=incoming.animate([{transform:`translateX(${delta>0?width+15:-width-15}px)`,opacity:.4},{transform:'translateX(0)',opacity:1}],{duration:210,easing:'cubic-bezier(.16,1,.3,1)'});
 swipeAnimation.finished.then(()=>{if(arrival!==swipeEpoch)return;swipeAnimation=null;restoreCardVisit()}).catch(()=>{});
 }).catch(()=>{});
}
$('learnList').addEventListener('pointerdown',e=>{
 if(!learningStarted||!e.isPrimary||e.button!==0||e.target.closest('button,a,input')||swipeAnimation)return;
 const card=e.target.closest('.word-card');if(!card)return;
 swipeGesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,axis:null,card};
 $('learnList').setPointerCapture(e.pointerId);
});
$('learnList').addEventListener('pointermove',e=>{
 const g=swipeGesture;if(!g||g.id!==e.pointerId)return;
 g.dx=e.clientX-g.x;g.dy=e.clientY-g.y;
 if(!g.axis&&Math.max(Math.abs(g.dx),Math.abs(g.dy))>8){g.axis=Math.abs(g.dx)>Math.abs(g.dy)*1.25?'x':'y';if(g.axis==='x'){cancelCardVisit();g.card.style.willChange='transform'}}
 if(g.axis!=='x')return;
 const n=learningCards().length,atEdge=(page===0&&g.dx>0)||(page===n-1&&g.dx<0);
 const distance=g.dx*(atEdge?.22:1);
 if(!reducedCardMotion())g.card.style.transform=`translateX(${distance}px) rotate(${Math.max(-3,Math.min(3,distance/100))}deg)`;
});
function releaseCard(e,cancelled){const g=swipeGesture;if(!g||g.id!==e.pointerId)return;swipeGesture=null;if(g.axis!=='x')return;const threshold=Math.min(95,$('learnList').clientWidth*.22);finishCardDrag(g,!cancelled&&Math.abs(g.dx)>=threshold)}
$('learnList').addEventListener('pointerup',e=>releaseCard(e,false));
$('learnList').addEventListener('pointercancel',e=>releaseCard(e,true));
