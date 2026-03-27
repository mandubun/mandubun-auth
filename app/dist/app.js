(()=>{var a={API_BASE_URL:"https://api.mandubun.com",currentUserId:null,currentUserEmail:null,currentUserIsAdmin:!1,isLoggedIn:!1,_refreshingToken:null,userXP:0,userLevel:1,userStreak:0,dailyWordsPracticed:0,DAILY_WORDS_GOAL:10,_cachedDueCount:0,_cachedVocabDue:0,_cachedGrammarDue:0,_cachedOverviewData:null,userIsPro:!1,TTS_READY:!1,TTS_VOICES:[],TTS_SELECTED_VOICE:null,TTS_IS_SPEAKING:!1,TTS_SPEED:"medium",TTS_LAST_REQUEST:0,SPEECH_READY:!1,SPEECH_SUPPORTED:!1,SPEECH_IS_LISTENING:!1,currentMode:"browse",practiceDifficulty:"beginner",practiceFocus:"all",blendedPracticeModeActive:!1,activeBlendedPanelHash:null,blendedSession:null,readerMode:"subtitles",currentSubtitleIndex:-1,allTranslationBoxes:[],navScrolling:!1,panelsSeen:0,practiceCTADismissed:!1,currentWebtoonId:null,currentEpisodeId:null,isOnline:navigator.onLine,currentPage:"home"};var Z="https://jwlylgrtaevgjujstvvg.supabase.co",be="sb_publishable_is4EfIvydGz5COHFX6XKrA_h39lvOZv";function ye(){try{return{accessToken:localStorage.getItem("auth_token"),refreshToken:localStorage.getItem("refresh_token"),expiresAt:parseInt(localStorage.getItem("expires_at")||"0",10),email:localStorage.getItem("user_email")}}catch{return{accessToken:null,refreshToken:null,expiresAt:0,email:null}}}function we(t,e,n,s){try{localStorage.setItem("auth_token",t),localStorage.setItem("refresh_token",e),localStorage.setItem("expires_at",String(n)),s&&localStorage.setItem("user_email",s)}catch(i){console.error("Failed to store tokens:",i)}}function _e(){try{localStorage.removeItem("auth_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("expires_at"),localStorage.removeItem("user_email")}catch{}}async function dt(t){let e=await fetch(`${Z}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{"Content-Type":"application/json",apikey:be},body:JSON.stringify({refresh_token:t})});if(!e.ok)throw new Error(`Token refresh failed: ${e.status}`);let n=await e.json();return{accessToken:n.access_token,refreshToken:n.refresh_token,expiresAt:Math.floor(Date.now()/1e3)+(n.expires_in||3600),email:n.user?.email}}async function J(){let t=ye();if(!t.accessToken)return null;let e=Math.floor(Date.now()/1e3);return t.expiresAt-e<300?t.refreshToken?a._refreshingToken?a._refreshingToken:(a._refreshingToken=(async()=>{try{let n=await dt(t.refreshToken);return we(n.accessToken,n.refreshToken,n.expiresAt,n.email),n.accessToken}catch{return P(),null}finally{a._refreshingToken=null}})(),a._refreshingToken):(P(),null):t.accessToken}function w(){let t=window.location.hash;if(t&&t!=="#/"&&t!=="#")try{localStorage.setItem("auth_return_route",t)}catch{}let e=window.location.origin+"/app/",n=`${Z}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(e)}`;window.location.href=n}function ut(){let t=window.location.hash;if(!t||!t.includes("access_token"))return!1;let e=new URLSearchParams(t.substring(1)),n=e.get("access_token"),s=e.get("refresh_token"),i=parseInt(e.get("expires_in")||"3600",10);if(!n)return!1;let r=Math.floor(Date.now()/1e3)+i;we(n,s,r,null);let o="#/";try{let c=localStorage.getItem("auth_return_route");c&&(o=c,localStorage.removeItem("auth_return_route"))}catch{}return history.replaceState(null,"",window.location.pathname+o),mt(n),!0}async function mt(t){try{let e=await fetch(`${Z}/auth/v1/user`,{headers:{Authorization:`Bearer ${t}`,apikey:be}});if(e.ok){let n=await e.json();n.email&&(localStorage.setItem("user_email",n.email),a.currentUserEmail=n.email)}}catch{}}async function xe(){if(ut())return a.isLoggedIn=!0,!0;if(await J()){let e=ye();return a.currentUserEmail=e.email,a.isLoggedIn=!0,!0}return a.isLoggedIn=!1,!1}function Te(){_e(),a.isLoggedIn=!1,a.currentUserId=null,a.currentUserEmail=null,a.currentUserIsAdmin=!1,a.userIsPro=!1,window.location.hash="#/"}function P(){_e(),a.isLoggedIn=!1,a.currentUserId=null,a.currentUserEmail=null,window.location.hash="#/"}var R={},q=null,Se=null;function I(t,e){R[t]=e}function pt(){let e=(window.location.hash.slice(1)||"/").split("/").filter(Boolean),n=e.length===0?"/":`/${e[0]}`,s=e.slice(1);return{path:n,params:s}}function ft(t){return R[t]?{handler:R[t],path:t}:R["/"]?{handler:R["/"],path:"/"}:null}async function Ee(){let{path:t,params:e}=pt();if(Se===t)return;if(q){try{q()}catch{}q=null}let n=document.getElementById("app-root");if(!n)return;let s=ft(t);if(!s){n.innerHTML='<div class="page empty-state"><div class="empty-state-icon">404</div><p>Page not found</p></div>';return}Se=t,document.querySelectorAll("#bottom-nav .nav-item").forEach(i=>{let o=(i.getAttribute("href")||"").replace("#","")||"/";i.classList.toggle("active",o===t)});try{q=await s.handler(n,e)}catch(i){console.error(`Route error (${t}):`,i),n.innerHTML='<div class="page empty-state"><p>Something went wrong. Please try again.</p></div>'}}function Le(){window.addEventListener("hashchange",Ee),Ee()}var ke=1e4;function Ie(t){return`${a.API_BASE_URL}${t.startsWith("/")?t:`/${t}`}`}async function $(t,e={}){let n=await J();if(!n)return P(),null;let s=Ie(t),i={"Content-Type":"application/json",Authorization:`Bearer ${n}`,"X-Timezone":Intl.DateTimeFormat().resolvedOptions().timeZone,...e.headers||{}};try{let r=new AbortController,o=setTimeout(()=>r.abort(),ke),c=await fetch(s,{...e,headers:i,signal:r.signal});return clearTimeout(o),c.status===401?(P(),null):c}catch(r){return r.name==="AbortError"?console.warn(`Request timed out: ${t}`):console.warn(`Fetch error: ${t}`,r),null}}async function M(t,e={}){let n=Ie(t);try{let s=new AbortController,i=setTimeout(()=>s.abort(),ke),r=await fetch(n,{...e,headers:{"Content-Type":"application/json",...e.headers||{}},signal:s.signal});return clearTimeout(i),r}catch(s){return console.warn(`Anon fetch error: ${t}`,s),null}}async function ee(t,e=3){for(let n=0;n<=e;n++){try{let s=await t();if(s&&s.status!==503)return s}catch{}n<e&&await new Promise(s=>setTimeout(s,1e3*Math.pow(2,n)))}return null}async function _(t){let e=await $(t);return!e||!e.ok?null:e.json()}async function H(t,e){let n=await $(t,{method:"POST",body:JSON.stringify(e)});return!n||!n.ok?null:n.json()}function $e(t){let e=a._cachedOverviewData;if(!e){t.innerHTML=`
      <div class="card">
        <div class="skeleton skeleton-title"></div>
        <div class="stat-grid">
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
        </div>
      </div>`;return}let n=Math.min(100,Math.round(e.daily_words_practiced/(e.daily_words_goal||10)*100));t.innerHTML=`
    <div class="card">
      <div class="flex items-center justify-between mb-lg">
        <div class="card-title">Your Progress</div>
        ${a.userIsPro?'<span class="badge badge-pro">PRO</span>':'<span class="badge badge-free">Free</span>'}
      </div>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">${e.streak_days||0}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.xp_total||0}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e.total_vocab||0}</div>
          <div class="stat-label">Words Learned</div>
        </div>
      </div>
      <div class="mt-lg">
        <div class="flex items-center justify-between mb-md">
          <span class="text-secondary" style="font-size:var(--font-sm)">Daily Goal</span>
          <span class="text-secondary" style="font-size:var(--font-sm)">${e.daily_words_practiced||0}/${e.daily_words_goal||10}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill${n>=100?" success":""}" style="width:${n}%"></div>
        </div>
      </div>
    </div>`}function Ae(t){let e=a._cachedVocabDue||0,n=a._cachedGrammarDue||0,s=e+n;t.innerHTML=`
    <div class="card">
      <div class="card-title">Due for Review</div>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value${s>0?" text-warning":""}">${s}</div>
          <div class="stat-label">Total Due</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${e}</div>
          <div class="stat-label">Vocab</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${n}</div>
          <div class="stat-label">Grammar</div>
        </div>
      </div>
      ${s>0?'<button class="btn btn-primary btn-block mt-lg" id="start-review-btn">Start Review</button>':""}
    </div>`}async function Me(t){if(!a.isLoggedIn){t.innerHTML=`
      <div class="page">
        <div style="text-align:center;padding:60px 20px">
          <h1 style="font-size:var(--font-2xl);margin-bottom:var(--space-lg)">Mandubun</h1>
          <p class="text-secondary mb-xl">Learn Korean by reading Naver Webtoons</p>
          <button class="btn btn-primary btn-block" id="login-btn">Continue with Google</button>
          <p class="text-muted mt-lg" style="font-size:var(--font-sm)">Free to start. No credit card required.</p>
        </div>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}t.innerHTML=`
    <div class="page">
      <div id="stats-section"><div class="skeleton skeleton-card"></div></div>
      <div id="due-section"><div class="skeleton skeleton-card"></div></div>
      <div id="actions-section"></div>
    </div>`;let[e,n,s]=await Promise.all([_("/learning/overview"),_("/vocab_due_for_review"),_("/grammar_due_for_review")]);e&&(a._cachedOverviewData=e,a.userXP=e.xp_total||0,a.userStreak=e.streak_days||0,a.userLevel=e.user_level||1,a.dailyWordsPracticed=e.daily_words_practiced||0,a.DAILY_WORDS_GOAL=e.daily_words_goal||10,a.userIsPro=e.is_pro||!1,a.currentUserIsAdmin=e.is_admin||!1),n&&(a._cachedVocabDue=n.due_count||0),s&&(a._cachedGrammarDue=s.due_count||0),a._cachedDueCount=a._cachedVocabDue+a._cachedGrammarDue;let i=document.getElementById("stats-section"),r=document.getElementById("due-section"),o=document.getElementById("actions-section");i&&$e(i),r&&Ae(r),o&&(o.innerHTML=`
      <div class="card">
        <div class="card-title">Quick Actions</div>
        <a href="#/catalog" class="list-item" style="text-decoration:none;color:inherit">
          <span style="font-size:20px">&#128218;</span>
          <div>
            <div style="font-weight:500">Browse Webtoons</div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Find something to read</div>
          </div>
        </a>
        <a href="#/learn" class="list-item" style="text-decoration:none;color:inherit">
          <span style="font-size:20px">&#128218;</span>
          <div>
            <div style="font-weight:500">My Learning Hub</div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Vocab list, grammar, progress</div>
          </div>
        </a>
      </div>`),document.getElementById("start-review-btn")?.addEventListener("click",()=>{window.location.hash="#/learn"})}var te="all";async function De(t){t.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Browse Webtoons</h2>
      <div id="genre-chips" class="chip-group mb-lg"></div>
      <div id="series-list"></div>
    </div>`;let[e,n]=await Promise.all([M("/catalog/genres"),M("/catalog/series")]),s=[],i=[];try{if(e?.ok){let r=await e.json();s=r.genres||r||[]}}catch(r){console.warn("Failed to parse genres:",r)}try{if(n?.ok){let r=await n.json();i=r.items||r.series||r||[]}}catch(r){console.warn("Failed to parse series:",r)}vt(s),gt(Array.isArray(i)?i:[])}function vt(t){let e=document.getElementById("genre-chips");if(!e)return;let n=Array.isArray(t)?t:[],s=[{key:"all",label:"All"},...n.map(i=>({key:i,label:i}))];e.innerHTML=s.map(i=>`<button class="chip${i.key===te?" active":""}" data-genre="${i.key}">${i.label}</button>`).join(""),e.addEventListener("click",i=>{let r=i.target.closest(".chip");r&&(te=r.dataset.genre,e.querySelectorAll(".chip").forEach(o=>o.classList.toggle("active",o.dataset.genre===te)))})}function gt(t){let e=document.getElementById("series-list");if(e){if(!t.length){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No webtoons available yet.</p>
      </div>`;return}e.innerHTML=t.map(n=>`
    <a href="#/series/${n.webtoon_id}" class="card" style="display:flex;gap:var(--space-lg);text-decoration:none;color:inherit;cursor:pointer">
      ${n.thumbnail_url?`<img src="${n.thumbnail_url}" alt="" style="width:80px;height:80px;border-radius:var(--radius-md);object-fit:cover" loading="lazy">`:""}
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;margin-bottom:var(--space-sm)">${He(n.series_title||n.title||"Untitled")}</div>
        ${n.author_names?`<div class="text-secondary" style="font-size:var(--font-sm)">${He(n.author_names)}</div>`:""}
        ${n.episode_count?`<div class="text-muted" style="font-size:var(--font-xs);margin-top:var(--space-sm)">${n.episode_count} episodes</div>`:""}
      </div>
    </a>
  `).join("")}}function He(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}var O="all",ht="recent",bt="all",D=1,S=[],ne="vocab";async function Ce(t){if(!a.isLoggedIn){t.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p class="mb-lg">Log in to see your learning progress</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}t.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">My Learning</h2>
      <div id="hub-tabs" class="chip-group mb-lg">
        <button class="chip active" data-tab="vocab">Vocabulary</button>
        <button class="chip" data-tab="grammar">Grammar</button>
      </div>
      <div id="hub-filters" class="chip-group mb-lg"></div>
      <div id="hub-content"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
      <div id="hub-load-more" class="text-center mt-lg"></div>
    </div>`,document.getElementById("hub-tabs")?.addEventListener("click",e=>{let n=e.target.closest(".chip");n&&(ne=n.dataset.tab,document.querySelectorAll("#hub-tabs .chip").forEach(s=>s.classList.toggle("active",s.dataset.tab===ne)),D=1,S=[],se())}),await se()}async function se(){yt();let t=document.getElementById("hub-content");t&&(ne==="vocab"?await Be(t):await _t(t))}function yt(){let t=document.getElementById("hub-filters");if(!t)return;let e=[{key:"all",label:"All"},{key:"due",label:"Due"},{key:"learning",label:"Learning"},{key:"mastered",label:"Mastered"},{key:"new",label:"New"}];t.innerHTML=e.map(n=>`<button class="chip${n.key===O?" active":""}" data-filter="${n.key}">${n.label}</button>`).join(""),t.onclick=n=>{let s=n.target.closest(".chip");s&&(O=s.dataset.filter,D=1,S=[],t.querySelectorAll(".chip").forEach(i=>i.classList.toggle("active",i.dataset.filter===O)),se())}}async function Be(t){D===1&&(t.innerHTML='<div class="skeleton skeleton-card"></div>'.repeat(3));let e=await _(`/learning/vocab?page=${D}&per_page=30&sort=${ht}&filter=${O}&category=${bt}&include_sentences=true`);if(!e||!e.vocab){D===1&&(t.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">&#128218;</div>
          <p>No vocabulary yet. Start reading webtoons to build your word list!</p>
        </div>`);return}D===1&&(S=[]),S=[...S,...e.vocab],wt(t);let n=document.getElementById("hub-load-more");n&&(e.has_more?(n.innerHTML='<button class="btn btn-secondary" id="load-more-btn">Load More</button>',document.getElementById("load-more-btn")?.addEventListener("click",()=>{D++,Be(t)})):n.innerHTML=S.length>0?`<span class="text-muted" style="font-size:var(--font-sm)">${S.length} words</span>`:"")}function wt(t){if(!S.length){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No words match this filter.</p>
      </div>`;return}t.innerHTML=S.map(e=>{let n=Pe(e);return`
      <div class="card" style="padding:var(--space-lg)">
        <div class="flex items-center justify-between">
          <div>
            <span style="font-size:var(--font-md);font-weight:600">${z(e.vocab_word)}</span>
            ${e.romanization?`<span class="text-muted" style="font-size:var(--font-sm);margin-left:var(--space-md)">${z(e.romanization)}</span>`:""}
          </div>
          <span class="badge ${n}">${e.mastery||"new"}</span>
        </div>
        ${e.meaning?`<div class="text-secondary mt-sm" style="font-size:var(--font-sm)">${z(e.meaning)}</div>`:""}
        ${e.next_review_at?`<div class="text-muted mt-sm" style="font-size:var(--font-xs)">Next review: ${xt(e.next_review_at)}</div>`:""}
      </div>`}).join("")}async function _t(t){t.innerHTML='<div class="skeleton skeleton-card"></div>'.repeat(3);let e=await _(`/learning/grammar?page=1&per_page=30&filter=${O}`);if(!e||!e.grammar||!e.grammar.length){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No grammar patterns yet. Start practicing to discover grammar!</p>
      </div>`;return}t.innerHTML=e.grammar.map(n=>`
    <div class="card" style="padding:var(--space-lg)">
      <div class="flex items-center justify-between">
        <span style="font-size:var(--font-md);font-weight:600">${z(n.pattern_name||n.pattern)}</span>
        <span class="badge ${Pe(n)}">${n.mastery||"new"}</span>
      </div>
      ${n.pattern!==n.pattern_name?`<div class="text-muted mt-sm" style="font-size:var(--font-sm)">${z(n.pattern)}</div>`:""}
      <div class="flex gap-lg mt-sm text-secondary" style="font-size:var(--font-xs)">
        <span>Seen: ${n.times_seen||0}</span>
        <span>Correct: ${n.times_correct||0}</span>
      </div>
    </div>
  `).join("")}function Pe(t){return(t.mastery||"new")==="mastered"?"badge-pro":"badge-free"}function xt(t){try{let s=new Date(t)-new Date,i=Math.round(s/36e5);return i<0?"Now":i<24?`${i}h`:`${Math.round(i/24)}d`}catch{return t}}function z(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}async function Re(t){if(!a.isLoggedIn){t.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#9881;</div>
        <p class="mb-lg">Log in to manage your settings</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}t.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Settings</h2>

      <div class="card">
        <div class="card-title">Account</div>
        <div class="list-item">
          <div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Email</div>
            <div>${Tt(a.currentUserEmail||"Unknown")}</div>
          </div>
        </div>
        <div class="list-item">
          <div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Plan</div>
            <div>${a.userIsPro?'<span class="badge badge-pro">Pro</span>':'<span class="badge badge-free">Free</span>'}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Subscription</div>
        ${a.userIsPro?'<button class="btn btn-secondary btn-block" id="manage-sub-btn">Manage Subscription</button>':'<button class="btn btn-primary btn-block" id="upgrade-btn">Upgrade to Pro</button>'}
      </div>

      <div class="card">
        <div class="card-title">Daily Goal</div>
        <div class="flex items-center gap-lg">
          <label class="text-secondary" style="font-size:var(--font-sm)">Words per day:</label>
          <select id="daily-goal-select" style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-md) var(--space-lg);color:var(--color-text);min-height:44px">
            <option value="5"${a.DAILY_WORDS_GOAL===5?" selected":""}>5</option>
            <option value="10"${a.DAILY_WORDS_GOAL===10?" selected":""}>10</option>
            <option value="20"${a.DAILY_WORDS_GOAL===20?" selected":""}>20</option>
            <option value="30"${a.DAILY_WORDS_GOAL===30?" selected":""}>30</option>
            <option value="50"${a.DAILY_WORDS_GOAL===50?" selected":""}>50</option>
          </select>
        </div>
      </div>

      <div style="padding:var(--space-xl) 0">
        <button class="btn btn-danger btn-block" id="logout-btn">Log Out</button>
      </div>

      <div class="text-center text-muted mt-lg" style="font-size:var(--font-xs)">
        <a href="/privacy-policy.html" target="_blank">Privacy Policy</a> &middot;
        <a href="/terms-of-service.html" target="_blank">Terms of Service</a>
      </div>
    </div>`,document.getElementById("logout-btn")?.addEventListener("click",Te),document.getElementById("upgrade-btn")?.addEventListener("click",async()=>{let e=await H("/stripe/create_checkout_session",{success_url:window.location.origin+"/app/#/settings",cancel_url:window.location.origin+"/app/#/settings"});e?.url&&(window.location.href=e.url)}),document.getElementById("manage-sub-btn")?.addEventListener("click",async()=>{let e=await H("/stripe/create_portal_session",{return_url:window.location.origin+"/app/#/settings"});e?.url&&(window.location.href=e.url)}),document.getElementById("daily-goal-select")?.addEventListener("change",async e=>{let n=parseInt(e.target.value,10);a.DAILY_WORDS_GOAL=n,await H("/user/daily_goal",{daily_words_goal:n})})}function Tt(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}async function ze(t,e){let n=e[0];if(!n){t.innerHTML='<div class="page empty-state"><p>No series selected.</p></div>';return}t.innerHTML=`
    <div class="page">
      <div id="series-header"><div class="skeleton skeleton-title"></div></div>
      <div id="episode-list"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
    </div>`;let s=await M(`/catalog/episodes?webtoon_id=${encodeURIComponent(n)}`),i=s?.ok?await s.json():null;if(!i){t.innerHTML='<div class="page empty-state"><p>Failed to load episodes.</p></div>';return}let r=i.items||i.episodes||(Array.isArray(i)?i:[]),o=r[0]?.series_title||i.series_title||"Webtoon",c=document.getElementById("series-header");c&&(c.innerHTML=`
      <a href="#/catalog" class="text-secondary" style="font-size:var(--font-sm)">&larr; Back to catalog</a>
      <h2 style="font-size:var(--font-xl);margin-top:var(--space-md)">${Oe(o)}</h2>
      <p class="text-secondary mt-sm">${r.length} episode${r.length!==1?"s":""}</p>
    `);let u={};if(a.isLoggedIn){let m=await $(`/chapter_access?webtoon_id=${encodeURIComponent(n)}`);if(m?.ok){let f=await m.json();u=f.access||f||{}}}let l=document.getElementById("episode-list");if(!l)return;if(!r.length){l.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No episodes available for this series.</p>
      </div>`;return}let d=r.length>0?r[0].episode_id||r[0].id:null;l.innerHTML=r.map(m=>{let f=m.episode_id||m.id,h=f===d||u[f]?.accessible,b=!h&&!a.userIsPro;return`
      <a href="${b?"javascript:void(0)":`#/reader/${n}/${f}`}"
         class="card list-item" style="text-decoration:none;color:inherit;${b?"opacity:0.5;cursor:default":"cursor:pointer"}">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500">${Oe(m.episode_title||m.title||`Episode ${m.episode_number||f}`)}</div>
          <div class="text-muted" style="font-size:var(--font-xs);margin-top:var(--space-xs)">
            ${m.panel_count?`${m.panel_count} panels`:""}
          </div>
        </div>
        <div>
          ${b?'<span class="badge badge-free">PRO</span>':h?'<span class="text-success" style="font-size:var(--font-sm)">Free</span>':""}
        </div>
      </a>
    `}).join("")}function Oe(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}var Ge=new WeakMap;function Ue(t){return Ge.get(t)||null}function je(t,e,n){let s=document.createElement("div");s.className="panel-wrapper",s.dataset.panelHash=e.panel_hash;let i=document.createElement("img");return i.className="panel-image",i.src=`${a.API_BASE_URL}${e.image_url}`,i.alt="",i.loading="lazy",i.dataset.panelHash=e.panel_hash,s.appendChild(i),i.onload=()=>{St(s,e,n)},e.no_text_detected&&s.classList.add("no-text"),t.appendChild(s),s}function St(t,e,n){if(!e.translations||!e.image_dimensions)return;let s=e.image_dimensions.width,i=e.image_dimensions.height;if(!s||!i)return;let r=a.readerMode==="subtitles";e.translations.forEach(o=>{if(o.hidden&&!a.currentUserIsAdmin)return;let c=o.translation||{};if(!o.bounding_box)return;let[u,l,d,m]=o.bounding_box.split(",").map(Number),f=u/s*100,y=l/i*100,h=d/s*100,b=m/i*100,A=(l+m)/i*100,g=document.createElement("div");g.className="translation-hit-zone",g.style.position="absolute",g.style.left=`${f}%`,g.style.top=`${y}%`,g.style.width=`${Math.max(h,3)}%`,g.style.height=`${Math.max(b,3)}%`,g.style.zIndex="10",g.dataset.boundingBox=o.bounding_box,g.dataset.bboxBottomPct=String(A),g.dataset.panelHash=e.panel_hash,Ge.set(g,o),r?g.style.pointerEvents="none":(g.style.cursor="pointer",g.style.minWidth="44px",g.style.minHeight="44px",g.addEventListener("click",lt=>{lt.stopPropagation(),Et(t,g,o,f,y,b),n&&n(o,e.panel_hash)})),t.appendChild(g)})}var C=null;function Et(t,e,n,s,i,r){if(C){if(C.remove(),C.dataset.boundingBox===n.bounding_box){C=null;return}C=null}let o=n.translation||{},c=o.original_text||"",u=o.full_translation||"";if(!u||u==="(translation unavailable)")return;let l=document.createElement("div");l.className="translation-overlay",l.dataset.boundingBox=n.bounding_box,l.style.position="absolute",l.style.left=`${Math.max(0,s-2)}%`,l.style.top=`${i+r+1}%`,l.style.zIndex="20",l.innerHTML=`
    <div class="overlay-korean">${Ne(c)}</div>
    <div class="overlay-english">${Ne(u)}</div>
    ${o.vocab&&o.vocab.length>0?`<div class="overlay-vocab-count">${o.vocab.length} word${o.vocab.length>1?"s":""}</div>`:""}
  `;let d=m=>{!l.contains(m.target)&&!e.contains(m.target)&&(l.remove(),C=null,document.removeEventListener("click",d))};setTimeout(()=>document.addEventListener("click",d),0),t.appendChild(l),C=l}function Ne(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}var N=null,F=0,qe=!1;function Lt(t){let e=(t?.lang||"").toLowerCase(),n=(t?.name||"").toLowerCase();return e.startsWith("ko")||n.includes("korean")||n.includes("\uD55C\uAD6D")}function Fe(t){let e=0,n=(t?.name||"").toLowerCase(),s=(t?.lang||"").toLowerCase();return s==="ko-kr"&&(e+=100),s.startsWith("ko")&&(e+=50),t?.localService&&(e+=30),n.includes("yuna")&&(e+=20),n.includes("yuri")&&(e+=20),n.includes("sora")&&(e+=20),n.includes("compact")&&(e-=30),e}function kt(t){let e=t.filter(Lt);return e.length?(e.sort((n,s)=>Fe(s)-Fe(n)),e[0]):null}async function It(t=2500){let e=window.speechSynthesis,n=e.getVoices()||[];return n.length?n:new Promise(s=>{let i=!1,r=l=>{i||(i=!0,s(l))},o=()=>{let l=e.getVoices()||[];l.length&&(e.removeEventListener("voiceschanged",o),r(l))};e.addEventListener("voiceschanged",o);let c=Date.now(),u=setInterval(()=>{let l=e.getVoices()||[];(l.length||Date.now()-c>t)&&(clearInterval(u),e.removeEventListener("voiceschanged",o),r(l))},100)})}async function ie(){if(N)return N;if(!window.speechSynthesis){a.TTS_READY=!1;return}return N=(async()=>{try{a.TTS_VOICES=await It(),a.TTS_SELECTED_VOICE=kt(a.TTS_VOICES),a.TTS_READY=!!a.TTS_SELECTED_VOICE}catch{a.TTS_READY=!1}finally{N=null}})(),N}function We(){if(!(qe||!window.speechSynthesis))try{let t=new SpeechSynthesisUtterance("");t.volume=0,t.lang="ko-KR",window.speechSynthesis.speak(t),qe=!0}catch{}}function $t(t){let e=(t||"").length,n=a.TTS_SPEED;return n==="slow"?e<=10?.45:e<=25?.4:.35:n==="fast"?e<=10?1:.95:e<=10?.65:e<=25?.6:.55}function At(){F++;try{(window.speechSynthesis.speaking||window.speechSynthesis.pending)&&window.speechSynthesis.cancel()}catch{}a.TTS_IS_SPEAKING=!1}function ae(t){if(!t||!window.speechSynthesis)return!1;let e=Date.now();if(e-a.TTS_LAST_REQUEST<300)return!1;if(a.TTS_LAST_REQUEST=e,!a.TTS_READY)return ie().then(()=>{a.TTS_SELECTED_VOICE&&ae(t)}),!1;if(!a.TTS_SELECTED_VOICE)return!1;At();let n=F,s=window.speechSynthesis,i=t.replace(/[ㅋ]{2,}/g,"").replace(/[ㅎ]{2,}/g,"").replace(/[ㅠㅜ]{2,}/g,"").replace(/~+/g,"").trim();if(!i)return!1;let r=new SpeechSynthesisUtterance(i);return r.voice=a.TTS_SELECTED_VOICE,r.lang="ko-KR",r.rate=$t(i),r.volume=.9,a.TTS_IS_SPEAKING=!0,r.onend=()=>{n===F&&(a.TTS_IS_SPEAKING=!1)},r.onerror=()=>{n===F&&(a.TTS_IS_SPEAKING=!1)},s.speak(r),!0}var p=null,G=-1;function re(){return p||(p=document.createElement("div"),p.className="hidden",p.id="pwa-subtitle-bar",p.innerHTML=`
    <div class="subtitle-layout">
      <div class="sub-nav sub-nav-prev" aria-label="Previous">&lsaquo;</div>
      <div class="sub-center">
        <div class="sub-detail"></div>
        <div class="sub-direct"></div>
        <div class="sub-full"></div>
      </div>
      <div class="sub-audio-btn" aria-label="Listen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      </div>
      <div class="sub-nav sub-nav-next" aria-label="Next">&rsaquo;</div>
    </div>
  `,p.querySelector(".sub-nav-prev")?.addEventListener("click",()=>Ve(-1)),p.querySelector(".sub-nav-next")?.addEventListener("click",()=>Ve(1)),p.querySelector(".sub-audio-btn")?.addEventListener("click",Ct),p.addEventListener("click",()=>We(),{once:!0}),document.body.appendChild(p),p)}function W(t,e){p||re();let n=t?.translation||{},s=n.original_text||"",i=n.full_translation||"";if(!s&&!i)return;G=-1;let r=p.querySelector(".sub-direct");r&&(r.innerHTML=Mt(n),Ht(r,n));let o=p.querySelector(".sub-full");o&&(o.textContent=i);let c=p.querySelector(".sub-detail");c&&(c.innerHTML="",c.classList.remove("visible")),p.classList.remove("hidden")}function Mt(t){let e=t.vocab;if(!Array.isArray(e)||!e.length){let n=t.original_text||"";return`<span class="vocab-word-korean" style="font-size:var(--font-md)">${E(n)}</span>`}return e.filter(n=>n.word&&!Ye(n.surface_form||n.word)).filter(n=>!n.hidden||a.currentUserIsAdmin).map((n,s)=>{let i=n.surface_form||n.word,r=n.word,c=i!==r?`${i} (${r})`:i,u=n.meaning||n.part_of_speech||"";return`<span class="vocab-word" data-vocab-idx="${s}">
        <span class="vocab-word-korean">${E(c)}</span>
        ${u?`<span class="vocab-word-meaning">${E(u)}</span>`:""}
      </span>`}).join("")}function Ht(t,e){t.querySelectorAll(".vocab-word").forEach(n=>{n.addEventListener("click",s=>{s.stopPropagation();let i=parseInt(n.dataset.vocabIdx,10);Dt(i,e)})})}function Ye(t){return/^[\s.,!?;:…·\-—–''""「」『』()\[\]{}。、！？]+$/.test(t||"")}function Dt(t,e){let n=p?.querySelector(".sub-detail"),s=p?.querySelector(".sub-direct");if(!n||!s)return;if(G===t){G=-1,n.innerHTML="",n.classList.remove("visible"),s.querySelectorAll(".vocab-word").forEach(d=>d.classList.remove("vocab-selected"));return}G=t,s.querySelectorAll(".vocab-word").forEach((d,m)=>{d.classList.toggle("vocab-selected",parseInt(d.dataset.vocabIdx,10)===t)});let i=e.vocab;if(!Array.isArray(i))return;let o=i.filter(d=>d.word&&!Ye(d.surface_form||d.word)).filter(d=>!d.hidden||a.currentUserIsAdmin)[t];if(!o)return;let c=[];o.romanization&&c.push(`<span class="sub-detail-pill romanization">${E(o.romanization)}</span>`),o.part_of_speech&&c.push(`<span class="sub-detail-pill">${E(o.part_of_speech)}</span>`),o.krdict_found&&c.push('<span class="sub-detail-pill">KRDICT</span>');let u=e.grammar_patterns||[],l=u.filter(d=>d.surface_form===(o.surface_form||o.word)||d.surface_form===o.word);l.forEach(d=>{c.push(`<span class="sub-detail-pill grammar">${E(d.pattern)} \u2014 ${E(d.explanation||"")}</span>`)}),!l.length&&u.length&&u.slice(0,2).forEach(d=>{c.push(`<span class="sub-detail-pill grammar">${E(d.pattern)} \u2014 ${E(d.explanation||"")}</span>`)}),n.innerHTML=c.join(""),n.classList.add("visible")}function Ct(t){t.stopPropagation();let e=a.currentSubtitleIndex;if(e<0||e>=a.allTranslationBoxes.length)return;let i=(a.allTranslationBoxes[e]?.translation?.translation||{}).original_text||"";i&&ae(i)}function Ve(t){let e=a.allTranslationBoxes;if(!e.length)return;let n=a.currentSubtitleIndex+t;if(n<0&&(n=0),n>=e.length&&(n=e.length-1),n===a.currentSubtitleIndex)return;a.currentSubtitleIndex=n;let s=e[n];if(W(s.translation,s.panelHash),s.element){a.navScrolling=!0;let i=s.element.getBoundingClientRect(),r=p?p.offsetHeight:80,c=window.innerHeight-r-56-20,u=window.scrollY+i.bottom-c;window.scrollTo({top:Math.max(0,u),behavior:"smooth"}),setTimeout(()=>{a.navScrolling=!1},600)}}function Ke(){p&&(p.remove(),p=null),G=-1}function Qe(){return p?p.offsetHeight:0}function E(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}var V=null,L=null;async function Xe(t,e){let n=e[0],s=e[1];if(!n||!s){t.innerHTML='<div class="page empty-state"><p>Missing webtoon or episode ID.</p></div>';return}a.readerMode=a.currentUserIsAdmin?"boxes":"subtitles",a.currentSubtitleIndex=-1,a.allTranslationBoxes=[],a.panelsSeen=0,a.practiceCTADismissed=!1,t.innerHTML=`
    <div class="page">
      <div id="reader-header">
        <a href="#/series/${n}" class="text-secondary" style="font-size:var(--font-sm)">&larr; Back to episodes</a>
      </div>
      <div id="reader-panels" class="${a.readerMode==="subtitles"?"subtitle-mode":""}" style="margin-top:var(--space-lg)">
        <div class="skeleton skeleton-card" style="height:300px"></div>
        <div class="skeleton skeleton-card" style="height:300px"></div>
      </div>
      <div id="reader-footer" class="text-center mt-xl"></div>
    </div>`,a.readerMode==="subtitles"&&(re(),ie());let r=await(a.isLoggedIn?$:M)(`/pwa/episode_panels?webtoon_id=${encodeURIComponent(n)}&episode_id=${encodeURIComponent(s)}`);if(!r||!r.ok){let d=document.getElementById("reader-panels");d&&(r?.status===401||r?.status===403?(d.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">&#128274;</div>
            <p class="mb-lg">Log in to read this chapter</p>
            <button class="btn btn-primary" id="reader-login-btn">Continue with Google</button>
          </div>`,document.getElementById("reader-login-btn")?.addEventListener("click",w)):r?.status===404?d.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">&#128218;</div>
            <p>No panels found for this episode.</p>
            <p class="text-muted mt-md" style="font-size:var(--font-sm)">This episode may not have been processed yet. Try reading it with the browser extension first.</p>
          </div>`:d.innerHTML='<div class="empty-state"><p>Failed to load panels. Please try again.</p></div>');return}let c=(await r.json()).panels||[],u=document.getElementById("reader-panels");if(!u)return;if(u.innerHTML="",!c.length){u.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No panels available.</p>
      </div>`;return}c.forEach(d=>{je(u,d,a.readerMode==="boxes"?Gt:null)}),a.readerMode==="subtitles"&&setTimeout(()=>{if(Bt(u),Pt(),a.allTranslationBoxes.length>0){a.currentSubtitleIndex=0;let d=a.allTranslationBoxes[0];W(d.translation,d.panelHash)}},500);let l=document.getElementById("reader-footer");return l&&(l.innerHTML=`
      <div class="card">
        <div class="card-title">Chapter Complete</div>
        <p class="text-secondary mb-lg" style="font-size:var(--font-sm)">${c.length} panels read</p>
        <a href="#/series/${n}" class="btn btn-secondary btn-block">Back to Episodes</a>
      </div>`),a.isLoggedIn&&_(`/update_panel_progress?webtoon_id=${encodeURIComponent(n)}&episode_id=${encodeURIComponent(s)}`).catch(()=>{}),()=>{Rt(),Ke(),oe(),a.allTranslationBoxes=[],a.currentSubtitleIndex=-1}}function Bt(t){let e=t.querySelectorAll(".translation-hit-zone"),n=[];e.forEach(s=>{let i=Ue(s);if(!i)return;let r=i.translation||{};!r.original_text&&!r.full_translation||n.push({element:s,translation:i,panelHash:s.dataset.panelHash})}),a.allTranslationBoxes=n}var U=null;function Pt(){let t=!1;U=()=>{t||(t=!0,V=requestAnimationFrame(()=>{t=!1,Ot()}))},window.addEventListener("scroll",U,{passive:!0})}function Rt(){U&&(window.removeEventListener("scroll",U),U=null),V&&(cancelAnimationFrame(V),V=null)}function Ot(){if(a.navScrolling||a.readerMode!=="subtitles")return;let t=a.allTranslationBoxes;if(!t.length)return;let e=Qe()||80,s=window.innerHeight-e-56,i=-1,r=1/0;for(let o=0;o<t.length;o++){let c=t[o].element;if(!c)continue;let l=c.getBoundingClientRect().bottom;if(l>0&&l<s+60){let d=Math.abs(l-(s-20));d<r&&(r=d,i=o)}}if(i===-1)for(let o=0;o<t.length;o++){let c=t[o].element?.getBoundingClientRect();if(c&&c.bottom>0&&c.top<window.innerHeight){i=o;break}}if(i>=0&&i!==a.currentSubtitleIndex){a.currentSubtitleIndex=i;let o=t[i];W(o.translation,o.panelHash),zt(i)}}function zt(t){if(a.practiceCTADismissed||!a.isLoggedIn)return;let e=new Set;for(let n=0;n<=t;n++)e.add(a.allTranslationBoxes[n]?.panelHash);a.panelsSeen=e.size,a.panelsSeen>=5&&!L&&Nt()}function Nt(){L||(L=document.createElement("div"),L.className="practice-cta",L.innerHTML=`
    <button id="practice-cta-btn">Practice these words</button>
    <button class="dismiss-btn" id="practice-cta-dismiss">Not now</button>
  `,document.body.appendChild(L),document.getElementById("practice-cta-btn")?.addEventListener("click",()=>{oe(),window.location.hash="#/practice"}),document.getElementById("practice-cta-dismiss")?.addEventListener("click",()=>{a.practiceCTADismissed=!0,oe()}))}function oe(){L&&(L.remove(),L=null)}function Gt(t,e){}function x(t,e="info"){let n=document.getElementById("toast-container");if(!n)return;let s=document.createElement("div");s.className=`toast ${e}`,s.textContent=t,n.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity 0.25s",setTimeout(()=>s.remove(),250)},3e3)}var Ut="mandubun";var j=null,Ze=!1,B={};function jt(){return new Promise((t,e)=>{let n=indexedDB.open(Ut,1);n.onupgradeneeded=()=>{let s=n.result;s.objectStoreNames.contains("kv")||s.createObjectStore("kv")},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}async function qt(){try{j=await jt(),Ze=!0}catch(t){console.warn("IndexedDB unavailable, falling back to localStorage only",t),Ze=!1}}qt();function Ft(t){return j?new Promise(e=>{try{let s=j.transaction("kv","readonly").objectStore("kv").get(t);s.onsuccess=()=>e(s.result),s.onerror=()=>e(void 0)}catch{e(void 0)}}):Promise.resolve(void 0)}function Wt(t,e){return j?new Promise(n=>{try{let s=j.transaction("kv","readwrite");s.objectStore("kv").put(e,t),s.oncomplete=()=>n(),s.onerror=()=>n()}catch{n()}}):Promise.resolve()}function Vt(t){if(t in B)return B[t];try{let e=localStorage.getItem(t);if(e!==null)try{return JSON.parse(e)}catch{return e}}catch{}}async function ce(t){if(t in B)return B[t];let e=await Ft(t);return e!==void 0?(B[t]=e,e):Vt(t)}function le(t,e){B[t]=e;try{localStorage.setItem(t,typeof e=="string"?e:JSON.stringify(e))}catch{}Wt(t,e)}var Yt="mandubun-offline",Kt=1,T="pending_queue",Qt=200,Xt=10080*60*1e3,Y=null;async function K(){return Y||new Promise((t,e)=>{let n=indexedDB.open(Yt,Kt);n.onupgradeneeded=()=>{let s=n.result;s.objectStoreNames.contains(T)||s.createObjectStore(T,{keyPath:"id",autoIncrement:!0})},n.onsuccess=()=>{Y=n.result,t(Y)},n.onerror=()=>e(n.error)})}async function ue(t,e){try{let s=(await K()).transaction(T,"readwrite"),i=s.objectStore(T),r=i.count();if(await new Promise(o=>{r.onsuccess=o}),r.result>=Qt){console.warn("Offline queue full, dropping oldest entry");let o=i.openCursor();await new Promise(c=>{o.onsuccess=()=>{o.result&&o.result.delete(),c()}})}i.add({endpoint:t,body:e,timestamp:Date.now()}),await new Promise((o,c)=>{s.oncomplete=o,s.onerror=()=>c(s.error)})}catch(n){console.warn("Failed to queue offline update:",n)}}async function me(){try{let s=(await K()).transaction(T,"readonly").objectStore(T).getAll();await new Promise(u=>{s.onsuccess=u});let i=s.result||[];if(i.length===0)return 0;let r=Date.now(),o=0,c=0;for(let u of i){if(r-u.timestamp>Xt){await de(u.id),c++;continue}try{let l=await $(u.endpoint,{method:"POST",body:JSON.stringify(u.body)});l&&(l.ok||l.status===409)?(await de(u.id),o++):l&&l.status>=400&&l.status<500&&(await de(u.id),o++)}catch(l){console.warn("Flush interrupted (network):",l);break}}return c>0&&console.log(`Expired ${c} queued updates`),o>0&&console.log(`Flushed ${o} queued updates`),o}catch(t){return console.warn("Failed to flush offline queue:",t),0}}async function de(t){try{let n=(await K()).transaction(T,"readwrite");n.objectStore(T).delete(t),await new Promise(s=>{n.oncomplete=s})}catch{}}async function Je(){try{let n=(await K()).transaction(T,"readonly").objectStore(T).count();return await new Promise(s=>{n.onsuccess=s}),n.result}catch{return 0}}function et(){window.addEventListener("online",async()=>{let t=await me();t>0&&console.log(`Synced ${t} practice results`)})}var v=null;function tt(){return v}function nt(){return v!==null&&v.currentIndex<v.exercises.length}async function pe(t="blended"){let e=[],n=[];if(a.isOnline){let[i,r]=await Promise.all([_("/vocab_due_for_review"),_("/grammar_due_for_review")]);e=i?.vocab||[],n=r?.grammar||[],(e.length>0||n.length>0)&&(le("offline_vocab_due",e),le("offline_grammar_due",n))}else e=await ce("offline_vocab_due")||[],n=await ce("offline_grammar_due")||[];if(e.length===0&&n.length===0)return{error:"no_items",message:"Nothing due for review right now!"};let s=Zt(e,n,t);return v={mode:t,exercises:s,currentIndex:0,correctCount:0,totalAnswered:0,startTime:Date.now(),results:[]},a.blendedPracticeModeActive=!0,{session:v}}function Zt(t,e,n){let s=[],i=nn(),r=[];return t.forEach(c=>{r.push({type:"vocab",item:c})}),e.forEach(c=>{r.push({type:"grammar",item:c})}),it(r),r.slice(0,i).forEach(c=>{if(c.type==="vocab"){let u=Jt(c.item,n);s.push({type:u,category:"vocab",item:c.item,distractors:[]})}else s.push({type:"grammar_fill",category:"grammar",item:c.item,distractors:[]})}),s.forEach(c=>{(c.type==="vocab_choice"||c.type==="grammar_fill")&&(c.distractors=en(c,r))}),s}function Jt(t,e){let n=["vocab_choice","vocab_type"];return a.TTS_READY&&n.push("listening"),a.practiceDifficulty==="beginner"&&n.push("vocab_choice"),a.practiceDifficulty==="advanced"&&n.push("vocab_type"),n[Math.floor(Math.random()*n.length)]}function en(t,e){let n=t.category==="vocab"?t.item.meaning||t.item.definition||"":t.item.pattern_name||t.item.pattern||"",s=e.filter(i=>i.type===t.category).map(i=>i.type==="vocab"?i.item.meaning||i.item.definition||"":i.item.pattern_name||i.item.pattern||"").filter(i=>i&&i!==n);return it(s),s.slice(0,3)}async function st(t,e,n,s){if(!v||t>=v.exercises.length)return;let i=v.exercises[t],r=e===n;return v.results.push({exercise:i,answer:e,correct:n,isCorrect:r,responseTimeMs:s}),v.totalAnswered++,r&&v.correctCount++,v.currentIndex++,tn(i,r,s),r}async function tn(t,e,n){if(t.category==="vocab"){let s=t.item.surface_form||t.item.word||t.item.vocab_word,i=t.item.source_panel_hash||"review",r={word:s.normalize("NFC"),panel_hash:i,mode:t.type,correct:e,response_time_ms:n};a.isOnline?ee(()=>H("/update_vocab_progress",r)):ue("/update_vocab_progress",r)}else if(t.category==="grammar"){let s={pattern:t.item.pattern||t.item.pattern_name,correct:e,response_time_ms:n};a.isOnline?ee(()=>H("/update_grammar_progress",s)):ue("/update_grammar_progress",s)}}function fe(){if(!v)return null;let t={totalExercises:v.exercises.length,totalAnswered:v.totalAnswered,correctCount:v.correctCount,accuracy:v.totalAnswered>0?Math.round(v.correctCount/v.totalAnswered*100):0,durationMs:Date.now()-v.startTime,results:v.results};return v=null,a.blendedPracticeModeActive=!1,t}function nn(){return a.practiceDifficulty==="beginner"?8:a.practiceDifficulty==="intermediate"?12:15}function it(t){for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function ve(t,e,n){let s=e.item,i=s.surface_form||s.word||s.vocab_word||"",r=s.meaning||s.definition||"",o=s.romanization||"",c=[r,...e.distractors].filter(Boolean);ge(c);let u=Date.now();t.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-word">${k(i)}</div>
        ${o?`<div class="exercise-romanization">${k(o)}</div>`:""}
        <div class="exercise-instruction">What does this word mean?</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${c.map((d,m)=>`
          <button class="exercise-option" data-index="${m}" data-value="${he(d)}">
            ${k(d)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let l=document.getElementById("exercise-options");l?.addEventListener("click",d=>{let m=d.target.closest(".exercise-option");if(!m||m.disabled)return;let f=m.dataset.value,y=Date.now()-u,h=f===r;l.querySelectorAll(".exercise-option").forEach(b=>{b.disabled=!0,b.dataset.value===r&&b.classList.add("correct"),b===m&&!h&&b.classList.add("incorrect")}),Q(t,h,i,r),setTimeout(()=>n(f,r,y),1200)})}function at(t,e,n){let s=e.item,i=s.surface_form||s.word||s.vocab_word||"",r=s.meaning||s.definition||"",o=s.romanization||"",c=Date.now();t.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-word">${k(i)}</div>
        ${o?`<div class="exercise-romanization">${k(o)}</div>`:""}
        <div class="exercise-instruction">Type the English meaning</div>
      </div>
      <div class="exercise-input-group">
        <input type="text" id="type-answer" class="exercise-input" autocomplete="off" inputmode="text" placeholder="Type your answer...">
        <button class="btn btn-primary" id="type-submit">Check</button>
      </div>
    </div>
  `;let u=document.getElementById("type-answer"),l=document.getElementById("type-submit");u?.focus();function d(){let m=(u?.value||"").trim();if(!m)return;let f=Date.now()-c,y=sn(m,r);u.disabled=!0,l.disabled=!0,u.classList.add(y?"correct":"incorrect"),Q(t,y,i,r),setTimeout(()=>n(m,r,f),1200)}l?.addEventListener("click",d),u?.addEventListener("keydown",m=>{m.key==="Enter"&&d()})}function sn(t,e){let n=s=>s.toLowerCase().trim().replace(/[^a-z0-9\s]/g,"");return n(t)===n(e)}function rt(t,e,n){let s=e.item,i=s.surface_form||s.word||s.vocab_word||"",r=s.meaning||s.definition||"",o=[r,...e.distractors].filter(Boolean);ge(o);let c=Date.now();t.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <button class="btn btn-secondary exercise-listen-btn" id="listen-btn">
          &#128266; Listen
        </button>
        <div class="exercise-instruction">What word did you hear?</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${o.map((m,f)=>`
          <button class="exercise-option" data-index="${f}" data-value="${he(m)}">
            ${k(m)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let u=document.getElementById("listen-btn");function l(){try{let m=new SpeechSynthesisUtterance(i);m.lang="ko-KR",m.rate=.9,speechSynthesis.speak(m)}catch{x("Audio not available","error")}}u?.addEventListener("click",l),setTimeout(l,300);let d=document.getElementById("exercise-options");d?.addEventListener("click",m=>{let f=m.target.closest(".exercise-option");if(!f||f.disabled)return;let y=f.dataset.value,h=Date.now()-c,b=y===r;d.querySelectorAll(".exercise-option").forEach(A=>{A.disabled=!0,A.dataset.value===r&&A.classList.add("correct"),A===f&&!b&&A.classList.add("incorrect")}),Q(t,b,i,r),setTimeout(()=>n(y,r,h),1200)})}function ot(t,e,n){let s=e.item,i=s.pattern_name||s.pattern||"",r=s.pattern||i,o=[r,...e.distractors].filter(Boolean);ge(o);let c=Date.now();t.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-instruction">Which grammar pattern fits?</div>
        <div class="exercise-word">${k(i)}</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${o.map((l,d)=>`
          <button class="exercise-option" data-index="${d}" data-value="${he(l)}">
            ${k(l)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let u=document.getElementById("exercise-options");u?.addEventListener("click",l=>{let d=l.target.closest(".exercise-option");if(!d||d.disabled)return;let m=d.dataset.value,f=Date.now()-c,y=m===r;u.querySelectorAll(".exercise-option").forEach(h=>{h.disabled=!0,h.dataset.value===r&&h.classList.add("correct"),h===d&&!y&&h.classList.add("incorrect")}),Q(t,y,i,r),setTimeout(()=>n(m,r,f),1200)})}function Q(t,e,n,s){let i=t.querySelector(".exercise-feedback");i&&i.remove();let r=document.createElement("div");r.className=`exercise-feedback ${e?"correct":"incorrect"}`,r.innerHTML=e?'<span class="feedback-icon">&#10003;</span> Correct!':`<span class="feedback-icon">&#10007;</span> ${k(s)}`,t.querySelector(".exercise-card")?.appendChild(r)}function ge(t){for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}function k(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}function he(t){return t?t.replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}async function ct(t){if(!a.isLoggedIn){t.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p class="mb-lg">Log in to practice</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}if(nt()){t.innerHTML='<div class="page" id="practice-container"></div>',X();return}t.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Practice</h2>

      <div class="card">
        <div class="card-title">Review Due Items</div>
        <p class="text-secondary mb-lg" style="font-size:var(--font-sm)">
          Practice words and grammar patterns due for review using spaced repetition.
        </p>
        <button class="btn btn-primary btn-block" id="start-practice-btn">Start Practice Session</button>
      </div>

      <div class="card">
        <div class="card-title">Settings</div>
        <div class="flex items-center justify-between mb-md">
          <label class="text-secondary" style="font-size:var(--font-sm)">Difficulty</label>
          <select id="difficulty-select" style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-md) var(--space-lg);color:var(--color-text);min-height:44px">
            <option value="beginner"${a.practiceDifficulty==="beginner"?" selected":""}>Beginner (8 exercises)</option>
            <option value="intermediate"${a.practiceDifficulty==="intermediate"?" selected":""}>Intermediate (12 exercises)</option>
            <option value="advanced"${a.practiceDifficulty==="advanced"?" selected":""}>Advanced (15 exercises)</option>
          </select>
        </div>
      </div>
    </div>`,document.getElementById("difficulty-select")?.addEventListener("change",e=>{a.practiceDifficulty=e.target.value}),document.getElementById("start-practice-btn")?.addEventListener("click",async()=>{let e=document.getElementById("start-practice-btn");e&&(e.disabled=!0,e.textContent="Loading...");let n=await pe("blended");if(n.error){x(n.message,"info"),e&&(e.disabled=!1,e.textContent="Start Practice Session");return}t.innerHTML='<div class="page" id="practice-container"></div>',X()})}function X(){let t=document.getElementById("practice-container");if(!t)return;let e=tt();if(!e||e.currentIndex>=e.exercises.length){an(t);return}let n=e.exercises[e.currentIndex],s={current:e.currentIndex+1,total:e.exercises.length,correct:e.correctCount};t.innerHTML=`
    <div class="practice-progress">
      <div class="flex items-center justify-between mb-md">
        <button class="btn btn-secondary" id="exit-practice" style="font-size:var(--font-sm);padding:var(--space-sm) var(--space-md)">Exit</button>
        <span class="text-secondary" style="font-size:var(--font-sm)">${s.current} / ${s.total}</span>
        <span class="text-success" style="font-size:var(--font-sm)">${s.correct} correct</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${s.current/s.total*100}%"></div>
      </div>
    </div>
    <div id="exercise-area" style="margin-top:var(--space-2xl)"></div>
  `,document.getElementById("exit-practice")?.addEventListener("click",()=>{confirm("Exit practice? Your progress so far is saved.")&&(fe(),window.location.hash="#/learn")});let i=document.getElementById("exercise-area");if(!i)return;let r=(o,c,u)=>{st(e.currentIndex,o,c,u),X()};switch(n.type){case"vocab_choice":ve(i,n,r);break;case"vocab_type":at(i,n,r);break;case"listening":rt(i,n,r);break;case"grammar_fill":ot(i,n,r);break;default:ve(i,n,r)}}function an(t){let e=fe();if(!e){t.innerHTML='<div class="empty-state"><p>No session data.</p></div>';return}let n=e.accuracy,s=Math.round(e.durationMs/1e3),i=Math.floor(s/60),r=s%60;t.innerHTML=`
    <div style="text-align:center;padding:var(--space-3xl) 0">
      <div style="font-size:48px;margin-bottom:var(--space-xl)">${n>=80?"&#127881;":n>=50?"&#128170;":"&#128218;"}</div>
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Session Complete!</h2>

      <div class="card">
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value ${n>=80?"text-success":n>=50?"text-warning":"text-danger"}">${n}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${e.correctCount}/${e.totalAnswered}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${i>0?`${i}m ${r}s`:`${r}s`}</div>
            <div class="stat-label">Time</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-md mt-xl">
        <button class="btn btn-primary btn-block" id="practice-again-btn">Practice Again</button>
        <a href="#/learn" class="btn btn-secondary btn-block">Back to Learning Hub</a>
      </div>
    </div>
  `,document.getElementById("practice-again-btn")?.addEventListener("click",async()=>{let o=await pe("blended");if(o.error){x(o.message,"info");return}X()})}async function rn(){if("serviceWorker"in navigator)try{let t=await navigator.serviceWorker.register("/app/sw.js",{scope:"/app/"});t.addEventListener("updatefound",()=>{let e=t.installing;e&&e.addEventListener("statechange",()=>{e.state==="activated"&&navigator.serviceWorker.controller&&x("Update available. Tap to refresh.","info")})})}catch(t){console.warn("SW registration failed:",t)}}function on(){let t=document.getElementById("offline-banner");function e(){a.isOnline=navigator.onLine,t&&t.classList.toggle("hidden",a.isOnline)}window.addEventListener("online",async()=>{e();let n=await Je();if(n>0){x(`Back online. Syncing ${n} practice results...`,"success");let s=await me();s>0&&x(`Synced ${s} results`,"success")}else x("Back online","success")}),window.addEventListener("offline",()=>{e()}),e()}function cn(){let t=document.getElementById("header-auth");t&&(a.isLoggedIn?(t.innerHTML=`
      <button id="header-logout-btn" style="font-size:var(--font-sm);color:var(--color-text-secondary);min-height:44px;padding:0 var(--space-md)">
        ${dn(a.currentUserEmail||"Account")}
      </button>`,document.getElementById("header-logout-btn")?.addEventListener("click",()=>{window.location.hash="#/settings"})):(t.innerHTML=`
      <button id="header-login-btn" class="btn btn-primary" style="font-size:var(--font-sm);padding:var(--space-md) var(--space-lg)">
        Log In
      </button>`,document.getElementById("header-login-btn")?.addEventListener("click",w)))}async function ln(){I("/",Me),I("/catalog",De),I("/learn",Ce),I("/settings",Re),I("/series",ze),I("/reader",Xe),I("/practice",ct),await xe(),cn(),Le(),rn(),on(),et()}function dn(t){if(!t)return"";let e=document.createElement("div");return e.textContent=t,e.innerHTML}ln().catch(t=>{console.error("App init failed:",t)});})();
