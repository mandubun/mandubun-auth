(()=>{var o={API_BASE_URL:"https://api.mandubun.com",currentUserId:null,currentUserEmail:null,currentUserIsAdmin:!1,isLoggedIn:!1,_refreshingToken:null,userXP:0,userLevel:1,userStreak:0,dailyWordsPracticed:0,DAILY_WORDS_GOAL:10,_cachedDueCount:0,_cachedVocabDue:0,_cachedGrammarDue:0,_cachedOverviewData:null,userIsPro:!1,TTS_READY:!1,TTS_VOICES:[],TTS_SELECTED_VOICE:null,TTS_IS_SPEAKING:!1,TTS_SPEED:"medium",TTS_LAST_REQUEST:0,SPEECH_READY:!1,SPEECH_SUPPORTED:!1,SPEECH_IS_LISTENING:!1,currentMode:"browse",practiceDifficulty:"beginner",practiceFocus:"all",blendedPracticeModeActive:!1,activeBlendedPanelHash:null,blendedSession:null,currentWebtoonId:null,currentEpisodeId:null,isOnline:navigator.onLine,currentPage:"home"};var q="https://jwlylgrtaevgjujstvvg.supabase.co",me="sb_publishable_is4EfIvydGz5COHFX6XKrA_h39lvOZv";function pe(){try{return{accessToken:localStorage.getItem("auth_token"),refreshToken:localStorage.getItem("refresh_token"),expiresAt:parseInt(localStorage.getItem("expires_at")||"0",10),email:localStorage.getItem("user_email")}}catch{return{accessToken:null,refreshToken:null,expiresAt:0,email:null}}}function ve(e,t,n,s){try{localStorage.setItem("auth_token",e),localStorage.setItem("refresh_token",t),localStorage.setItem("expires_at",String(n)),s&&localStorage.setItem("user_email",s)}catch(i){console.error("Failed to store tokens:",i)}}function fe(){try{localStorage.removeItem("auth_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("expires_at"),localStorage.removeItem("user_email")}catch{}}async function et(e){let t=await fetch(`${q}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{"Content-Type":"application/json",apikey:me},body:JSON.stringify({refresh_token:e})});if(!t.ok)throw new Error(`Token refresh failed: ${t.status}`);let n=await t.json();return{accessToken:n.access_token,refreshToken:n.refresh_token,expiresAt:Math.floor(Date.now()/1e3)+(n.expires_in||3600),email:n.user?.email}}async function V(){let e=pe();if(!e.accessToken)return null;let t=Math.floor(Date.now()/1e3);return e.expiresAt-t<300?e.refreshToken?o._refreshingToken?o._refreshingToken:(o._refreshingToken=(async()=>{try{let n=await et(e.refreshToken);return ve(n.accessToken,n.refreshToken,n.expiresAt,n.email),n.accessToken}catch{return H(),null}finally{o._refreshingToken=null}})(),o._refreshingToken):(H(),null):e.accessToken}function w(){let e=window.location.origin+"/app/",t=`${q}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(e)}`;window.location.href=t}function tt(){let e=window.location.hash;if(!e||!e.includes("access_token"))return!1;let t=new URLSearchParams(e.substring(1)),n=t.get("access_token"),s=t.get("refresh_token"),i=parseInt(t.get("expires_in")||"3600",10);if(!n)return!1;let a=Math.floor(Date.now()/1e3)+i;return ve(n,s,a,null),history.replaceState(null,"",window.location.pathname),nt(n),!0}async function nt(e){try{let t=await fetch(`${q}/auth/v1/user`,{headers:{Authorization:`Bearer ${e}`,apikey:me}});if(t.ok){let n=await t.json();n.email&&(localStorage.setItem("user_email",n.email),o.currentUserEmail=n.email)}}catch{}}async function ge(){if(tt())return o.isLoggedIn=!0,!0;if(await V()){let t=pe();return o.currentUserEmail=t.email,o.isLoggedIn=!0,!0}return o.isLoggedIn=!1,!1}function be(){fe(),o.isLoggedIn=!1,o.currentUserId=null,o.currentUserEmail=null,o.currentUserIsAdmin=!1,o.userIsPro=!1,window.location.hash="#/"}function H(){fe(),o.isLoggedIn=!1,o.currentUserId=null,o.currentUserEmail=null,window.location.hash="#/"}var B={},N=null,he=null;function $(e,t){B[e]=t}function st(){let t=(window.location.hash.slice(1)||"/").split("/").filter(Boolean),n=t.length===0?"/":`/${t[0]}`,s=t.slice(1);return{path:n,params:s}}function it(e){return B[e]?{handler:B[e],path:e}:B["/"]?{handler:B["/"],path:"/"}:null}async function ye(){let{path:e,params:t}=st();if(he===e)return;if(N){try{N()}catch{}N=null}let n=document.getElementById("app-root");if(!n)return;let s=it(e);if(!s){n.innerHTML='<div class="page empty-state"><div class="empty-state-icon">404</div><p>Page not found</p></div>';return}he=e,document.querySelectorAll("#bottom-nav .nav-item").forEach(i=>{let r=(i.getAttribute("href")||"").replace("#","")||"/";i.classList.toggle("active",r===e)});try{N=await s.handler(n,t)}catch(i){console.error(`Route error (${e}):`,i),n.innerHTML='<div class="page empty-state"><p>Something went wrong. Please try again.</p></div>'}}function we(){window.addEventListener("hashchange",ye),ye()}var xe=1e4;function _e(e){return`${o.API_BASE_URL}${e.startsWith("/")?e:`/${e}`}`}async function I(e,t={}){let n=await V();if(!n)return H(),null;let s=_e(e),i={"Content-Type":"application/json",Authorization:`Bearer ${n}`,"X-Timezone":Intl.DateTimeFormat().resolvedOptions().timeZone,...t.headers||{}};try{let a=new AbortController,r=setTimeout(()=>a.abort(),xe),c=await fetch(s,{...t,headers:i,signal:a.signal});return clearTimeout(r),c.status===401?(H(),null):c}catch(a){return a.name==="AbortError"?console.warn(`Request timed out: ${e}`):console.warn(`Fetch error: ${e}`,a),null}}async function C(e,t={}){let n=_e(e);try{let s=new AbortController,i=setTimeout(()=>s.abort(),xe),a=await fetch(n,{...t,headers:{"Content-Type":"application/json",...t.headers||{}},signal:s.signal});return clearTimeout(i),a}catch(s){return console.warn(`Anon fetch error: ${e}`,s),null}}async function Y(e,t=3){for(let n=0;n<=t;n++){try{let s=await e();if(s&&s.status!==503)return s}catch{}n<t&&await new Promise(s=>setTimeout(s,1e3*Math.pow(2,n)))}return null}async function x(e){let t=await I(e);return!t||!t.ok?null:t.json()}async function A(e,t){let n=await I(e,{method:"POST",body:JSON.stringify(t)});return!n||!n.ok?null:n.json()}function Ee(e){let t=o._cachedOverviewData;if(!t){e.innerHTML=`
      <div class="card">
        <div class="skeleton skeleton-title"></div>
        <div class="stat-grid">
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
          <div class="stat-item"><div class="skeleton" style="height:40px;width:60px;margin:0 auto"></div></div>
        </div>
      </div>`;return}let n=Math.min(100,Math.round(t.daily_words_practiced/(t.daily_words_goal||10)*100));e.innerHTML=`
    <div class="card">
      <div class="flex items-center justify-between mb-lg">
        <div class="card-title">Your Progress</div>
        ${o.userIsPro?'<span class="badge badge-pro">PRO</span>':'<span class="badge badge-free">Free</span>'}
      </div>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">${t.streak_days||0}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t.xp_total||0}</div>
          <div class="stat-label">Total XP</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t.total_vocab||0}</div>
          <div class="stat-label">Words Learned</div>
        </div>
      </div>
      <div class="mt-lg">
        <div class="flex items-center justify-between mb-md">
          <span class="text-secondary" style="font-size:var(--font-sm)">Daily Goal</span>
          <span class="text-secondary" style="font-size:var(--font-sm)">${t.daily_words_practiced||0}/${t.daily_words_goal||10}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill${n>=100?" success":""}" style="width:${n}%"></div>
        </div>
      </div>
    </div>`}function Te(e){let t=o._cachedVocabDue||0,n=o._cachedGrammarDue||0,s=t+n;e.innerHTML=`
    <div class="card">
      <div class="card-title">Due for Review</div>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value${s>0?" text-warning":""}">${s}</div>
          <div class="stat-label">Total Due</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${t}</div>
          <div class="stat-label">Vocab</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${n}</div>
          <div class="stat-label">Grammar</div>
        </div>
      </div>
      ${s>0?'<button class="btn btn-primary btn-block mt-lg" id="start-review-btn">Start Review</button>':""}
    </div>`}async function Le(e){if(!o.isLoggedIn){e.innerHTML=`
      <div class="page">
        <div style="text-align:center;padding:60px 20px">
          <h1 style="font-size:var(--font-2xl);margin-bottom:var(--space-lg)">Mandubun</h1>
          <p class="text-secondary mb-xl">Learn Korean by reading Naver Webtoons</p>
          <button class="btn btn-primary btn-block" id="login-btn">Continue with Google</button>
          <p class="text-muted mt-lg" style="font-size:var(--font-sm)">Free to start. No credit card required.</p>
        </div>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}e.innerHTML=`
    <div class="page">
      <div id="stats-section"><div class="skeleton skeleton-card"></div></div>
      <div id="due-section"><div class="skeleton skeleton-card"></div></div>
      <div id="actions-section"></div>
    </div>`;let[t,n,s]=await Promise.all([x("/learning/overview"),x("/vocab_due_for_review"),x("/grammar_due_for_review")]);t&&(o._cachedOverviewData=t,o.userXP=t.xp_total||0,o.userStreak=t.streak_days||0,o.userLevel=t.user_level||1,o.dailyWordsPracticed=t.daily_words_practiced||0,o.DAILY_WORDS_GOAL=t.daily_words_goal||10,o.userIsPro=t.is_pro||!1,o.currentUserIsAdmin=t.is_admin||!1),n&&(o._cachedVocabDue=n.due_count||0),s&&(o._cachedGrammarDue=s.due_count||0),o._cachedDueCount=o._cachedVocabDue+o._cachedGrammarDue;let i=document.getElementById("stats-section"),a=document.getElementById("due-section"),r=document.getElementById("actions-section");i&&Ee(i),a&&Te(a),r&&(r.innerHTML=`
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
      </div>`),document.getElementById("start-review-btn")?.addEventListener("click",()=>{window.location.hash="#/learn"})}var Q="all";async function Se(e){e.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Browse Webtoons</h2>
      <div id="genre-chips" class="chip-group mb-lg"></div>
      <div id="series-list"></div>
    </div>`;let[t,n]=await Promise.all([C("/catalog/genres"),C("/catalog/series")]),s=[],i=[];try{if(t?.ok){let a=await t.json();s=a.genres||a||[]}}catch(a){console.warn("Failed to parse genres:",a)}try{if(n?.ok){let a=await n.json();i=a.items||a.series||a||[]}}catch(a){console.warn("Failed to parse series:",a)}at(s),ot(Array.isArray(i)?i:[])}function at(e){let t=document.getElementById("genre-chips");if(!t)return;let n=Array.isArray(e)?e:[],s=[{key:"all",label:"All"},...n.map(i=>({key:i,label:i}))];t.innerHTML=s.map(i=>`<button class="chip${i.key===Q?" active":""}" data-genre="${i.key}">${i.label}</button>`).join(""),t.addEventListener("click",i=>{let a=i.target.closest(".chip");a&&(Q=a.dataset.genre,t.querySelectorAll(".chip").forEach(r=>r.classList.toggle("active",r.dataset.genre===Q)))})}function ot(e){let t=document.getElementById("series-list");if(t){if(!e.length){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No webtoons available yet.</p>
      </div>`;return}t.innerHTML=e.map(n=>`
    <a href="#/series/${n.webtoon_id}" class="card" style="display:flex;gap:var(--space-lg);text-decoration:none;color:inherit;cursor:pointer">
      ${n.thumbnail_url?`<img src="${n.thumbnail_url}" alt="" style="width:80px;height:80px;border-radius:var(--radius-md);object-fit:cover" loading="lazy">`:""}
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;margin-bottom:var(--space-sm)">${ke(n.series_title||n.title||"Untitled")}</div>
        ${n.author_names?`<div class="text-secondary" style="font-size:var(--font-sm)">${ke(n.author_names)}</div>`:""}
        ${n.episode_count?`<div class="text-muted" style="font-size:var(--font-xs);margin-top:var(--space-sm)">${n.episode_count} episodes</div>`:""}
      </div>
    </a>
  `).join("")}}function ke(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}var R="all",rt="recent",ct="all",M=1,L=[],X="vocab";async function $e(e){if(!o.isLoggedIn){e.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p class="mb-lg">Log in to see your learning progress</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}e.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">My Learning</h2>
      <div id="hub-tabs" class="chip-group mb-lg">
        <button class="chip active" data-tab="vocab">Vocabulary</button>
        <button class="chip" data-tab="grammar">Grammar</button>
      </div>
      <div id="hub-filters" class="chip-group mb-lg"></div>
      <div id="hub-content"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
      <div id="hub-load-more" class="text-center mt-lg"></div>
    </div>`,document.getElementById("hub-tabs")?.addEventListener("click",t=>{let n=t.target.closest(".chip");n&&(X=n.dataset.tab,document.querySelectorAll("#hub-tabs .chip").forEach(s=>s.classList.toggle("active",s.dataset.tab===X)),M=1,L=[],K())}),await K()}async function K(){lt();let e=document.getElementById("hub-content");e&&(X==="vocab"?await Ie(e):await ut(e))}function lt(){let e=document.getElementById("hub-filters");if(!e)return;let t=[{key:"all",label:"All"},{key:"due",label:"Due"},{key:"learning",label:"Learning"},{key:"mastered",label:"Mastered"},{key:"new",label:"New"}];e.innerHTML=t.map(n=>`<button class="chip${n.key===R?" active":""}" data-filter="${n.key}">${n.label}</button>`).join(""),e.onclick=n=>{let s=n.target.closest(".chip");s&&(R=s.dataset.filter,M=1,L=[],e.querySelectorAll(".chip").forEach(i=>i.classList.toggle("active",i.dataset.filter===R)),K())}}async function Ie(e){M===1&&(e.innerHTML='<div class="skeleton skeleton-card"></div>'.repeat(3));let t=await x(`/learning/vocab?page=${M}&per_page=30&sort=${rt}&filter=${R}&category=${ct}&include_sentences=true`);if(!t||!t.vocab){M===1&&(e.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">&#128218;</div>
          <p>No vocabulary yet. Start reading webtoons to build your word list!</p>
        </div>`);return}M===1&&(L=[]),L=[...L,...t.vocab],dt(e);let n=document.getElementById("hub-load-more");n&&(t.has_more?(n.innerHTML='<button class="btn btn-secondary" id="load-more-btn">Load More</button>',document.getElementById("load-more-btn")?.addEventListener("click",()=>{M++,Ie(e)})):n.innerHTML=L.length>0?`<span class="text-muted" style="font-size:var(--font-sm)">${L.length} words</span>`:"")}function dt(e){if(!L.length){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No words match this filter.</p>
      </div>`;return}e.innerHTML=L.map(t=>{let n=Ae(t);return`
      <div class="card" style="padding:var(--space-lg)">
        <div class="flex items-center justify-between">
          <div>
            <span style="font-size:var(--font-md);font-weight:600">${O(t.vocab_word)}</span>
            ${t.romanization?`<span class="text-muted" style="font-size:var(--font-sm);margin-left:var(--space-md)">${O(t.romanization)}</span>`:""}
          </div>
          <span class="badge ${n}">${t.mastery||"new"}</span>
        </div>
        ${t.meaning?`<div class="text-secondary mt-sm" style="font-size:var(--font-sm)">${O(t.meaning)}</div>`:""}
        ${t.next_review_at?`<div class="text-muted mt-sm" style="font-size:var(--font-xs)">Next review: ${mt(t.next_review_at)}</div>`:""}
      </div>`}).join("")}async function ut(e){e.innerHTML='<div class="skeleton skeleton-card"></div>'.repeat(3);let t=await x(`/learning/grammar?page=1&per_page=30&filter=${R}`);if(!t||!t.grammar||!t.grammar.length){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No grammar patterns yet. Start practicing to discover grammar!</p>
      </div>`;return}e.innerHTML=t.grammar.map(n=>`
    <div class="card" style="padding:var(--space-lg)">
      <div class="flex items-center justify-between">
        <span style="font-size:var(--font-md);font-weight:600">${O(n.pattern_name||n.pattern)}</span>
        <span class="badge ${Ae(n)}">${n.mastery||"new"}</span>
      </div>
      ${n.pattern!==n.pattern_name?`<div class="text-muted mt-sm" style="font-size:var(--font-sm)">${O(n.pattern)}</div>`:""}
      <div class="flex gap-lg mt-sm text-secondary" style="font-size:var(--font-xs)">
        <span>Seen: ${n.times_seen||0}</span>
        <span>Correct: ${n.times_correct||0}</span>
      </div>
    </div>
  `).join("")}function Ae(e){return(e.mastery||"new")==="mastered"?"badge-pro":"badge-free"}function mt(e){try{let s=new Date(e)-new Date,i=Math.round(s/36e5);return i<0?"Now":i<24?`${i}h`:`${Math.round(i/24)}d`}catch{return e}}function O(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}async function Me(e){if(!o.isLoggedIn){e.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#9881;</div>
        <p class="mb-lg">Log in to manage your settings</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}e.innerHTML=`
    <div class="page">
      <h2 style="font-size:var(--font-xl);margin-bottom:var(--space-lg)">Settings</h2>

      <div class="card">
        <div class="card-title">Account</div>
        <div class="list-item">
          <div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Email</div>
            <div>${pt(o.currentUserEmail||"Unknown")}</div>
          </div>
        </div>
        <div class="list-item">
          <div>
            <div class="text-secondary" style="font-size:var(--font-sm)">Plan</div>
            <div>${o.userIsPro?'<span class="badge badge-pro">Pro</span>':'<span class="badge badge-free">Free</span>'}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Subscription</div>
        ${o.userIsPro?'<button class="btn btn-secondary btn-block" id="manage-sub-btn">Manage Subscription</button>':'<button class="btn btn-primary btn-block" id="upgrade-btn">Upgrade to Pro</button>'}
      </div>

      <div class="card">
        <div class="card-title">Daily Goal</div>
        <div class="flex items-center gap-lg">
          <label class="text-secondary" style="font-size:var(--font-sm)">Words per day:</label>
          <select id="daily-goal-select" style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:var(--space-md) var(--space-lg);color:var(--color-text);min-height:44px">
            <option value="5"${o.DAILY_WORDS_GOAL===5?" selected":""}>5</option>
            <option value="10"${o.DAILY_WORDS_GOAL===10?" selected":""}>10</option>
            <option value="20"${o.DAILY_WORDS_GOAL===20?" selected":""}>20</option>
            <option value="30"${o.DAILY_WORDS_GOAL===30?" selected":""}>30</option>
            <option value="50"${o.DAILY_WORDS_GOAL===50?" selected":""}>50</option>
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
    </div>`,document.getElementById("logout-btn")?.addEventListener("click",be),document.getElementById("upgrade-btn")?.addEventListener("click",async()=>{let t=await A("/stripe/create_checkout_session",{success_url:window.location.origin+"/app/#/settings",cancel_url:window.location.origin+"/app/#/settings"});t?.url&&(window.location.href=t.url)}),document.getElementById("manage-sub-btn")?.addEventListener("click",async()=>{let t=await A("/stripe/create_portal_session",{return_url:window.location.origin+"/app/#/settings"});t?.url&&(window.location.href=t.url)}),document.getElementById("daily-goal-select")?.addEventListener("change",async t=>{let n=parseInt(t.target.value,10);o.DAILY_WORDS_GOAL=n,await A("/user/daily_goal",{daily_words_goal:n})})}function pt(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}async function Pe(e,t){let n=t[0];if(!n){e.innerHTML='<div class="page empty-state"><p>No series selected.</p></div>';return}e.innerHTML=`
    <div class="page">
      <div id="series-header"><div class="skeleton skeleton-title"></div></div>
      <div id="episode-list"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div>
    </div>`;let s=await C(`/catalog/episodes?webtoon_id=${encodeURIComponent(n)}`),i=s?.ok?await s.json():null;if(!i){e.innerHTML='<div class="page empty-state"><p>Failed to load episodes.</p></div>';return}let a=i.items||i.episodes||(Array.isArray(i)?i:[]),r=a[0]?.series_title||i.series_title||"Webtoon",c=document.getElementById("series-header");c&&(c.innerHTML=`
      <a href="#/catalog" class="text-secondary" style="font-size:var(--font-sm)">&larr; Back to catalog</a>
      <h2 style="font-size:var(--font-xl);margin-top:var(--space-md)">${De(r)}</h2>
      <p class="text-secondary mt-sm">${a.length} episode${a.length!==1?"s":""}</p>
    `);let d={};if(o.isLoggedIn){let m=await I(`/chapter_access?webtoon_id=${encodeURIComponent(n)}`);if(m?.ok){let u=await m.json();d=u.access||u||{}}}let l=document.getElementById("episode-list");if(l){if(!a.length){l.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No episodes available for this series.</p>
      </div>`;return}l.innerHTML=a.map(m=>{let u=m.episode_id||m.id,v=m.is_first_chapter||d[u]?.accessible,f=!v&&!o.userIsPro;return`
      <a href="${f?"javascript:void(0)":`#/reader/${n}/${u}`}"
         class="card list-item" style="text-decoration:none;color:inherit;${f?"opacity:0.5;cursor:default":"cursor:pointer"}">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500">${De(m.episode_title||m.title||`Episode ${m.episode_number||u}`)}</div>
          <div class="text-muted" style="font-size:var(--font-xs);margin-top:var(--space-xs)">
            ${m.panel_count?`${m.panel_count} panels`:""}
          </div>
        </div>
        <div>
          ${f?'<span class="badge badge-free">PRO</span>':v?'<span class="text-success" style="font-size:var(--font-sm)">Free</span>':""}
        </div>
      </a>
    `}).join("")}}function De(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Be(e,t,n){let s=document.createElement("div");s.className="panel-wrapper",s.dataset.panelHash=t.panel_hash;let i=document.createElement("img");return i.className="panel-image",i.src=`${o.API_BASE_URL}${t.image_url}`,i.alt="",i.loading="lazy",i.dataset.panelHash=t.panel_hash,s.appendChild(i),i.onload=()=>{vt(s,t,n)},t.no_text_detected&&s.classList.add("no-text"),e.appendChild(s),s}function vt(e,t,n){if(!t.translations||!t.image_dimensions)return;let s=t.image_dimensions.width,i=t.image_dimensions.height;!s||!i||t.translations.forEach(a=>{if(a.hidden&&!o.currentUserIsAdmin)return;let r=a.translation||{},c=r.original_text||"",d=r.full_translation||"";if(!a.bounding_box)return;let[l,m,u,v]=a.bounding_box.split(",").map(Number),f=l/s*100,b=m/i*100,_=u/s*100,S=v/i*100,g=document.createElement("div");g.className="translation-hit-zone",g.style.position="absolute",g.style.left=`${f}%`,g.style.top=`${b}%`,g.style.width=`${Math.max(_,3)}%`,g.style.height=`${Math.max(S,3)}%`,g.style.minWidth="44px",g.style.minHeight="44px",g.style.cursor="pointer",g.style.zIndex="10",g.dataset.boundingBox=a.bounding_box,g.dataset.originalText=c,g.dataset.translation=d,g.addEventListener("click",Ze=>{Ze.stopPropagation(),ft(e,g,a,f,b,S),n&&n(a,t.panel_hash)}),e.appendChild(g)})}var D=null;function ft(e,t,n,s,i,a){if(D){if(D.remove(),D.dataset.boundingBox===n.bounding_box){D=null;return}D=null}let r=n.translation||{},c=r.original_text||"",d=r.full_translation||"";if(!d||d==="(translation unavailable)")return;let l=document.createElement("div");l.className="translation-overlay",l.dataset.boundingBox=n.bounding_box,l.style.position="absolute",l.style.left=`${Math.max(0,s-2)}%`,l.style.top=`${i+a+1}%`,l.style.zIndex="20",l.innerHTML=`
    <div class="overlay-korean">${He(c)}</div>
    <div class="overlay-english">${He(d)}</div>
    ${r.vocab&&r.vocab.length>0?`<div class="overlay-vocab-count">${r.vocab.length} word${r.vocab.length>1?"s":""}</div>`:""}
  `;let m=u=>{!l.contains(u.target)&&!t.contains(u.target)&&(l.remove(),D=null,document.removeEventListener("click",m))};setTimeout(()=>document.addEventListener("click",m),0),e.appendChild(l),D=l}function He(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}var h=null,Re=null;function J(){return h||(h=document.createElement("div"),h.className="subtitle-bar hidden",h.id="pwa-subtitle-bar",document.body.appendChild(h),h.addEventListener("click",e=>{e.target.closest(".subtitle-vocab-btn")||Z()}),h)}function Oe(e,t){if(h||J(),!e?.translation)return;Re=e;let n=e.translation,s=n.original_text||"",i=n.full_translation||"";h.innerHTML=`
    <div class="subtitle-content">
      <div class="subtitle-korean">${Ce(s)}</div>
      <div class="subtitle-english">${Ce(i)}</div>
      ${n.vocab&&n.vocab.length>0?`<button class="subtitle-vocab-btn" data-panel-hash="${t}" data-bbox="${e.bounding_box}">
            ${n.vocab.length} word${n.vocab.length>1?"s":""} &rsaquo;
           </button>`:""}
    </div>
  `,h.classList.remove("hidden")}function Z(){h&&(h.classList.add("hidden"),Re=null)}function Ce(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}function E(e,t="info"){let n=document.getElementById("toast-container");if(!n)return;let s=document.createElement("div");s.className=`toast ${t}`,s.textContent=e,n.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transition="opacity 0.25s",setTimeout(()=>s.remove(),250)},3e3)}var y=null;function te(){y||(y=document.createElement("div"),y.className="vocab-popover hidden",y.id="pwa-vocab-popover",document.body.appendChild(y),document.addEventListener("click",e=>{y&&!y.contains(e.target)&&!e.target.closest(".subtitle-vocab-btn")&&G()}))}function Ne(e,t){y||te(),!(!e||!e.length)&&(y.innerHTML=`
    <div class="popover-header">
      <span class="popover-title">Words (${e.length})</span>
      <button class="popover-close">&times;</button>
    </div>
    <div class="popover-list">
      ${e.map(n=>{let s=n.surface_form||n.word||"",i=n.meaning||n.definition||"",a=n.romanization||"";return`
          <div class="popover-word" data-word="${ze(s)}" data-panel-hash="${t}" data-meaning="${ze(i)}">
            <div class="popover-word-main">
              <span class="popover-korean">${ee(s)}</span>
              ${a?`<span class="popover-romanization">${ee(a)}</span>`:""}
            </div>
            ${i?`<div class="popover-meaning">${ee(i)}</div>`:""}
          </div>
        `}).join("")}
    </div>
  `,y.querySelector(".popover-close")?.addEventListener("click",G),y.classList.remove("hidden"))}function G(){y&&y.classList.add("hidden")}function ee(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ze(e){return e?e.replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}async function Ge(e,t){let n=t[0],s=t[1];if(!n||!s){e.innerHTML='<div class="page empty-state"><p>Missing webtoon or episode ID.</p></div>';return}if(!o.isLoggedIn){e.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p class="mb-lg">Log in to read webtoons with translations</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}e.innerHTML=`
    <div class="page">
      <div id="reader-header">
        <a href="#/series/${n}" class="text-secondary" style="font-size:var(--font-sm)">&larr; Back to episodes</a>
      </div>
      <div id="reader-panels" style="margin-top:var(--space-lg)">
        <div class="skeleton skeleton-card" style="height:300px"></div>
        <div class="skeleton skeleton-card" style="height:300px"></div>
      </div>
      <div id="reader-footer" class="text-center mt-xl"></div>
    </div>`,J(),te();let i=await I(`/pwa/episode_panels?webtoon_id=${encodeURIComponent(n)}&episode_id=${encodeURIComponent(s)}`);if(!i||!i.ok){let l=document.getElementById("reader-panels");l&&(i?.status===404?l.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">&#128218;</div>
            <p>No panels found for this episode.</p>
            <p class="text-muted mt-md" style="font-size:var(--font-sm)">This episode may not have been processed yet. Try reading it with the browser extension first.</p>
          </div>`:l.innerHTML='<div class="empty-state"><p>Failed to load panels. Please try again.</p></div>');return}let r=(await i.json()).panels||[],c=document.getElementById("reader-panels");if(!c)return;if(c.innerHTML="",!r.length){c.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p>No panels available.</p>
      </div>`;return}r.forEach(l=>{Be(c,l,gt)});let d=document.getElementById("reader-footer");return d&&(d.innerHTML=`
      <div class="card">
        <div class="card-title">Chapter Complete</div>
        <p class="text-secondary mb-lg" style="font-size:var(--font-sm)">${r.length} panels read</p>
        <a href="#/series/${n}" class="btn btn-secondary btn-block">Back to Episodes</a>
      </div>`),x(`/update_panel_progress?webtoon_id=${encodeURIComponent(n)}&episode_id=${encodeURIComponent(s)}`).catch(()=>{}),()=>{Z(),G()}}function gt(e,t){Oe(e,t),setTimeout(()=>{let n=document.querySelector(".subtitle-vocab-btn");n&&n.addEventListener("click",s=>{s.stopPropagation();let i=e.translation?.vocab||[];i.length&&Ne(i,t)})},0)}var bt="mandubun";var z=null,je=!1,P={};function ht(){return new Promise((e,t)=>{let n=indexedDB.open(bt,1);n.onupgradeneeded=()=>{let s=n.result;s.objectStoreNames.contains("kv")||s.createObjectStore("kv")},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}async function yt(){try{z=await ht(),je=!0}catch(e){console.warn("IndexedDB unavailable, falling back to localStorage only",e),je=!1}}yt();function wt(e){return z?new Promise(t=>{try{let s=z.transaction("kv","readonly").objectStore("kv").get(e);s.onsuccess=()=>t(s.result),s.onerror=()=>t(void 0)}catch{t(void 0)}}):Promise.resolve(void 0)}function xt(e,t){return z?new Promise(n=>{try{let s=z.transaction("kv","readwrite");s.objectStore("kv").put(t,e),s.oncomplete=()=>n(),s.onerror=()=>n()}catch{n()}}):Promise.resolve()}function _t(e){if(e in P)return P[e];try{let t=localStorage.getItem(e);if(t!==null)try{return JSON.parse(t)}catch{return t}}catch{}}async function ne(e){if(e in P)return P[e];let t=await wt(e);return t!==void 0?(P[e]=t,t):_t(e)}function se(e,t){P[e]=t;try{localStorage.setItem(e,typeof t=="string"?t:JSON.stringify(t))}catch{}xt(e,t)}var Et="mandubun-offline",Tt=1,T="pending_queue",Lt=200,kt=10080*60*1e3,j=null;async function U(){return j||new Promise((e,t)=>{let n=indexedDB.open(Et,Tt);n.onupgradeneeded=()=>{let s=n.result;s.objectStoreNames.contains(T)||s.createObjectStore(T,{keyPath:"id",autoIncrement:!0})},n.onsuccess=()=>{j=n.result,e(j)},n.onerror=()=>t(n.error)})}async function ae(e,t){try{let s=(await U()).transaction(T,"readwrite"),i=s.objectStore(T),a=i.count();if(await new Promise(r=>{a.onsuccess=r}),a.result>=Lt){console.warn("Offline queue full, dropping oldest entry");let r=i.openCursor();await new Promise(c=>{r.onsuccess=()=>{r.result&&r.result.delete(),c()}})}i.add({endpoint:e,body:t,timestamp:Date.now()}),await new Promise((r,c)=>{s.oncomplete=r,s.onerror=()=>c(s.error)})}catch(n){console.warn("Failed to queue offline update:",n)}}async function oe(){try{let s=(await U()).transaction(T,"readonly").objectStore(T).getAll();await new Promise(d=>{s.onsuccess=d});let i=s.result||[];if(i.length===0)return 0;let a=Date.now(),r=0,c=0;for(let d of i){if(a-d.timestamp>kt){await ie(d.id),c++;continue}try{let l=await I(d.endpoint,{method:"POST",body:JSON.stringify(d.body)});l&&(l.ok||l.status===409)?(await ie(d.id),r++):l&&l.status>=400&&l.status<500&&(await ie(d.id),r++)}catch(l){console.warn("Flush interrupted (network):",l);break}}return c>0&&console.log(`Expired ${c} queued updates`),r>0&&console.log(`Flushed ${r} queued updates`),r}catch(e){return console.warn("Failed to flush offline queue:",e),0}}async function ie(e){try{let n=(await U()).transaction(T,"readwrite");n.objectStore(T).delete(e),await new Promise(s=>{n.oncomplete=s})}catch{}}async function Ue(){try{let n=(await U()).transaction(T,"readonly").objectStore(T).count();return await new Promise(s=>{n.onsuccess=s}),n.result}catch{return 0}}function We(){window.addEventListener("online",async()=>{let e=await oe();e>0&&console.log(`Synced ${e} practice results`)})}var p=null;function Fe(){return p}function qe(){return p!==null&&p.currentIndex<p.exercises.length}async function re(e="blended"){let t=[],n=[];if(o.isOnline){let[i,a]=await Promise.all([x("/vocab_due_for_review"),x("/grammar_due_for_review")]);t=i?.vocab||[],n=a?.grammar||[],(t.length>0||n.length>0)&&(se("offline_vocab_due",t),se("offline_grammar_due",n))}else t=await ne("offline_vocab_due")||[],n=await ne("offline_grammar_due")||[];if(t.length===0&&n.length===0)return{error:"no_items",message:"Nothing due for review right now!"};let s=St(t,n,e);return p={mode:e,exercises:s,currentIndex:0,correctCount:0,totalAnswered:0,startTime:Date.now(),results:[]},o.blendedPracticeModeActive=!0,{session:p}}function St(e,t,n){let s=[],i=Mt(),a=[];return e.forEach(c=>{a.push({type:"vocab",item:c})}),t.forEach(c=>{a.push({type:"grammar",item:c})}),Ye(a),a.slice(0,i).forEach(c=>{if(c.type==="vocab"){let d=$t(c.item,n);s.push({type:d,category:"vocab",item:c.item,distractors:[]})}else s.push({type:"grammar_fill",category:"grammar",item:c.item,distractors:[]})}),s.forEach(c=>{(c.type==="vocab_choice"||c.type==="grammar_fill")&&(c.distractors=It(c,a))}),s}function $t(e,t){let n=["vocab_choice","vocab_type"];return o.TTS_READY&&n.push("listening"),o.practiceDifficulty==="beginner"&&n.push("vocab_choice"),o.practiceDifficulty==="advanced"&&n.push("vocab_type"),n[Math.floor(Math.random()*n.length)]}function It(e,t){let n=e.category==="vocab"?e.item.meaning||e.item.definition||"":e.item.pattern_name||e.item.pattern||"",s=t.filter(i=>i.type===e.category).map(i=>i.type==="vocab"?i.item.meaning||i.item.definition||"":i.item.pattern_name||i.item.pattern||"").filter(i=>i&&i!==n);return Ye(s),s.slice(0,3)}async function Ve(e,t,n,s){if(!p||e>=p.exercises.length)return;let i=p.exercises[e],a=t===n;return p.results.push({exercise:i,answer:t,correct:n,isCorrect:a,responseTimeMs:s}),p.totalAnswered++,a&&p.correctCount++,p.currentIndex++,At(i,a,s),a}async function At(e,t,n){if(e.category==="vocab"){let s=e.item.surface_form||e.item.word||e.item.vocab_word,i=e.item.source_panel_hash||"review",a={word:s.normalize("NFC"),panel_hash:i,mode:e.type,correct:t,response_time_ms:n};o.isOnline?Y(()=>A("/update_vocab_progress",a)):ae("/update_vocab_progress",a)}else if(e.category==="grammar"){let s={pattern:e.item.pattern||e.item.pattern_name,correct:t,response_time_ms:n};o.isOnline?Y(()=>A("/update_grammar_progress",s)):ae("/update_grammar_progress",s)}}function ce(){if(!p)return null;let e={totalExercises:p.exercises.length,totalAnswered:p.totalAnswered,correctCount:p.correctCount,accuracy:p.totalAnswered>0?Math.round(p.correctCount/p.totalAnswered*100):0,durationMs:Date.now()-p.startTime,results:p.results};return p=null,o.blendedPracticeModeActive=!1,e}function Mt(){return o.practiceDifficulty==="beginner"?8:o.practiceDifficulty==="intermediate"?12:15}function Ye(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function le(e,t,n){let s=t.item,i=s.surface_form||s.word||s.vocab_word||"",a=s.meaning||s.definition||"",r=s.romanization||"",c=[a,...t.distractors].filter(Boolean);de(c);let d=Date.now();e.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-word">${k(i)}</div>
        ${r?`<div class="exercise-romanization">${k(r)}</div>`:""}
        <div class="exercise-instruction">What does this word mean?</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${c.map((m,u)=>`
          <button class="exercise-option" data-index="${u}" data-value="${ue(m)}">
            ${k(m)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let l=document.getElementById("exercise-options");l?.addEventListener("click",m=>{let u=m.target.closest(".exercise-option");if(!u||u.disabled)return;let v=u.dataset.value,f=Date.now()-d,b=v===a;l.querySelectorAll(".exercise-option").forEach(_=>{_.disabled=!0,_.dataset.value===a&&_.classList.add("correct"),_===u&&!b&&_.classList.add("incorrect")}),W(e,b,i,a),setTimeout(()=>n(v,a,f),1200)})}function Qe(e,t,n){let s=t.item,i=s.surface_form||s.word||s.vocab_word||"",a=s.meaning||s.definition||"",r=s.romanization||"",c=Date.now();e.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-word">${k(i)}</div>
        ${r?`<div class="exercise-romanization">${k(r)}</div>`:""}
        <div class="exercise-instruction">Type the English meaning</div>
      </div>
      <div class="exercise-input-group">
        <input type="text" id="type-answer" class="exercise-input" autocomplete="off" inputmode="text" placeholder="Type your answer...">
        <button class="btn btn-primary" id="type-submit">Check</button>
      </div>
    </div>
  `;let d=document.getElementById("type-answer"),l=document.getElementById("type-submit");d?.focus();function m(){let u=(d?.value||"").trim();if(!u)return;let v=Date.now()-c,f=Dt(u,a);d.disabled=!0,l.disabled=!0,d.classList.add(f?"correct":"incorrect"),W(e,f,i,a),setTimeout(()=>n(u,a,v),1200)}l?.addEventListener("click",m),d?.addEventListener("keydown",u=>{u.key==="Enter"&&m()})}function Dt(e,t){let n=s=>s.toLowerCase().trim().replace(/[^a-z0-9\s]/g,"");return n(e)===n(t)}function Xe(e,t,n){let s=t.item,i=s.surface_form||s.word||s.vocab_word||"",a=s.meaning||s.definition||"",r=[a,...t.distractors].filter(Boolean);de(r);let c=Date.now();e.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <button class="btn btn-secondary exercise-listen-btn" id="listen-btn">
          &#128266; Listen
        </button>
        <div class="exercise-instruction">What word did you hear?</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${r.map((u,v)=>`
          <button class="exercise-option" data-index="${v}" data-value="${ue(u)}">
            ${k(u)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let d=document.getElementById("listen-btn");function l(){try{let u=new SpeechSynthesisUtterance(i);u.lang="ko-KR",u.rate=.9,speechSynthesis.speak(u)}catch{E("Audio not available","error")}}d?.addEventListener("click",l),setTimeout(l,300);let m=document.getElementById("exercise-options");m?.addEventListener("click",u=>{let v=u.target.closest(".exercise-option");if(!v||v.disabled)return;let f=v.dataset.value,b=Date.now()-c,_=f===a;m.querySelectorAll(".exercise-option").forEach(S=>{S.disabled=!0,S.dataset.value===a&&S.classList.add("correct"),S===v&&!_&&S.classList.add("incorrect")}),W(e,_,i,a),setTimeout(()=>n(f,a,b),1200)})}function Ke(e,t,n){let s=t.item,i=s.pattern_name||s.pattern||"",a=s.pattern||i,r=[a,...t.distractors].filter(Boolean);de(r);let c=Date.now();e.innerHTML=`
    <div class="exercise-card">
      <div class="exercise-prompt">
        <div class="exercise-instruction">Which grammar pattern fits?</div>
        <div class="exercise-word">${k(i)}</div>
      </div>
      <div class="exercise-options" id="exercise-options">
        ${r.map((l,m)=>`
          <button class="exercise-option" data-index="${m}" data-value="${ue(l)}">
            ${k(l)}
          </button>
        `).join("")}
      </div>
    </div>
  `;let d=document.getElementById("exercise-options");d?.addEventListener("click",l=>{let m=l.target.closest(".exercise-option");if(!m||m.disabled)return;let u=m.dataset.value,v=Date.now()-c,f=u===a;d.querySelectorAll(".exercise-option").forEach(b=>{b.disabled=!0,b.dataset.value===a&&b.classList.add("correct"),b===m&&!f&&b.classList.add("incorrect")}),W(e,f,i,a),setTimeout(()=>n(u,a,v),1200)})}function W(e,t,n,s){let i=e.querySelector(".exercise-feedback");i&&i.remove();let a=document.createElement("div");a.className=`exercise-feedback ${t?"correct":"incorrect"}`,a.innerHTML=t?'<span class="feedback-icon">&#10003;</span> Correct!':`<span class="feedback-icon">&#10007;</span> ${k(s)}`,e.querySelector(".exercise-card")?.appendChild(a)}function de(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}function k(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}function ue(e){return e?e.replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}async function Je(e){if(!o.isLoggedIn){e.innerHTML=`
      <div class="page empty-state">
        <div class="empty-state-icon">&#128218;</div>
        <p class="mb-lg">Log in to practice</p>
        <button class="btn btn-primary" id="login-btn">Continue with Google</button>
      </div>`,document.getElementById("login-btn")?.addEventListener("click",w);return}if(qe()){e.innerHTML='<div class="page" id="practice-container"></div>',F();return}e.innerHTML=`
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
            <option value="beginner"${o.practiceDifficulty==="beginner"?" selected":""}>Beginner (8 exercises)</option>
            <option value="intermediate"${o.practiceDifficulty==="intermediate"?" selected":""}>Intermediate (12 exercises)</option>
            <option value="advanced"${o.practiceDifficulty==="advanced"?" selected":""}>Advanced (15 exercises)</option>
          </select>
        </div>
      </div>
    </div>`,document.getElementById("difficulty-select")?.addEventListener("change",t=>{o.practiceDifficulty=t.target.value}),document.getElementById("start-practice-btn")?.addEventListener("click",async()=>{let t=document.getElementById("start-practice-btn");t&&(t.disabled=!0,t.textContent="Loading...");let n=await re("blended");if(n.error){E(n.message,"info"),t&&(t.disabled=!1,t.textContent="Start Practice Session");return}e.innerHTML='<div class="page" id="practice-container"></div>',F()})}function F(){let e=document.getElementById("practice-container");if(!e)return;let t=Fe();if(!t||t.currentIndex>=t.exercises.length){Pt(e);return}let n=t.exercises[t.currentIndex],s={current:t.currentIndex+1,total:t.exercises.length,correct:t.correctCount};e.innerHTML=`
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
  `,document.getElementById("exit-practice")?.addEventListener("click",()=>{confirm("Exit practice? Your progress so far is saved.")&&(ce(),window.location.hash="#/learn")});let i=document.getElementById("exercise-area");if(!i)return;let a=(r,c,d)=>{Ve(t.currentIndex,r,c,d),F()};switch(n.type){case"vocab_choice":le(i,n,a);break;case"vocab_type":Qe(i,n,a);break;case"listening":Xe(i,n,a);break;case"grammar_fill":Ke(i,n,a);break;default:le(i,n,a)}}function Pt(e){let t=ce();if(!t){e.innerHTML='<div class="empty-state"><p>No session data.</p></div>';return}let n=t.accuracy,s=Math.round(t.durationMs/1e3),i=Math.floor(s/60),a=s%60;e.innerHTML=`
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
            <div class="stat-value">${t.correctCount}/${t.totalAnswered}</div>
            <div class="stat-label">Correct</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${i>0?`${i}m ${a}s`:`${a}s`}</div>
            <div class="stat-label">Time</div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-md mt-xl">
        <button class="btn btn-primary btn-block" id="practice-again-btn">Practice Again</button>
        <a href="#/learn" class="btn btn-secondary btn-block">Back to Learning Hub</a>
      </div>
    </div>
  `,document.getElementById("practice-again-btn")?.addEventListener("click",async()=>{let r=await re("blended");if(r.error){E(r.message,"info");return}F()})}async function Ht(){if("serviceWorker"in navigator)try{let e=await navigator.serviceWorker.register("/app/sw.js",{scope:"/app/"});e.addEventListener("updatefound",()=>{let t=e.installing;t&&t.addEventListener("statechange",()=>{t.state==="activated"&&navigator.serviceWorker.controller&&E("Update available. Tap to refresh.","info")})})}catch(e){console.warn("SW registration failed:",e)}}function Bt(){let e=document.getElementById("offline-banner");function t(){o.isOnline=navigator.onLine,e&&e.classList.toggle("hidden",o.isOnline)}window.addEventListener("online",async()=>{t();let n=await Ue();if(n>0){E(`Back online. Syncing ${n} practice results...`,"success");let s=await oe();s>0&&E(`Synced ${s} results`,"success")}else E("Back online","success")}),window.addEventListener("offline",()=>{t()}),t()}function Ct(){let e=document.getElementById("header-auth");e&&(o.isLoggedIn?(e.innerHTML=`
      <button id="header-logout-btn" style="font-size:var(--font-sm);color:var(--color-text-secondary);min-height:44px;padding:0 var(--space-md)">
        ${Ot(o.currentUserEmail||"Account")}
      </button>`,document.getElementById("header-logout-btn")?.addEventListener("click",()=>{window.location.hash="#/settings"})):(e.innerHTML=`
      <button id="header-login-btn" class="btn btn-primary" style="font-size:var(--font-sm);padding:var(--space-md) var(--space-lg)">
        Log In
      </button>`,document.getElementById("header-login-btn")?.addEventListener("click",w)))}async function Rt(){$("/",Le),$("/catalog",Se),$("/learn",$e),$("/settings",Me),$("/series",Pe),$("/reader",Ge),$("/practice",Je),await ge(),Ct(),we(),Ht(),Bt(),We()}function Ot(e){if(!e)return"";let t=document.createElement("div");return t.textContent=e,t.innerHTML}Rt().catch(e=>{console.error("App init failed:",e)});})();
