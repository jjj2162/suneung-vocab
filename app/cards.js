$('showOverview').onclick=()=>{learningStarted=false;renderLearn()};
$('learnList').addEventListener('click',e=>{const b=e.target.closest('button[data-card],#beginCards');if(!b)return;page=b.id==='beginCards'?0:+b.dataset.card;learningStarted=true;renderLearn();$('learnList').focus()});
$('nextRound').onclick=restartRound;
$('roundLater').onclick=()=>$('roundDialog').close();
$('roundTest').onclick=()=>{const unit=completionUnit;$('roundDialog').close();$('unit').value=String(unit);$('testFilter').value='all';$('excludeKnown').checked=false;$('cumulative').checked=false;$('remainingOnly').checked=false;$('count').value='all';tab('test');$('testPanel').scrollIntoView({block:'start'})};
$('learnList').addEventListener('keydown',e=>{if(e.target.closest('button'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveCard(e.key==='ArrowRight'?1:-1)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelCardVisit();else if(learningStarted&&!$('learnPanel').hidden&&!$('home').hidden)observeCard(learningCards()[page])});
