    import React,{useEffect,useMemo,useRef,useState}from'react';
    import{io}from'socket.io-client';
    import{MessageCircle,Phone,Video,Users,Search,MoreVertical,Paperclip,Send,Smile,Camera,Mic,Square,Plus,ArrowLeft,CheckCheck,Check,LogOut,X,PhoneOff,FileText,Clock3,MessageSquarePlus,UserPlus,Settings,Archive,Volume2,Images,Store,LockKeyhole,ShieldCheck,UserCheck,UserX,RefreshCw,Trash2,Lock,Unlock,Inbox,KeyRound,User,Languages,ChevronRight,Eye,EyeOff,Globe2}from'lucide-react';
    import'./style.css';

    const RAW=import.meta.env.VITE_API_URL||'https://talkio-backend-bi1q.onrender.com/api';
    const API=RAW.replace(/\/+$/,'').endsWith('/api')?RAW.replace(/\/+$/,''):RAW.replace(/\/+$/,'')+'/api';
    const ROOT=API.replace(/\/api$/,'');
    const TK='khanChatToken',PK='khanChatPrivateJwk';
    const URDU={
     'Chats':'چیٹس','Calls':'کالز','Status':'اسٹیٹس','Conference':'کانفرنس','Admin approvals':'ایڈمن منظوری','Settings':'سیٹنگز','Log out':'لاگ آؤٹ',
     'All':'سب','Unread':'ان پڑھے','Lock':'لاک','Requests':'درخواستیں','Search username or phone number':'یوزرنیم یا فون نمبر تلاش کریں',
     'Private messaging':'نجی پیغام رسانی','New message and media contents are end-to-end encrypted. Account metadata used for search and approval is not E2EE.':'نئے پیغامات اور میڈیا کا مواد اینڈ ٹو اینڈ انکرپٹڈ ہے۔ تلاش اور منظوری کے لیے استعمال ہونے والی اکاؤنٹ معلومات E2EE نہیں ہیں۔',
     'typing…':'لکھ رہا ہے…','online':'آن لائن','offline':'آف لائن','last seen ':'آخری بار دیکھا گیا ','Remove lock':'لاک ہٹائیں','Lock chat':'چیٹ لاک کریں',
     'Type an encrypted message':'انکرپٹڈ پیغام لکھیں','Connecting…':'کنیکٹ ہو رہا ہے…','Record voice message':'وائس پیغام ریکارڈ کریں','Recording voice message':'وائس پیغام ریکارڈ ہو رہا ہے','Cancel voice message':'وائس پیغام منسوخ کریں','Stop and send':'روکیں اور بھیجیں','Send':'بھیجیں',
     'Account':'اکاؤنٹ','Language':'زبان','Dark Mode':'ڈارک موڈ','Help & Support':'مدد اور سپورٹ','Logout':'لاگ آؤٹ','Admin account':'ایڈمن اکاؤنٹ',
     'Your Account':'آپ کا اکاؤنٹ','Change Name':'نام تبدیل کریں','Your display name':'آپ کا دکھائی دینے والا نام','Save Name':'نام محفوظ کریں','Change Username':'یوزرنیم تبدیل کریں','New username':'نیا یوزرنیم','Save Username':'یوزرنیم محفوظ کریں','Username updated successfully.':'یوزرنیم کامیابی سے تبدیل ہو گیا۔','Reset Username':'یوزرنیم ری سیٹ کریں','Admin Login Username':'ایڈمن لاگ اِن یوزرنیم','Save Username':'یوزرنیم محفوظ کریں','Username updated successfully.':'یوزرنیم کامیابی سے تبدیل ہو گیا۔','Username must be 3-32 characters using letters, numbers, _ or .':'یوزرنیم 3 سے 32 حروف کا ہو اور صرف انگریزی حروف، نمبر، _ یا . استعمال کریں۔',
     'Reset Password':'پاس ورڈ دوبارہ سیٹ کریں','Current password':'موجودہ پاس ورڈ','New password (6+ characters)':'نیا پاس ورڈ (6 یا زیادہ حروف)',
     'Change Password':'پاس ورڈ تبدیل کریں','Name updated successfully.':'نام کامیابی سے تبدیل ہو گیا۔','Password changed successfully.':'پاس ورڈ کامیابی سے تبدیل ہو گیا۔',
     'English':'English','Use English language':'انگریزی زبان استعمال کریں','Change Photo':'تصویر تبدیل کریں','Remove Photo':'تصویر ہٹائیں','Profile photo updated.':'پروفائل تصویر تبدیل ہو گئی۔','Profile photo removed.':'پروفائل تصویر ہٹا دی گئی۔','Please choose an image file.':'براہ کرم تصویر کی فائل منتخب کریں۔','Image is too large. Please choose a smaller photo.':'تصویر بہت بڑی ہے۔ براہ کرم چھوٹی تصویر منتخب کریں۔',
     'Talkio Admin':'Talkio ایڈمن','Admin Account & User Approval':'ایڈمن اکاؤنٹ اور صارف کی منظوری','Chats':'چیٹس',
     'Manage verification requests and every user account from this single dashboard.':'اس ایک ڈیش بورڈ سے تصدیقی درخواستیں اور تمام صارف اکاؤنٹس منظم کریں۔',
     'Refresh':'ریفریش','Signed-in administrator':'لاگ اِن ایڈمن','Password + security PIN protected':'پاس ورڈ + سیکیورٹی پن سے محفوظ',
     'Pending Approvals':'زیرِ التوا منظوریاں','New users cannot log in until you approve them.':'نئے صارف آپ کی منظوری کے بغیر لاگ اِن نہیں کر سکتے۔',
     'Loading…':'لوڈ ہو رہا ہے…','No pending requests':'کوئی زیرِ التوا درخواست نہیں','Approve':'منظور کریں','Reject':'مسترد کریں',
     'All User Accounts':'تمام صارف اکاؤنٹس','Approved, pending and rejected accounts are managed here.':'منظور شدہ، زیرِ التوا اور مسترد اکاؤنٹس یہاں منظم ہوتے ہیں۔',
     'No users found.':'کوئی صارف نہیں ملا۔','Approved':'منظور شدہ','Pending':'زیرِ التوا','Rejected':'مسترد','Delete':'حذف کریں',
     'No approved users found.':'کوئی منظور شدہ صارف نہیں ملا۔','Added':'شامل','Add':'شامل کریں',
     'Incoming requests':'آنے والی درخواستیں','No incoming requests.':'کوئی آنے والی درخواست نہیں۔','Accept':'قبول کریں','Sent requests':'بھیجی گئی درخواستیں','Waiting for approval':'منظوری کا انتظار',
     'End-to-end encrypted message':'اینڈ ٹو اینڈ انکرپٹڈ پیغام','Locked chat':'لاک شدہ چیٹ','No unread messages.':'کوئی ان پڑھا پیغام نہیں۔','No locked chats.':'کوئی لاک شدہ چیٹ نہیں۔',
     'My status':'میرا اسٹیٹس','Add another update':'ایک اور اپڈیٹ شامل کریں','Add status for 24 hours':'24 گھنٹوں کے لیے اسٹیٹس شامل کریں',
     'New conference call':'نئی کانفرنس کال','Call added users':'شامل کیے گئے صارفین کو کال کریں',
     'Add status':'اسٹیٹس شامل کریں','Type a status…':'اسٹیٹس لکھیں…','Share text status':'ٹیکسٹ اسٹیٹس شیئر کریں','Add photo or video':'تصویر یا ویڈیو شامل کریں',
     'Status disappears automatically after 24 hours.':'اسٹیٹس 24 گھنٹے بعد خود بخود ختم ہو جاتا ہے۔',
     'Incoming ':'آنے والی ',' call':' کال','Calling…':'کال کی جا رہی ہے…','Connected · WebRTC encrypted':'کنیکٹڈ · WebRTC انکرپٹڈ',
     'Conference call':'کانفرنس کال','Incoming conference call':'آنے والی کانفرنس کال','You':'آپ',
     'Secure administrator verification':'محفوظ ایڈمن تصدیق','Administrator access':'ایڈمن رسائی','Create your Talkio account':'اپنا Talkio اکاؤنٹ بنائیں',
     'Chat  •  Call  •  Connect':'چیٹ  •  کال  •  کنیکٹ','Stay Close, Always':'ہمیشہ قریب رہیں',
     '6-digit security PIN':'6 ہندسوں کا سیکیورٹی پن','Username':'یوزرنیم','Phone Number':'فون نمبر','Admin username or phone':'ایڈمن یوزرنیم یا فون',
     'Phone Number or Username':'فون نمبر یا یوزرنیم','Password':'پاس ورڈ','Verify PIN':'پن کی تصدیق کریں','Continue':'جاری رکھیں','Create Account':'اکاؤنٹ بنائیں','Sign In':'سائن اِن',
     'Remember me':'مجھے یاد رکھیں','Forgot Password?':'پاس ورڈ بھول گئے؟','or':'یا','By signing in, you agree to our ':'سائن اِن کرنے سے آپ ہماری ','Terms & Privacy Policy':'شرائط اور رازداری کی پالیسی','Admin Login':'ایڈمن لاگ اِن',
     'Already have an account? Sign In':'پہلے سے اکاؤنٹ ہے؟ سائن اِن کریں','Your account opens after administrator approval.':'ایڈمن کی منظوری کے بعد آپ کا اکاؤنٹ کھلے گا۔',
     'Back to User Login':'صارف لاگ اِن پر واپس جائیں','More Than a Chat ♥':'صرف چیٹ سے بڑھ کر ♥',
     'Password reset is available from Account settings after login.':'لاگ اِن کے بعد اکاؤنٹ سیٹنگز سے پاس ورڈ تبدیل کیا جا سکتا ہے۔'
    };
    function tr(s){return localStorage.getItem('talkioLang')==='ur'?(URDU[s]||s):s}

    const rtcCfg={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
    const enc=new TextEncoder(),dec=new TextDecoder();
    function b64(buf){const bytes=new Uint8Array(buf);let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s)}
    function unb64(s){const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out.buffer}
    function initials(n='?'){return n.split(/[\s@]+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()}
    function when(d){if(!d)return'';const x=new Date(d),now=new Date();if(x.toDateString()===now.toDateString())return x.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});return x.toLocaleDateString()}
    function label(u){return u?.username?'@'+u.username:(u?.phone||u?.name||'')}
    async function profilePhotoFromFile(file){
     if(!file||!file.type?.startsWith('image/'))throw new Error(tr('Please choose an image file.'));
     if(file.size>12*1024*1024)throw new Error(tr('Image is too large. Please choose a smaller photo.'));
     const dataUrl=await new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=()=>reject(new Error('Could not read image'));
      reader.readAsDataURL(file);
     });
     const img=await new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>resolve(image);
      image.onerror=()=>reject(new Error('Could not open image'));
      image.src=dataUrl;
     });
     const max=512;
     const scale=Math.min(1,max/Math.max(img.width,img.height));
     const width=Math.max(1,Math.round(img.width*scale));
     const height=Math.max(1,Math.round(img.height*scale));
     const canvas=document.createElement('canvas');
     canvas.width=width;
     canvas.height=height;
     canvas.getContext('2d').drawImage(img,0,0,width,height);
     return canvas.toDataURL('image/jpeg',0.84);
    }

    function Avatar({user,size=46,status=false}){return <div className={'avatar '+(status?'status-ring':'')} style={{width:size,height:size}}>{user?.avatar?<img src={user.avatar} alt=""/>:<span>{initials(label(user))}</span>}</div>}
    async function fileData(file){return await new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(file)})}
    async function derivePasswordKey(password,salt){const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:new Uint8Array(salt),iterations:180000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
    async function makeCryptoBundle(password){const kp=await crypto.subtle.generateKey({name:'RSA-OAEP',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['encrypt','decrypt']);const publicKey=await crypto.subtle.exportKey('jwk',kp.publicKey),privateJwk=await crypto.subtle.exportKey('jwk',kp.privateKey);const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await derivePasswordKey(password,salt),ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(privateJwk)));return{publicKey,privateJwk,encryptedPrivateKey:b64(ct),keySalt:b64(salt),keyIv:b64(iv)}}
    async function unlockPrivate(bundle,password){const key=await derivePasswordKey(password,unb64(bundle.keySalt)),pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(unb64(bundle.keyIv))},key,unb64(bundle.encryptedPrivateKey));return JSON.parse(dec.decode(pt))}
    async function importPrivate(jwk){return crypto.subtle.importKey('jwk',jwk,{name:'RSA-OAEP',hash:'SHA-256'},false,['decrypt'])}
    async function importPublic(jwk){return crypto.subtle.importKey('jwk',jwk,{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt'])}
    async function encryptPayload(payload,senderPub,receiverPub){const aes=await crypto.subtle.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']),iv=crypto.getRandomValues(new Uint8Array(12)),ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},aes,enc.encode(JSON.stringify(payload))),raw=await crypto.subtle.exportKey('raw',aes),sp=await importPublic(senderPub),rp=await importPublic(receiverPub);const[senderKey,receiverKey]=await Promise.all([crypto.subtle.encrypt({name:'RSA-OAEP'},sp,raw),crypto.subtle.encrypt({name:'RSA-OAEP'},rp,raw)]);return{ciphertext:b64(ciphertext),iv:b64(iv),senderKey:b64(senderKey),receiverKey:b64(receiverKey)}}
    async function decryptMessage(m,me,privateKey){if(!m.encrypted||!m.ciphertext)return{...m,text:m.text||'',attachment:m.attachment||'',attachmentName:m.attachmentName||''};try{const mine=String(m.sender)===String(me._id),wrapped=mine?m.senderKey:m.receiverKey,raw=await crypto.subtle.decrypt({name:'RSA-OAEP'},privateKey,unb64(wrapped)),aes=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['decrypt']),plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(unb64(m.iv))},aes,unb64(m.ciphertext)),p=JSON.parse(dec.decode(plain));return{...m,...p}}catch{return{...m,text:'🔒 Unable to decrypt this message',attachment:'',attachmentName:''}}}

    export default function App(){
     const[token,setToken]=useState(localStorage.getItem(TK)||'');const[me,setMe]=useState(null);const[authMode,setAuthMode]=useState('login');const[err,setErr]=useState('');const[adminTemp,setAdminTemp]=useState('');const[adminBundle,setAdminBundle]=useState(null);
     const[settingsOpen,setSettingsOpen]=useState(false),[moreMenuOpen,setMoreMenuOpen]=useState(false),[settingsPage,setSettingsPage]=useState(''),[lang,setLang]=useState(localStorage.getItem('talkioLang')||'en'),[users,setUsers]=useState([]),[searchResults,setSearchResults]=useState([]),[requests,setRequests]=useState({incoming:[],outgoing:[]}),[locks,setLocks]=useState([]),[chats,setChats]=useState([]),[selected,setSelected]=useState(null),[messages,setMessages]=useState([]),[text,setText]=useState(''),[tab,setTab]=useState('chats'),[chatFilter,setChatFilter]=useState('all'),[search,setSearch]=useState(''),[typing,setTyping]=useState(false),[statuses,setStatuses]=useState([]),[statusViewer,setStatusViewer]=useState(null),[showStatusAdd,setShowStatusAdd]=useState(false);
     const socketRef=useRef(null),selectedRef=useRef(null),fileRef=useRef(),statusFileRef=useRef(),privateKeyRef=useRef(null);
     const[recording,setRecording]=useState(false),[recordSeconds,setRecordSeconds]=useState(0);
     const recorderRef=useRef(null),recordChunksRef=useRef([]),recordTimerRef=useRef(null),recordStreamRef=useRef(null),recordCancelledRef=useRef(false);
     useEffect(()=>{const saved=localStorage.getItem('talkioDarkMode');if(saved==='1')document.body.classList.add('talkio-dark');else if(saved==='0')document.body.classList.remove('talkio-dark')},[]);
     useEffect(()=>{const savedLang=localStorage.getItem('talkioLang')||'en';document.documentElement.lang=savedLang;document.documentElement.dir='ltr';document.body.classList.toggle('talkio-urdu',savedLang==='ur')},[lang]);
     const[call,setCall]=useState(null),[audioOutput,setAudioOutput]=useState('phone'),pcRef=useRef(null),localStreamRef=useRef(null),remoteVideo=useRef(),localVideo=useRef(),pendingIce=useRef([]);const[conference,setConference]=useState(null),[conferencePicker,setConferencePicker]=useState(false),[conferenceSelected,setConferenceSelected]=useState([]),confPeers=useRef(new Map()),confStream=useRef(null);
     useEffect(()=>()=>{clearInterval(recordTimerRef.current);try{if(recorderRef.current?.state==='recording')recorderRef.current.stop()}catch{}recordStreamRef.current?.getTracks().forEach(t=>t.stop())},[]);
     useEffect(()=>{selectedRef.current=selected},[selected]);const headers=useMemo(()=>({Authorization:`Bearer ${token}`,'Content-Type':'application/json'}),[token]);
     async function api(path,opts={}){const r=await fetch(API+path,{...opts,headers:{...headers,...opts.headers}});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.message||'Request failed');return data}
     async function decryptList(list,m=me){const key=privateKeyRef.current;if(!m||!key)return list;return Promise.all(list.map(x=>decryptMessage(x,m,key)))}
     async function loadCore(m=me){const[u,c,s,r,l]=await Promise.allSettled([api('/contacts'),api('/chats'),api('/statuses'),api('/contacts/requests'),api('/locks')]);setUsers(u.status==='fulfilled'?u.value:[]);setChats(c.status==='fulfilled'?c.value:[]);setStatuses(s.status==='fulfilled'?s.value:[]);setRequests(r.status==='fulfilled'?r.value:{incoming:[],outgoing:[]});setLocks(l.status==='fulfilled'?l.value:[])}
     async function bootstrap(){try{const m=await api('/me');{const jwk=sessionStorage.getItem(PK);if(!jwk)throw new Error('Secure key unavailable');privateKeyRef.current=await importPrivate(JSON.parse(jwk))}setMe(m);await loadCore(m)}catch{logout()}}
     useEffect(()=>{if(token)bootstrap()},[token]);
     useEffect(()=>{if(!token||!me?._id)return;const s=io(ROOT,{auth:{token},transports:['websocket','polling']});socketRef.current=s;s.on('message:new',async m=>{if(String(m.sender)===String(selectedRef.current?._id)&&me){const d=await decryptMessage(m,me,privateKeyRef.current);setMessages(v=>[...v,d]);s.emit('messages:delivered',{messageIds:[m._id]})}refreshChats()});s.on('message:sent',async m=>{if(me){const d=await decryptMessage(m,me,privateKeyRef.current);setMessages(v=>v.some(x=>x._id===m._id)?v:[...v,d])}});s.on('messages:delivered',({messageIds,deliveredAt})=>setMessages(v=>v.map(m=>messageIds.includes(String(m._id))?{...m,deliveredAt}:m)));s.on('messages:seen',({messageIds,seenAt})=>setMessages(v=>v.map(m=>messageIds.includes(String(m._id))?{...m,seen:true,seenAt,deliveredAt:m.deliveredAt||seenAt}:m)));s.on('typing:update',({from,typing})=>String(from)===String(selectedRef.current?._id)&&setTyping(typing));s.on('presence:update',p=>setUsers(v=>v.map(u=>String(u._id)===String(p.userId)?{...u,online:p.online,lastSeen:p.lastSeen||u.lastSeen}:u)));s.on('status:new',loadStatuses);s.on('status:deleted',loadStatuses);s.on('contact:request',loadRequests);s.on('contact:updated',()=>{loadContacts();loadRequests()});s.on('account:deleted',()=>{alert('Your account was deleted by admin.');logout()});bindCallSocket(s);bindConferenceSocket(s);return()=>s.disconnect()},[token,me?._id]);
     useEffect(()=>{if(!token||!search.trim()){setSearchResults([]);return}const t=setTimeout(()=>api('/users/search?q='+encodeURIComponent(search)).then(setSearchResults).catch(()=>setSearchResults([])),300);return()=>clearTimeout(t)},[search,token]);
     async function refreshChats(){try{setChats(await api('/chats'))}catch{}}async function loadStatuses(){try{setStatuses(await api('/statuses'))}catch{}}async function loadContacts(){try{setUsers(await api('/contacts'))}catch{}}async function loadRequests(){try{setRequests(await api('/contacts/requests'))}catch{}}async function loadLocks(){try{setLocks(await api('/locks'))}catch{}}
     function logout(){localStorage.removeItem(TK);sessionStorage.removeItem(PK);setToken('');setMe(null);privateKeyRef.current=null;socketRef.current?.disconnect()}
     async function authSubmit(e){e.preventDefault();setErr('');const f=new FormData(e.currentTarget),password=String(f.get('password')||'');try{
      if(authMode==='register'){const bundle=await makeCryptoBundle(password),body={username:f.get('username'),phone:f.get('phone'),password,publicKey:bundle.publicKey,encryptedPrivateKey:bundle.encryptedPrivateKey,keySalt:bundle.keySalt,keyIv:bundle.keyIv};const r=await fetch(API+'/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),d=await r.json();if(!r.ok)throw new Error(d.message);setAuthMode('login');setErr('✅ Account created. Wait for admin approval, then log in.');return}
      if(authMode==='admin'){const bundle=await makeCryptoBundle(password);const r=await fetch(API+'/auth/admin/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:f.get('login'),password,publicKey:bundle.publicKey,encryptedPrivateKey:bundle.encryptedPrivateKey,keySalt:bundle.keySalt,keyIv:bundle.keyIv})}),d=await r.json();if(!r.ok)throw new Error(d.message);setAdminBundle({...bundle,password});setAdminTemp(d.tempToken);setAuthMode('admin-pin');return}
      if(authMode==='admin-pin'){
       const pin=String(f.get('pin')||'').replace(/\D/g,'');
       if(!/^\d{6}$/.test(pin))throw new Error('Enter exactly 6 digits for the admin security PIN.');
       const r=await fetch(API+'/auth/admin/pin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({tempToken:adminTemp,pin})
       });
       const d=await r.json();
       if(!r.ok)throw new Error(d.message||'PIN verification failed');

       let jwk=null;
       let needsCryptoRepair=false;

       // First try the crypto bundle already stored on the server.
       // If the admin password was changed earlier without re-encrypting the
       // private key, this can fail even though the PIN is correct.
       if(d.crypto?.encryptedPrivateKey&&adminBundle?.password){
        try{
         jwk=await unlockPrivate(d.crypto,adminBundle.password);
        }catch{
         needsCryptoRepair=true;
        }
       }

       // Recovery path: use the fresh secure key bundle created during this
       // successful admin password login. This lets the admin continue instead
       // of getting stuck forever on the Verify PIN screen.
       if(!jwk&&adminBundle?.privateJwk){
        jwk=adminBundle.privateJwk;
        needsCryptoRepair=true;
       }

       if(!jwk)throw new Error('Admin secure chat key could not be opened. Please return to Admin Login and try again.');

       // If the old encrypted private key no longer matches the current password,
       // repair the stored crypto bundle immediately using the authenticated token.
       if(needsCryptoRepair&&adminBundle&&d.token){
        const repair=await fetch(API+'/me/crypto',{
         method:'PUT',
         headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${d.token}`
         },
         body:JSON.stringify({
          publicKey:adminBundle.publicKey,
          encryptedPrivateKey:adminBundle.encryptedPrivateKey,
          keySalt:adminBundle.keySalt,
          keyIv:adminBundle.keyIv
         })
        });
        const repairData=await repair.json().catch(()=>({}));
        if(!repair.ok)throw new Error(repairData.message||'Admin secure key repair failed');
       }

       sessionStorage.setItem(PK,JSON.stringify(jwk));
       localStorage.setItem(TK,d.token);
       setAdminTemp('');
       setAdminBundle(null);
       setErr('');
       setToken(d.token);
       return
      }
      const r=await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login:f.get('login'),password})}),d=await r.json();if(!r.ok)throw new Error(d.message);let privateJwk;if(d.crypto?.encryptedPrivateKey){privateJwk=await unlockPrivate(d.crypto,password)}else{const bundle=await makeCryptoBundle(password);privateJwk=bundle.privateJwk;await fetch(API+'/me/crypto',{method:'PUT',headers:{Authorization:`Bearer ${d.token}`,'Content-Type':'application/json'},body:JSON.stringify(bundle)})}sessionStorage.setItem(PK,JSON.stringify(privateJwk));localStorage.setItem(TK,d.token);setToken(d.token)
     }catch(ex){setErr(ex.message)}}
     const lockedIds=new Set(locks.map(x=>String(x.peer._id)));
     async function requestContact(u){try{const d=await api('/contacts/request/'+u._id,{method:'POST'});setErr('✅ '+d.message);await Promise.all([loadContacts(),loadRequests()])}catch(e){setErr(e.message)}}
     async function requestAction(id,action){try{await api('/contacts/requests/'+id+'/'+action,{method:'PATCH'});await Promise.all([loadContacts(),loadRequests()])}catch(e){setErr(e.message)}}
     async function openChat(u,silent=false){if(!u)return;if(lockedIds.has(String(u._id))){const lock=locks.find(x=>String(x.peer._id)===String(u._id)),secret=prompt(`This chat is locked with ${lock?.type||'a secret'}. Enter it to open:`);if(secret===null)return;try{await api('/locks/'+u._id+'/verify',{method:'POST',body:JSON.stringify({secret})})}catch(e){alert(e.message);return}}setSelected(u);setTab('chats');try{const raw=await api('/messages/'+u._id);setMessages(await decryptList(raw));await refreshChats()}catch(e){if(!silent)setErr(e.message)}}
     async function lockChat(u){const type=(prompt('Lock type: pin, pattern, or password','pin')||'').toLowerCase();if(!['pin','pattern','password'].includes(type))return alert('Use pin, pattern, or password');const secret=prompt(type==='pattern'?'Enter pattern as numbers, for example 1-2-5-8':`Enter ${type} (minimum 4 characters)`);if(!secret)return;try{await api('/locks/'+u._id,{method:'PUT',body:JSON.stringify({type,secret})});await loadLocks();setSelected(null)}catch(e){alert(e.message)}}
     async function unlockChat(u){if(!confirm('Remove the chat lock?'))return;try{await api('/locks/'+u._id,{method:'DELETE'});await loadLocks()}catch(e){alert(e.message)}}
     async function sendMessage(payload={}){if(!selected||!me?.publicKey||!selected.publicKey)return;const t=(payload.text??text).trim();if(!t&&!payload.attachment)return;setText('');socketRef.current?.emit('typing:stop',{to:selected._id});try{const plain={text:t,attachment:payload.attachment||'',attachmentName:payload.attachmentName||'',type:payload.type||'text'},crypt=await encryptPayload(plain,me.publicKey,selected.publicKey),m=await api('/messages',{method:'POST',body:JSON.stringify({receiver:selected._id,type:plain.type,...crypt})}),d=await decryptMessage(m,me,privateKeyRef.current);setMessages(v=>v.some(x=>x._id===m._id)?v:[...v,d]);refreshChats()}catch(e){setErr(e.message)}}

     function blobToDataURL(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error||new Error('Could not read voice message'));reader.readAsDataURL(blob)})}
     function recordingMime(){
      const types=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4'];
      return types.find(t=>window.MediaRecorder?.isTypeSupported?.(t))||'';
     }
     async function startVoiceRecording(){
      if(recording||text.trim())return;
      if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){setErr('Voice recording is not supported by this browser.');return}
      try{
       setErr('');
       const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
       const mime=recordingMime();
       const recorder=new MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:64000}:{audioBitsPerSecond:64000});
       recordStreamRef.current=stream;
       recorderRef.current=recorder;
       recordChunksRef.current=[];
       recordCancelledRef.current=false;
       setRecordSeconds(0);
       setRecording(true);
       socketRef.current?.emit('typing:stop',{to:selected?._id});
       recorder.ondataavailable=e=>{if(e.data?.size)recordChunksRef.current.push(e.data)};
       recorder.onerror=()=>{setErr('Microphone recording failed.');cancelVoiceRecording()};
       recorder.onstop=async()=>{
        clearInterval(recordTimerRef.current);
        recordTimerRef.current=null;
        recordStreamRef.current?.getTracks().forEach(t=>t.stop());
        recordStreamRef.current=null;
        setRecording(false);
        const cancelled=recordCancelledRef.current;
        const chunks=recordChunksRef.current;
        recordChunksRef.current=[];
        if(cancelled||!chunks.length)return;
        try{
         const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});
         if(blob.size<500)return;
         const data=await blobToDataURL(blob);
         const ext=(blob.type.includes('ogg')?'ogg':blob.type.includes('mp4')?'m4a':'webm');
         await sendMessage({attachment:data,attachmentName:`voice-${Date.now()}.${ext}`,type:'audio'});
        }catch(e){setErr(e.message||'Could not send voice message')}
       };
       recorder.start(250);
       recordTimerRef.current=setInterval(()=>{
        setRecordSeconds(sec=>{
         const next=sec+1;
         if(next>=120)setTimeout(()=>stopVoiceRecording(),0);
         return Math.min(next,120);
        });
       },1000);
      }catch(e){
       setRecording(false);
       recordStreamRef.current?.getTracks().forEach(t=>t.stop());
       recordStreamRef.current=null;
       const denied=e?.name==='NotAllowedError'||e?.name==='PermissionDeniedError';
       setErr(denied?'Microphone permission was denied. Please allow microphone access and try again.':(e.message||'Could not start microphone.'));
      }
     }
     function stopVoiceRecording(){
      const r=recorderRef.current;
      if(!r||r.state==='inactive')return;
      try{r.stop()}catch{}
     }
     function cancelVoiceRecording(){
      recordCancelledRef.current=true;
      clearInterval(recordTimerRef.current);
      recordTimerRef.current=null;
      const r=recorderRef.current;
      if(r&&r.state!=='inactive'){try{r.stop()}catch{}}
      else{
       recordStreamRef.current?.getTracks().forEach(t=>t.stop());
       recordStreamRef.current=null;
       setRecording(false);
      }
      setRecordSeconds(0);
     }
     function voiceTime(total){const m=Math.floor(total/60),sec=String(total%60).padStart(2,'0');return `${m}:${sec}`}
     async function chooseAttachment(e){const f=e.target.files?.[0];e.target.value='';if(!f)return;const data=await fileData(f);let type='file';if(f.type.startsWith('image/'))type='image';else if(f.type.startsWith('video/'))type='video';else if(f.type.startsWith('audio/'))type='audio';await sendMessage({attachment:data,attachmentName:f.name,type})}
     function typeChange(v){setText(v);if(selected){socketRef.current?.emit('typing:start',{to:selected._id});clearTimeout(window.__kt);window.__kt=setTimeout(()=>socketRef.current?.emit('typing:stop',{to:selected._id}),900)}}
     async function addStatus(x){try{await api('/statuses',{method:'POST',body:JSON.stringify(x)});setShowStatusAdd(false);loadStatuses()}catch(e){setErr(e.message)}}

     async function uploadStatusVideo(file){
      const form=new FormData();
      form.append('video',file,file.name||'status-video');
      const r=await fetch(API+'/statuses/video',{
       method:'POST',
       headers:{Authorization:`Bearer ${token}`},
       body:form
      });
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error([data.message,data.detail].filter(Boolean).join(' — ')||'Could not upload status video');
      return data;
     }

     async function statusFile(e){
      const f=e.target.files?.[0];
      e.target.value='';
      if(!f)return;
      try{
       setErr('');
       const isVideo=f.type.startsWith('video/') || /\.(mp4|mov|m4v|avi|mkv|webm|3gp|3g2|mpeg|mpg|mts|m2ts|ts|wmv|flv|ogv|vob|hevc)$/i.test(f.name||'');
       if(isVideo){
        await uploadStatusVideo(f);
        setShowStatusAdd(false);
        await loadStatuses();
        return;
       }
       if(f.type.startsWith('image/')){
        const media=await fileData(f);
        await addStatus({type:'image',media});
        return;
       }
       throw new Error('Please select an image or video file.');
      }catch(err){
       setErr(err.message||'Could not add status');
      }
     }
    async function viewStatus(g){setStatusViewer(g);for(const s of g.statuses)if(String(g.user._id)!==String(me._id))api('/statuses/'+s._id+'/view',{method:'POST'}).catch(()=>{})}
     async function getMedia(video=true){return navigator.mediaDevices.getUserMedia({audio:true,video})}function cleanupCall(){pcRef.current?.close();pcRef.current=null;localStreamRef.current?.getTracks().forEach(t=>t.stop());localStreamRef.current=null;pendingIce.current=[];setCall(null)}
     async function makeCall(type,u=selected){if(!u)return;try{const stream=await getMedia(type==='video'),pc=new RTCPeerConnection(rtcCfg),callId=crypto.randomUUID();localStreamRef.current=stream;pcRef.current=pc;stream.getTracks().forEach(t=>pc.addTrack(t,stream));pc.ontrack=e=>{if(remoteVideo.current)remoteVideo.current.srcObject=e.streams[0]};pc.onicecandidate=e=>e.candidate&&socketRef.current.emit('call:ice',{to:u._id,candidate:e.candidate,callId});const offer=await pc.createOffer();await pc.setLocalDescription(offer);setCall({direction:'out',peer:u,type,callId,state:'calling'});setTimeout(()=>{if(localVideo.current)localVideo.current.srcObject=stream},50);socketRef.current.emit('call:offer',{to:u._id,offer,type,callId},ack=>{if(!ack?.ok){alert('User is offline, unavailable, or not in your contacts');cleanupCall()}})}catch(e){alert('Camera/microphone permission is required: '+e.message)}}
     function bindCallSocket(s){s.on('call:incoming',d=>setCall({direction:'in',peer:users.find(u=>String(u._id)===String(d.from))||{_id:d.from,username:d.callerName},...d,state:'ringing'}));s.on('call:answered',async d=>{if(!pcRef.current)return;await pcRef.current.setRemoteDescription(d.answer);for(const c of pendingIce.current)await pcRef.current.addIceCandidate(c);pendingIce.current=[];setCall(v=>v&&({...v,state:'connected'}))});s.on('call:ice',async({candidate})=>{if(pcRef.current?.remoteDescription)try{await pcRef.current.addIceCandidate(candidate)}catch{}else pendingIce.current.push(candidate)});s.on('call:rejected',cleanupCall);s.on('call:ended',cleanupCall);s.on('call:unavailable',cleanupCall)}
     async function answerCall(){try{const stream=await getMedia(call.type==='video'),pc=new RTCPeerConnection(rtcCfg);localStreamRef.current=stream;pcRef.current=pc;stream.getTracks().forEach(t=>pc.addTrack(t,stream));pc.ontrack=e=>{if(remoteVideo.current)remoteVideo.current.srcObject=e.streams[0]};pc.onicecandidate=e=>e.candidate&&socketRef.current.emit('call:ice',{to:call.from,candidate:e.candidate,callId:call.callId});await pc.setRemoteDescription(call.offer);const ans=await pc.createAnswer();await pc.setLocalDescription(ans);socketRef.current.emit('call:answer',{to:call.from,answer:ans,callId:call.callId});setCall(v=>({...v,state:'connected'}));setTimeout(()=>{if(localVideo.current)localVideo.current.srcObject=stream},50)}catch(e){alert(e.message);rejectCall()}}function rejectCall(){if(call?.direction==='in')socketRef.current.emit('call:reject',{to:call.from,callId:call.callId});else if(call?.peer)socketRef.current.emit('call:end',{to:call.peer._id,callId:call.callId});cleanupCall()}
     async function cycleCallAudio(){
      const order=['phone','speaker','bluetooth'];
      const next=order[(order.indexOf(audioOutput)+1)%order.length];

      if(next==='bluetooth'){
       try{
        const devices=await navigator.mediaDevices?.enumerateDevices?.();
        const bluetooth=(devices||[]).find(d=>d.kind==='audiooutput'&&/bluetooth|buds|airpods|headset|wireless/i.test(d.label||''));
        if(!bluetooth){
         alert('Connect a Bluetooth audio device first.');
         return;
        }
        if(typeof remoteVideo.current?.setSinkId==='function'){
         await remoteVideo.current.setSinkId(bluetooth.deviceId);
        }
        setAudioOutput('bluetooth');
        return;
       }catch(e){
        alert('Bluetooth audio selection is not supported by this browser/device.');
        return;
       }
      }

      try{
       if(typeof remoteVideo.current?.setSinkId==='function'){
        await remoteVideo.current.setSinkId('default');
       }
      }catch{}

      setAudioOutput(next);
     }
     function openConferencePicker(){setConferenceSelected([]);setConferencePicker(true)}
    function toggleConferenceUser(id){
     setConferenceSelected(v=>{
      const key=String(id);
      if(v.includes(key))return v.filter(x=>x!==key);
      if(v.length>=7){alert('Conference call limit is 8 people including you. You can select up to 7 other users.');return v}
      return [...v,key];
     })
    }
    async function startConference(type='video',invitees=[]){
     if(!invitees.length)return alert('Select at least one user for the conference call.');
     if(invitees.length>7)return alert('Conference call limit is 8 people including you.');
     try{
      setConferencePicker(false);
      const stream=await getMedia(type==='video');
      confStream.current=stream;
      socketRef.current.emit('conference:create',{invitees:invitees.map(u=>u._id),type},ack=>{
       if(ack?.ok){
        setConference({roomId:ack.roomId,type,members:invitees.map(x=>x._id),incoming:false});
        setConferenceSelected([]);
        socketRef.current.emit('conference:join',{roomId:ack.roomId},j=>(j?.peers||[]).forEach(id=>createConfPeer(id,true,ack.roomId,type)))
       }else{
        alert(ack?.message||'Could not create conference call');
        confStream.current?.getTracks().forEach(t=>t.stop());
        confStream.current=null;
       }
      })
     }catch(e){alert(e.message)}
    }
     function bindConferenceSocket(s){s.on('conference:incoming',d=>setConference({...d,incoming:true}));s.on('conference:peer-joined',({roomId,userId})=>createConfPeer(userId,true,roomId,conference?.type||'video'));s.on('conference:signal',async({roomId,from,data})=>handleConfSignal(roomId,from,data));s.on('conference:peer-left',({userId})=>{confPeers.current.get(userId)?.close();confPeers.current.delete(userId)})}
     async function joinConference(){try{const stream=await getMedia(conference.type==='video');confStream.current=stream;socketRef.current.emit('conference:join',{roomId:conference.roomId},ack=>{if(!ack?.ok)return;setConference(v=>({...v,incoming:false}));(ack.peers||[]).forEach(id=>createConfPeer(id,true,conference.roomId,conference.type))})}catch(e){alert(e.message)}}
     async function createConfPeer(peerId,initiator,roomId,type){if(String(peerId)===String(me?._id)||confPeers.current.has(peerId))return;const pc=new RTCPeerConnection(rtcCfg);confPeers.current.set(peerId,pc);confStream.current?.getTracks().forEach(t=>pc.addTrack(t,confStream.current));pc.onicecandidate=e=>e.candidate&&socketRef.current.emit('conference:signal',{roomId,to:peerId,data:{candidate:e.candidate}});pc.ontrack=e=>setTimeout(()=>{const el=document.getElementById('conf-'+peerId);if(el)el.srcObject=e.streams[0]},20);if(initiator){const offer=await pc.createOffer();await pc.setLocalDescription(offer);socketRef.current.emit('conference:signal',{roomId,to:peerId,data:{offer}})}}
     async function handleConfSignal(roomId,from,data){let pc=confPeers.current.get(from);if(!pc){await createConfPeer(from,false,roomId,conference?.type||'video');pc=confPeers.current.get(from)}if(data.offer){await pc.setRemoteDescription(data.offer);const ans=await pc.createAnswer();await pc.setLocalDescription(ans);socketRef.current.emit('conference:signal',{roomId,to:from,data:{answer:ans}})}else if(data.answer)await pc.setRemoteDescription(data.answer);else if(data.candidate)try{await pc.addIceCandidate(data.candidate)}catch{}}
     function cleanupConference(){confPeers.current.forEach(p=>p.close());confPeers.current.clear();confStream.current?.getTracks().forEach(t=>t.stop());confStream.current=null;setConference(null)}function leaveConference(){if(conference)socketRef.current.emit('conference:leave',{roomId:conference.roomId});cleanupConference()}

     if(!token)return <Auth mode={authMode} setMode={setAuthMode} submit={authSubmit} err={err}/>;if(!me)return <div className="splash"><div className="wa-logo"><MessageCircle/></div><h2>Talkio</h2><p>{tr('Connecting…')}</p></div>;if(me.role==='admin'&&tab==='admin')return <div style={{minHeight:'100vh',background:'#fff',color:'#111'}}>
       <AdminPanel api={api} me={me} logout={logout} back={()=>setTab('chats')}/>
      </div>;
     const visibleUsers=users.filter(u=>!lockedIds.has(String(u._id))),lockedUsers=users.filter(u=>lockedIds.has(String(u._id)));
     return <div className="app-shell wa-desktop">
      <nav className="wa-rail">
       <div className="rail-top">
        <button className={tab==='chats'?'active':''} onClick={()=>setTab('chats')} title={tr("Chats")}><MessageCircle/><span>{tr('Chats')}</span></button>
        <button className={tab==='calls'?'active':''} onClick={()=>setTab('calls')} title={tr("Calls")}><Phone/><span>{tr('Calls')}</span></button>
        <button className={tab==='status'?'active':''} onClick={()=>setTab('status')} title={tr("Status")}><Clock3/><span>{tr('Status')}</span></button>
        <button onClick={openConferencePicker} title={tr("Conference")}><Users/><span>{tr('Conference')}</span></button>
        {me.role==='admin'&&<button onClick={()=>setTab('admin')} title={tr("Admin approvals")}><ShieldCheck/><span>{tr('Admin')}</span></button>}
       </div>
       <div className="rail-bottom settings-anchor">
        <button title={tr("Settings")} onClick={()=>setSettingsOpen(v=>!v)}><Settings/><span>{tr('Settings')}</span></button>
        {settingsOpen&&<SettingsMenu me={me} close={()=>setSettingsOpen(false)} open={p=>{setSettingsPage(p);setSettingsOpen(false)}} logout={logout}/>} 
        <button className="profile-button" onClick={()=>{setSettingsPage('account');setSettingsOpen(false)}} title="Profile"><Avatar user={me} size={30}/><span>{me.username||tr('Profile')}</span></button>
        <button onClick={logout} title={tr("Log out")}><LogOut/><span>{tr('Log out')}</span></button>
       </div>
      </nav>
      <aside className={'sidebar '+(selected?'hide-mobile':'')}><header className="chat-list-head"><h1>{tab==='chats'?tr('Chats'):tab==='status'?tr('Status'):tr('Calls')}</h1><div>{tab==='chats'&&<button onClick={()=>setChatFilter('requests')} title="Add requests"><UserPlus/></button>}<button className="more-menu-trigger" onClick={()=>setMoreMenuOpen(v=>!v)} aria-label="More options" aria-expanded={moreMenuOpen}><MoreVertical/></button></div></header><div className="search"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={tr("Search username or phone number")}/></div>
       {tab==='chats'&&<div className="chat-filters"><button className={chatFilter==='all'?'active':''} onClick={()=>setChatFilter('all')}>{tr('All')}</button><button className={chatFilter==='unread'?'active':''} onClick={()=>setChatFilter('unread')}>{tr('Unread')}</button><button className={chatFilter==='locked'?'active':''} onClick={()=>setChatFilter('locked')}><Lock/> {tr('Lock')}</button><button className={chatFilter==='requests'?'active':''} onClick={()=>setChatFilter('requests')}>{tr('Requests')} {requests.incoming.length>0&&<b className="filter-count">{requests.incoming.length}</b>}</button></div>}
       {search.trim()&&tab==='chats'?<SearchResults results={searchResults} contacts={users} outgoing={requests.outgoing} add={requestContact}/>:tab==='status'?<StatusList me={me} groups={statuses} open={viewStatus} add={()=>setShowStatusAdd(true)}/>:tab==='calls'?<Calls users={users} call={makeCall} conference={openConferencePicker}/>:chatFilter==='requests'?<ContactRequests data={requests} action={requestAction}/>:<ChatList chats={chats} users={chatFilter==='locked'?lockedUsers:visibleUsers} filter={chatFilter} locked={lockedIds} open={openChat} unlock={unlockChat}/>} 
      </aside>
      {moreMenuOpen&&<MoreFeaturesMenu
        me={me}
        tab={tab}
        close={()=>setMoreMenuOpen(false)}
        go={next=>{setTab(next);setMoreMenuOpen(false)}}
        conference={()=>{setMoreMenuOpen(false);openConferencePicker()}}
        settings={()=>{setMoreMenuOpen(false);setSettingsOpen(true)}}
        profile={()=>{setMoreMenuOpen(false);setSettingsPage('account')}}
        logout={()=>{setMoreMenuOpen(false);logout()}}
      />}
      <main className={'chat-pane '+(!selected?'empty-mobile':'')}>{!selected?<div className="wa-empty-panel"><div className="empty-center"><LockKeyhole/><h2>{tr('Private messaging')}</h2><p>{tr('New message and media contents are end-to-end encrypted. Account metadata used for search and approval is not E2EE.')}</p></div></div>:<><header className="chat-head"><button className="back" onClick={()=>setSelected(null)}><ArrowLeft/></button><Avatar user={selected}/><div className="peer"><b>{label(selected)}</b><span>{selected.phone} · {typing?tr('typing…'):selected.online?tr('online'):selected.lastSeen?tr('last seen ')+when(selected.lastSeen):tr('offline')}</span></div><div className="head-actions"><button onClick={()=>makeCall('video')}><Video/></button><button onClick={()=>makeCall('audio')}><Phone/></button>{lockedIds.has(String(selected._id))?<button onClick={()=>unlockChat(selected)} title={tr("Remove lock")}><Unlock/></button>:<button onClick={()=>lockChat(selected)} title={tr("Lock chat")}><Lock/></button>}</div></header><div className="messages">{messages.map(m=><Bubble key={m._id} m={m} mine={String(m.sender)===String(me._id)}/>)}</div><div className={'composer '+(recording?'voice-recording':'')}>
     {recording?<>
      <button className="voice-cancel" type="button" onClick={cancelVoiceRecording} title={tr('Cancel voice message')}><X/></button>
      <div className="voice-record-status"><span className="voice-dot"/><b>{voiceTime(recordSeconds)}</b><span>{tr('Recording voice message')}</span></div>
      <button className="send voice-stop" type="button" onClick={stopVoiceRecording} title={tr('Stop and send')}><Square/></button>
     </>:<>
      <button type="button"><Smile/></button>
      <button type="button" onClick={()=>fileRef.current.click()}><Paperclip/></button>
      <input ref={fileRef} type="file" hidden onChange={chooseAttachment}/>
      <input value={text} onChange={e=>typeChange(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}}} placeholder={tr("Type an encrypted message")}/>
      <button className="send" type="button" onClick={()=>text.trim()?sendMessage():startVoiceRecording()} title={text.trim()?tr('Send'):tr('Record voice message')}>{text.trim()?<Send/>:<Mic/>}</button>
     </>}
    </div></>}</main>
      {settingsPage==='help'&&<HelpSupportPanel close={()=>setSettingsPage('')}/>} 
      {settingsPage&&settingsPage!=='help'&&<SettingsPanel page={settingsPage} me={me} api={api} lang={lang} setLang={v=>{setLang(v);localStorage.setItem('talkioLang',v)}} close={()=>setSettingsPage('')} onMe={setMe}/>} {showStatusAdd&&<StatusAdd close={()=>setShowStatusAdd(false)} submit={addStatus} choose={()=>statusFileRef.current.click()} inputRef={statusFileRef} file={statusFile}/>} {statusViewer&&<StatusViewer group={statusViewer} me={me} api={api} close={()=>{setStatusViewer(null);loadStatuses()}} onDeleted={loadStatuses}/>}{call&&<CallOverlay call={call} answer={answerCall} end={rejectCall} remoteVideo={remoteVideo} localVideo={localVideo}/>} {conferencePicker&&<ConferencePicker users={users} selected={conferenceSelected} toggle={toggleConferenceUser} close={()=>{setConferencePicker(false);setConferenceSelected([])}} start={type=>startConference(type,users.filter(u=>conferenceSelected.includes(String(u._id))))}/>} {conference&&<ConferenceOverlay conf={conference} users={users} join={joinConference} leave={leaveConference} stream={confStream.current}/>} 
     </div>
    }


    function MoreFeaturesMenu({me,tab,close,go,conference,settings,profile,logout}){
     const item=(key,Icon,labelText,onClick,extraClass='')=>
      <button
       type="button"
       className={'more-feature-item '+(tab===key?'active ':'')+extraClass}
       onClick={onClick}
      >
       <span className="more-feature-icon"><Icon/></span>
       <span className="more-feature-label">{tr(labelText)}</span>
       <ChevronRight className="more-feature-arrow"/>
      </button>;

     return <div className="more-features-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}>
      <section className="more-features-menu">
       <div className="more-features-head">
        <div>
         <b>More</b>
         <small>Quick access</small>
        </div>
        <button type="button" className="more-features-close" onClick={close}><X/></button>
       </div>

       <div className="more-features-list">
        {item('chats',MessageCircle,'Chats',()=>go('chats'))}
        {item('calls',Phone,'Calls',()=>go('calls'))}
        {item('status',Clock3,'Status',()=>go('status'))}
        {item('',Users,'Conference',conference)}
        {me.role==='admin'&&item('admin',ShieldCheck,'Admin approvals',()=>go('admin'),'admin-item')}
        {item('',Settings,'Settings',settings)}
        {item('',User,'Account',profile)}
        {item('',LogOut,'Log out',logout,'logout-item')}
       </div>
      </section>
     </div>
    }


    function Auth({mode,setMode,submit,err}){const ok=err?.startsWith('✅'),admin=mode==='admin'||mode==='admin-pin',register=mode==='register';const[show,setShow]=useState(false);const[authLang,setAuthLang]=useState(()=>localStorage.getItem('talkioLang')||'en');function changeAuthLang(){const next=authLang==='en'?'ur':'en';setAuthLang(next);localStorage.setItem('talkioLang',next);document.documentElement.lang=next;document.documentElement.dir='ltr';document.body.classList.toggle('talkio-urdu',next==='ur')}return <div className="talkio-auth"><button type="button" className="auth-language" onClick={changeAuthLang}><Globe2/> {authLang==='ur'?'اردو':'English'} <span>⌄</span></button><div className="talkio-login-card"><div className="talkio-brand"><div className={'talkio-mark '+(admin?'admin-mark':'')}><MessageCircle/></div><h1>{admin?'Talkio Admin':'Talkio'}</h1><p>{mode==='admin-pin'?tr('Secure administrator verification'):admin?tr('Administrator access'):register?tr('Create your Talkio account'):tr('Chat  •  Call  •  Connect')}</p>{!admin&&!register&&<small>{tr('Stay Close, Always')}</small>}</div><form onSubmit={submit}>{mode==='admin-pin'?<div className="talkio-field"><KeyRound/><input name="pin" type={show?'text':'password'} inputMode="numeric" placeholder={tr("6-digit security PIN")} minLength="6" maxLength="6" pattern="[0-9]{6}" required autoFocus/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff/>:<Eye/>}</button></div>:<>{register&&<div className="talkio-field"><User/><input name="username" placeholder={tr("Username")} pattern="[A-Za-z0-9_.]{3,32}" required/></div>}<div className="talkio-field"><Phone/><input name={register?'phone':'login'} type={register?'tel':'text'} placeholder={register?tr('Phone Number'):admin?tr('Admin username or phone'):tr('Phone Number or Username')} required/></div><div className="talkio-field"><LockKeyhole/><input name="password" type={show?'text':'password'} placeholder={tr("Password")} minLength="6" required/><button type="button" onClick={()=>setShow(v=>!v)}>{show?<EyeOff/>:<Eye/>}</button></div></>}{err&&<div className={ok?'success':'error'}>{err}</div>}<button className="talkio-primary">{mode==='admin-pin'?tr('Verify PIN'):admin?tr('Continue'):'register'===mode?tr('Create Account'):tr('Sign In')}</button></form>{mode==='login'&&<><div className="login-utility"><label><input type="checkbox" defaultChecked/> {tr('Remember me')}</label><button type="button" onClick={()=>alert(tr('Password reset is available from Account settings after login.'))}>{tr('Forgot Password?')}</button></div><div className="auth-divider"><span>{tr('or')}</span></div><button className="talkio-create" onClick={()=>setMode('register')}>{tr('Create Account')}</button><div className="terms-line">{tr('By signing in, you agree to our ')}<b>{tr('Terms & Privacy Policy')}</b></div><button className="admin-text-link" onClick={()=>setMode('admin')}><ShieldCheck/> {tr('Admin Login')}</button></>}{register&&<><button className="link" onClick={()=>setMode('login')}>{tr('Already have an account? Sign In')}</button><p className="approval-note">{tr('Your account opens after administrator approval.')}</p></>}{admin&&<button className="link back-user-login" onClick={()=>setMode('login')}><ArrowLeft/> {tr('Back to User Login')}</button>}<div className="talkio-footer">{tr("More Than a Chat ♥")}</div></div></div>}

    function SettingsMenu({me,close,open,logout}){
     const[darkMode,setDarkMode]=useState(()=>document.body.classList.contains('talkio-dark'));

     function toggleDarkMode(){
      const next=!darkMode;
      setDarkMode(next);
      document.body.classList.toggle('talkio-dark',next);
      localStorage.setItem('talkioDarkMode',next?'1':'0');
     }

     return <div className="settings-menu">
      <button onClick={()=>open('account')}><User/><span>{tr('Account')}</span><ChevronRight/></button>

      <button onClick={()=>open('language')}><Languages/><span>{tr('Language')}</span><ChevronRight/></button>

      <div
       className="settings-dark-row"
       style={{
        display:'flex',
        alignItems:'center',
        gap:'12px',
        padding:'10px 14px',
        width:'100%',
        boxSizing:'border-box',
        position:'relative'
       }}
      >
       <Clock3/>
       <span style={{flex:1}}>{tr('Dark Mode')}</span>

       <span
        role="switch"
        aria-checked={darkMode}
        tabIndex={0}
        onClick={toggleDarkMode}
        onKeyDown={e=>{
         if(e.key==='Enter'||e.key===' '){
          e.preventDefault();
          toggleDarkMode();
         }
        }}
        style={{
         position:'relative',
         display:'inline-block',
         width:'28px',
         height:'16px',
         flex:'0 0 28px',
         borderRadius:'999px',
         background:darkMode?'#0d8cff':'#d7e2ee',
         cursor:'pointer',
         transition:'background .2s ease',
         boxSizing:'border-box'
        }}
       >
        <span
         style={{
          position:'absolute',
          top:'2px',
          left:'2px',
          width:'12px',
          height:'12px',
          borderRadius:'50%',
          background:'#fff',
          boxShadow:'0 1px 2px rgba(0,0,0,.22)',
          transform:darkMode?'translateX(12px)':'translateX(0)',
          transition:'transform .2s ease',
          pointerEvents:'none'
         }}
        />
       </span>
      </div>

      <button onClick={()=>{close();open('help')}}><ShieldCheck/><span>{tr('Help & Support')}</span><ChevronRight/></button>

      {me.role==='admin'&&<div className="settings-admin-note"><ShieldCheck/> {tr('Admin account')}</div>}

      <button className="settings-logout" onClick={logout}><LogOut/><span>{tr('Logout')}</span></button>
     </div>
    }
    function HelpSupportPanel({close}){
     const [openItem,setOpenItem]=useState(null);

     const items=[
      {
       id:'faq',
       Icon:ShieldCheck,
       title:'Help Center / FAQs',
       body:<div>When someone creates an account, he/she will take approval from the admin.</div>,
       tone:'blue'
      },
      {
       id:'contact',
       Icon:Phone,
       title:'Contact Support',
       body:<div><b>03445088350</b><br/>or Msg to Admin.</div>,
       tone:'green'
      },
      {
       id:'privacy',
       Icon:Lock,
       title:'Privacy',
       body:<div>The user's password is private.</div>,
       tone:'purple'
      },
      {
       id:'about',
       Icon:MessageCircle,
       title:'About Talkio',
       body:<div>Talkio / Website</div>,
       tone:'orange'
      }
     ];

     return <div className="settings-overlay help-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}>
      <section className="settings-panel help-panel">
       <header className="help-header">
        <button type="button" className="help-close" onClick={close}><X/></button>
        <div>
         <b>Help & Support</b>
         <small>Everything you need in one place</small>
        </div>
       </header>

       <div className="help-content">
        <div className="help-hero">
         <div className="help-hero-icon"><ShieldCheck/></div>
         <div>
          <h2>How can we help?</h2>
          <p>Find answers, contact support, and review privacy information.</p>
         </div>
        </div>

        <div className="help-list">
         {items.map(({id,Icon,title,body,tone})=>{
          const opened=openItem===id;
          return <div className={'help-item help-'+tone+(opened?' open':'')} key={id}>
           <button
            type="button"
            className="help-row"
            onClick={()=>setOpenItem(opened?null:id)}
            aria-expanded={opened}
           >
            <span className="help-icon"><Icon/></span>
            <span className="help-row-text">{title}</span>
            <ChevronRight className="help-chevron"/>
           </button>
           {opened&&<div className="help-answer">{body}</div>}
          </div>
         })}
        </div>
       </div>
      </section>
     </div>
    }
    function SettingsPanel({page,me,api,lang,setLang,close,onMe}){
     const[name,setName]=useState(me.name||'');
     const[username,setUsername]=useState(me.username||'');
     const[oldPassword,setOldPassword]=useState('');
     const[newPassword,setNewPassword]=useState('');
     const[msg,setMsg]=useState('');
     const[photoBusy,setPhotoBusy]=useState(false);
     const[profilePreview,setProfilePreview]=useState(false);
     const photoInputRef=useRef(null);

     async function saveName(){
      setMsg('');
      try{
       const u=await api('/me',{method:'PATCH',body:JSON.stringify({name})});
       onMe(u);
       setMsg(tr('Name updated successfully.'));
      }catch(e){setMsg(e.message)}
     }

     async function saveUsername(){
      setMsg('');
      const clean=String(username||'').trim(); // preserve capitalization and spaces exactly

      if(clean.length<3||clean.length>60){
       setMsg('Username must be between 3 and 60 characters.');
       return;
      }

      try{
       const u=await api('/me',{
        method:'PATCH',
        body:JSON.stringify({username:clean})
       });
       setUsername(u.username||clean);
       onMe(u);
       setMsg(tr('Username updated successfully.'));
      }catch(e){
       setMsg(e.message);
      }
     }

     async function changePhoto(e){
      const file=e.target.files?.[0];
      e.target.value='';
      if(!file)return;
      setMsg('');
      setPhotoBusy(true);
      try{
       const avatar=await profilePhotoFromFile(file);
       const u=await api('/me',{method:'PATCH',body:JSON.stringify({avatar})});
       onMe(u);
       setMsg(tr('Profile photo updated.'));
      }catch(e){setMsg(e.message)}
      finally{setPhotoBusy(false)}
     }

     async function removePhoto(){
      setMsg('');
      setPhotoBusy(true);
      try{
       const u=await api('/me',{method:'PATCH',body:JSON.stringify({avatar:''})});
       onMe(u);
       setMsg(tr('Profile photo removed.'));
      }catch(e){setMsg(e.message)}
      finally{setPhotoBusy(false)}
     }

     async function resetPassword(){
      setMsg('');
      try{
       const currentJwkText=sessionStorage.getItem(PK);
       let cryptoUpdate=null;

       if(currentJwkText&&newPassword){
        const privateJwk=JSON.parse(currentJwkText);
        const salt=crypto.getRandomValues(new Uint8Array(16));
        const iv=crypto.getRandomValues(new Uint8Array(12));
        const key=await derivePasswordKey(newPassword,salt);
        const ct=await crypto.subtle.encrypt(
         {name:'AES-GCM',iv},
         key,
         enc.encode(JSON.stringify(privateJwk))
        );
        cryptoUpdate={
         encryptedPrivateKey:b64(ct),
         keySalt:b64(salt),
         keyIv:b64(iv)
        };
       }

       await api('/me/password',{
        method:'PATCH',
        body:JSON.stringify({
         oldPassword,
         newPassword,
         ...(cryptoUpdate||{})
        })
       });

       setOldPassword('');
       setNewPassword('');
       setMsg(tr('Password changed successfully.'));
      }catch(e){setMsg(e.message)}
     }

     return <div className="settings-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}>
       {profilePreview&&<div onClick={()=>setProfilePreview(false)}
        style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,0,0,.72)',display:'grid',placeItems:'center',padding:20}}>
        <div onClick={e=>e.stopPropagation()}
         style={{position:'relative',background:'#fff',borderRadius:22,padding:'28px 28px 24px',minWidth:280,maxWidth:'90vw',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,.35)'}}>
         <button type="button" onClick={()=>setProfilePreview(false)}
          style={{position:'absolute',right:12,top:12,width:34,height:34,border:0,borderRadius:'50%',display:'grid',placeItems:'center',cursor:'pointer'}}><X/></button>
         <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          <Avatar user={me} size={190}/>
         </div>
         <h2 style={{margin:0,fontSize:22,overflowWrap:'anywhere'}}>{me.username}</h2>
        </div>
       </div>}
      <section className="settings-panel">
       <header>
        <button onClick={close}><ArrowLeft/></button>
        <h2>{page==='account'?tr('Account'):tr('Language')}</h2>
       </header>

       {page==='account'?<div className="account-settings">
        <div className="account-avatar">
         <div style={{position:'relative',display:'inline-flex'}}>
          <button type="button" onClick={()=>setProfilePreview(true)}
            style={{border:0,padding:0,background:'transparent',borderRadius:'50%',cursor:'pointer',display:'inline-flex'}}>
            <Avatar user={{...me,name:name||me.username}} size={92}/>
           </button>
          <button
           type="button"
           onClick={()=>photoInputRef.current?.click()}
           disabled={photoBusy}
           title={tr('Change Photo')}
           style={{
            position:'absolute',right:'-2px',bottom:'-2px',
            width:'32px',height:'32px',minWidth:'32px',padding:0,
            borderRadius:'50%',display:'grid',placeItems:'center'
           }}
          >
           <Camera style={{width:16,height:16}}/>
          </button>
         </div>

         <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={changePhoto}/>

         <b>{me.username}</b>

         <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:8}}>
          <button
           type="button"
           onClick={()=>photoInputRef.current?.click()}
           disabled={photoBusy}
           style={{width:'auto',padding:'8px 12px'}}
          >
           <Camera style={{width:16,height:16}}/> {photoBusy?'...':tr('Change Photo')}
          </button>

          {me.avatar&&<button
           type="button"
           onClick={removePhoto}
           disabled={photoBusy}
           style={{width:'auto',padding:'8px 12px'}}
          >
           <Trash2 style={{width:16,height:16}}/> {tr('Remove Photo')}
          </button>}
         </div>
        </div>

        {me.role!=='admin'&&<div className="settings-block">
         <label>{tr('Change Name')}
          <input
           value={name}
           onChange={e=>setName(e.target.value)}
           placeholder={tr('Your display name')}
          />
          <button onClick={saveName}>{tr('Save Name')}</button>
         </label>
        </div>}

        <div className="settings-block">
         <label>{me.role==='admin'?tr('Reset Username'):tr('Change Username')}
          <input
           value={username}
           onChange={e=>setUsername(e.target.value)}
           placeholder={me.role==='admin'?tr('Admin Login Username'):tr('New username')}
           autoCapitalize="none"
           autoCorrect="off"
           spellCheck={false}
          />
          <button onClick={saveUsername}>{tr('Save Username')}</button>
         </label>
        </div>

        <div className="settings-block">
         <h3><LockKeyhole/> {tr('Reset Password')}</h3>
         <input
          type="password"
          value={oldPassword}
          onChange={e=>setOldPassword(e.target.value)}
          placeholder={tr('Current password')}
         />
         <input
          type="password"
          value={newPassword}
          onChange={e=>setNewPassword(e.target.value)}
          placeholder={tr('New password (6+ characters)')}
         />
         <button onClick={resetPassword}>{tr('Change Password')}</button>
        </div>

        {msg&&<p className="settings-msg">{msg}</p>}
       </div>:<div className="language-list">
        <button
         className={lang==='en'?'selected':''}
         onClick={()=>{
          setLang('en');
          localStorage.setItem('talkioLang','en');
          document.documentElement.lang='en';
          document.documentElement.dir='ltr';
         }}
        >
         <span className="radio"></span>
         <div><b>English</b><small>{tr('Use English language')}</small></div>
        </button>

        <button
         className={lang==='ur'?'selected':''}
         onClick={()=>{
          setLang('ur');
          localStorage.setItem('talkioLang','ur');
          document.documentElement.lang='ur';
          document.documentElement.dir='ltr';
         }}
        >
         <span className="radio"></span>
         <div><b>اردو</b><small>اردو زبان استعمال کریں</small></div>
        </button>
       </div>}
      </section>
     </div>
    }
    function AdminPanel({api,me,logout,back}){const[requests,setRequests]=useState([]),[allUsers,setAllUsers]=useState([]),[loading,setLoading]=useState(true),[msg,setMsg]=useState(''),[query,setQuery]=useState('');async function load(){setLoading(true);try{const[r,u]=await Promise.all([api('/admin/requests'),api('/admin/users')]);setRequests(r);setAllUsers(u)}catch(e){setMsg(e.message)}finally{setLoading(false)}}useEffect(()=>{load()},[]);async function action(id,type){try{await api('/admin/requests/'+id+'/'+type,{method:'PATCH'});setMsg(type==='approve'?'Account approved.':'Account rejected.');load()}catch(e){setMsg(e.message)}}async function setStatus(id,status){try{await api('/admin/users/'+id+'/status',{method:'PATCH',body:JSON.stringify({status})});setMsg('User account updated.');load()}catch(e){setMsg(e.message)}}async function del(u){if(!confirm('Delete @'+u.username+' permanently?'))return;try{await api('/admin/users/'+u._id,{method:'DELETE'});setMsg('User deleted.');load()}catch(e){setMsg(e.message)}}const q=query.trim().toLowerCase(),users=allUsers.filter(u=>!q||String(u.username||'').toLowerCase().includes(q)||String(u.phone||'').toLowerCase().includes(q));return <div className="admin-page"><header className="admin-head"><div><ShieldCheck/><div><h1>{tr('Talkio Admin')}</h1><span>{label(me)} · {tr('Admin Account & User Approval')}</span></div></div><div className="admin-head-actions"><button onClick={back}><MessageCircle/> {tr('Chats')}</button><button onClick={logout}><LogOut/> {tr('Log out')}</button></div></header><div className="admin-body"><main className="admin-content admin-unified"><div className="admin-title"><div><h2>{tr('Admin Account & User Approval')}</h2><p>{tr('Manage verification requests and every user account from this single dashboard.')}</p></div><button className="refresh" onClick={load}><RefreshCw/> {tr('Refresh')}</button></div>{msg&&<div className="admin-message">{msg}</div>}<section className="admin-account-card"><ShieldCheck/><div><small>{tr('Signed-in administrator')}</small><b>@{me.username||'admin'}</b><span>{tr('Password + security PIN protected')}</span></div></section><section className="admin-section"><div className="admin-section-head"><div><h3>{tr('Pending Approvals')}</h3><p>{tr('New users cannot log in until you approve them.')}</p></div><em>{requests.length}</em></div>{loading?<div className="admin-empty">{tr('Loading…')}</div>:requests.length===0?<div className="admin-empty"><ShieldCheck/><h3>{tr('No pending requests')}</h3></div>:<div className="request-list">{requests.map(u=><div className="request-card" key={u._id}><Avatar user={u} size={54}/><div className="request-info"><b>@{u.username}</b><span>{u.phone}</span><small>{new Date(u.createdAt).toLocaleString()}</small></div><div className="request-actions"><button className="approve" onClick={()=>action(u._id,'approve')}><UserCheck/> {tr('Approve')}</button><button className="reject" onClick={()=>action(u._id,'reject')}><UserX/> {tr('Reject')}</button></div></div>)}</div>}</section><section className="admin-section"><div className="admin-section-head"><div><h3>{tr('All User Accounts')}</h3><p>{tr('Approved, pending and rejected accounts are managed here.')}</p></div><em>{allUsers.length}</em></div><div className="admin-user-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr("Search username or phone number")}/></div>{loading?<div className="admin-empty">{tr('Loading…')}</div>:users.length===0?<div className="admin-empty">{tr('No users found.')}</div>:<div className="user-table">{users.map(u=><div className="user-admin-row" key={u._id}><Avatar user={u}/><div><b>@{u.username}</b><span>{u.phone}</span></div><strong className={'status '+u.status}>{u.status}</strong><select value={u.status} onChange={e=>setStatus(u._id,e.target.value)}><option value="approved">{tr("Approved")}</option><option value="pending">{tr("Pending")}</option><option value="rejected">{tr("Rejected")}</option></select><button className="delete-user" onClick={()=>del(u)}><Trash2/> {tr('Delete')}</button></div>)}</div>}</section></main></div></div>}

    function SearchResults({results,contacts,outgoing,add}){const ids=new Set(contacts.map(x=>String(x._id))),outs=new Set(outgoing.map(x=>String(x.recipient?._id)));return <div className="list search-results">{results.length===0?<div className="filter-empty">{tr('No approved users found.')}</div>:results.map(u=><div className="row" key={u._id}><Avatar user={u}/><div className="row-main"><b>{label(u)}</b><span className="preview">{u.phone}</span></div>{ids.has(String(u._id))?<span className="added-tag">{tr('Added')}</span>:outs.has(String(u._id))?<span className="pending-tag">{tr('Pending')}</span>:<button className="mini-add" onClick={()=>add(u)}><UserPlus/> {tr('Add')}</button>}</div>)}</div>}
    function ContactRequests({data,action}){return <div className="list"><div className="list-section-title">{tr("Incoming requests")}</div>{data.incoming.length===0&&<div className="filter-empty">{tr('No incoming requests.')}</div>}{data.incoming.map(r=><div className="row" key={r._id}><Avatar user={r.requester}/><div className="row-main"><b>{label(r.requester)}</b><span className="preview">{r.requester.phone}</span></div><div className="contact-actions"><button className="accept-small" onClick={()=>action(r._id,'accept')}><Check/> {tr('Accept')}</button><button className="reject-small" onClick={()=>action(r._id,'reject')}><X/></button></div></div>)}<div className="list-section-title">{tr("Sent requests")}</div>{data.outgoing.map(r=><div className="row" key={r._id}><Avatar user={r.recipient}/><div className="row-main"><b>{label(r.recipient)}</b><span className="preview">{tr('Waiting for approval')}</span></div></div>)}</div>}
    function ChatList({chats,users,filter,locked,open,unlock}){const ids=new Set(chats.map(c=>String(c.user._id))),showChats=filter==='unread'?chats.filter(c=>c.unread>0&&!locked.has(String(c.user._id))):filter==='locked'?chats.filter(c=>locked.has(String(c.user._id))):chats.filter(c=>!locked.has(String(c.user._id)));return <div className="list">{showChats.map(c=><button className="row" key={c.user._id} onClick={()=>open(c.user)}><Avatar user={c.user}/><div className="row-main"><div><b>{label(c.user)}</b><time>{when(c.lastMessage.createdAt)}</time></div><div><span className="preview">🔒 {tr('End-to-end encrypted message')}</span>{c.unread>0&&<em>{c.unread}</em>}</div></div>{locked.has(String(c.user._id))&&<Lock className="row-lock"/>}</button>)}{filter==='all'&&users.filter(u=>!ids.has(String(u._id))).map(u=><button className="row" key={u._id} onClick={()=>open(u)}><Avatar user={u}/><div className="row-main"><b>{label(u)}</b><span className="preview">{u.phone}</span></div></button>)}{filter==='locked'&&users.filter(u=>!ids.has(String(u._id))).map(u=><div className="row" key={u._id}><Avatar user={u}/><button className="row-main plain-open" onClick={()=>open(u)}><b>{label(u)}</b><span className="preview">{tr('Locked chat')}</span></button><button className="icon-btn" onClick={()=>unlock(u)}><Unlock/></button></div>)}{filter==='unread'&&showChats.length===0&&<div className="filter-empty">{tr('No unread messages.')}</div>}{filter==='locked'&&users.length===0&&<div className="filter-empty">{tr('No locked chats.')}</div>}</div>}
    function Bubble({m,mine}){return <div className={'bubble-wrap '+(mine?'mine':'theirs')}><div className="bubble">{m.type==='image'&&m.attachment&&<img className="media" src={m.attachment} alt=""/>}{m.type==='video'&&m.attachment&&<video className="media" src={m.attachment} controls/>}{m.type==='audio'&&m.attachment&&<audio src={m.attachment} controls/>}{m.type==='file'&&m.attachment&&<a href={m.attachment} download={m.attachmentName}><FileText/> {m.attachmentName}</a>}{m.text&&<div className="msg-text">{m.text}</div>}<div className="meta"><LockKeyhole/><span>{when(m.createdAt)}</span>{mine&&(m.seen?<CheckCheck className="seen"/>:m.deliveredAt?<CheckCheck/>:<Check/>)}</div></div></div>}
    function StatusList({me,groups,open,add}){const mine=groups.find(g=>String(g.user._id)===String(me._id));return <div className="list"><button className="row" onClick={()=>mine?open(mine):add()}><div className="avatar add-avatar"><Avatar user={me} status={!!mine}/>{!mine&&<Plus/>}</div><div className="row-main"><b>{tr('My status')}</b><span className="preview">{mine?`${mine.statuses.length} ${mine.statuses.length===1?'status':'statuses'} shared`:tr('Add status for 24 hours')}</span></div></button>{groups.filter(g=>String(g.user._id)!==String(me._id)).map(g=><button className="row" key={g.user._id} onClick={()=>open(g)}><Avatar user={g.user} status/><div className="row-main"><div><b>{label(g.user)}</b>{g.unseen>0&&<em>{g.unseen}</em>}</div><span className="preview">{when(g.statuses.at(-1)?.createdAt)}</span></div></button>)}</div>}
    function Calls({users,call,conference}){return <div className="list"><button className="row special conference-call-row" onClick={conference}><div className="round-icon conference-multicolor-icon"><Users/></div><div className="row-main"><b>{tr('Conference call')}</b></div></button>{users.map(u=><div className="row" key={u._id}><Avatar user={u}/><div className="row-main"><b>{label(u)}</b><span className="preview">{u.online?tr('online'):tr('last seen ')+when(u.lastSeen)}</span></div><button className="icon-green" onClick={()=>call('audio',u)}><Phone/></button><button className="icon-green" onClick={()=>call('video',u)}><Video/></button></div>)}</div>}
    function StatusAdd({close,submit,choose,inputRef,file}){const[t,setT]=useState('');return <div className="modal"><div className="status-add"><button className="close" onClick={close}><X/></button><h2>{tr('Add status')}</h2><textarea value={t} onChange={e=>setT(e.target.value)} placeholder={tr("Type a status…")}/><button className="primary" onClick={()=>t.trim()&&submit({type:'text',text:t,background:'#0b846d'})}>{tr('Share text status')}</button><input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={file}/><button className="secondary" onClick={choose}><Camera/> {tr('Add photo or video')}</button><small>{tr('Videos are automatically converted for browser playback · Maximum 60 seconds.')}</small><small>{tr('Status disappears automatically after 24 hours.')}</small></div></div>}
    function StatusViewer({group,me,api,close,onDeleted}){
     const[i,setI]=useState(0);
     const s=group.statuses[i];
     const videoRef=useRef(null);
     const mine=String(group.user._id)===String(me?._id);

     useEffect(()=>{
      if(!s)return;
      // Images/text advance after 5 seconds. Videos advance only when playback ends.
      if(s.type==='video')return;
      const t=setTimeout(()=>i<group.statuses.length-1?setI(v=>v+1):close(),5000);
      return()=>clearTimeout(t);
     },[i,s?._id]);

     async function deleteStatus(e){
      e.stopPropagation();
      if(!mine||!s)return;
      if(!confirm('Delete this status?'))return;
      try{
       await api('/statuses/'+s._id,{method:'DELETE'});
       const remaining=group.statuses.filter(x=>String(x._id)!==String(s._id));
       group.statuses=remaining;
       await onDeleted?.();
       if(!remaining.length)return close();
       if(i>=remaining.length)setI(remaining.length-1);
       else setI(v=>v);
      }catch(err){alert(err.message)}
     }

     function videoEnded(){
      if(i<group.statuses.length-1)setI(v=>v+1);
      else close();
     }

     if(!s)return null;
     return <div className="status-viewer">
      <div className="story-bars">{group.statuses.map((_,x)=><i key={x} className={x<=i?'done':''}/>)}</div>
      <header>
       <Avatar user={group.user}/>
       <b>{label(group.user)}</b>
       <span>{when(s.createdAt)}</span>
       <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'4px'}}>
        {mine&&<button
         type="button"
         onClick={deleteStatus}
         title="Delete status"
         aria-label="Delete status"
         style={{width:'28px',height:'28px',minWidth:'28px',padding:0,display:'grid',placeItems:'center'}}
        ><Trash2 style={{width:'15px',height:'15px'}}/></button>}
        <button
         type="button"
         onClick={close}
         title="Close"
         aria-label="Close"
         style={{width:'28px',height:'28px',minWidth:'28px',padding:0,display:'grid',placeItems:'center'}}
        ><X style={{width:'15px',height:'15px'}}/></button>
       </div>
      </header>
      <div className="story-content" style={{background:s.background||'#111'}} onClick={()=>s.type!=='video'&&(i<group.statuses.length-1?setI(v=>v+1):close())}>
       {s.type==='text'&&<h1>{s.text}</h1>}
       {s.type==='image'&&<img src={s.media} alt=""/>}
       {s.type==='video'&&(
        /^(data:video\/mp4(?:;|,)|blob:|https?:)/i.test(String(s.media||''))?
        <video
         key={s._id}
         ref={videoRef}
         src={s.media}
         autoPlay
         playsInline
         controls
         preload="metadata"
         onEnded={videoEnded}
         onClick={e=>e.stopPropagation()}
         onError={e=>{
          e.currentTarget.style.display='none';
          const fallback=e.currentTarget.nextElementSibling;
          if(fallback)fallback.style.display='grid';
         }}
        />:
        null
       )}
       {s.type==='video'&&<div className="status-video-fallback" style={{
        display:/^(data:video\/mp4(?:;|,)|blob:|https?:)/i.test(String(s.media||''))?'none':'grid'
       }}>
        <Video/>
        <b>{tr('This old video format cannot be played.')}</b>
        <span>{mine?tr('Delete it and upload the video again.'):tr('Ask the sender to upload the video again.')}</span>
       </div>}
      </div>
     </div>
    }
    function CallOverlay({call,answer,end,remoteVideo,localVideo}){return <div className="call-overlay"><div className="call-name"><Avatar user={call.peer||{username:call.callerName}} size={80}/><h2>{label(call.peer)||call.callerName}</h2><p>{call.state==='ringing'?tr('Incoming ')+(call.type==='video'?'ویڈیو':'آڈیو')+tr(' call'):call.state==='calling'?tr('Calling…'):tr('Connected · WebRTC encrypted')}</p></div>{call.type==='video'&&<><video ref={remoteVideo} className="remote" autoPlay playsInline/><video ref={localVideo} className="local" autoPlay playsInline muted/></>}<div className="call-actions">{call.direction==='in'&&call.state==='ringing'&&<button className="accept" onClick={answer}><Phone/></button>}<button className="hang" onClick={end}><PhoneOff/></button></div></div>}
    function ConferencePicker({users,selected,toggle,close,start}){
     const [q,setQ]=useState('');
     const shown=users.filter(u=>{
      const s=(label(u)+' '+(u.phone||'')).toLowerCase();
      return s.includes(q.trim().toLowerCase());
     });
     return <div className="conference-picker-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}>
      <section className="conference-picker">
       <header>
        <button className="conference-picker-close" onClick={close}><X/></button>
        <div>
         <b>Conference Call</b>
         <span>Select up to 7 users · {selected.length}/7 selected</span>
        </div>
       </header>

       <div className="conference-picker-search">
        <Search/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users"/>
       </div>

       <div className="conference-picker-list">
        {shown.length===0
         ?<div className="conference-picker-empty">No users found.</div>
         :shown.map(u=>{
          const id=String(u._id),checked=selected.includes(id);
          return <button
           key={u._id}
           type="button"
           className={'conference-user '+(checked?'selected':'')}
           onClick={()=>toggle(id)}
          >
           <Avatar user={u} size={44}/>
           <div className="conference-user-info">
            <b>{label(u)}</b>
            <span>{u.online?tr('online'):(u.phone||tr('offline'))}</span>
           </div>
           <span className="conference-check">{checked?<Check/>:null}</span>
          </button>
         })}
       </div>

       <footer>
        <button className="conference-start audio" disabled={!selected.length} onClick={()=>start('audio')}><Phone/> Audio</button>
        <button className="conference-start video" disabled={!selected.length} onClick={()=>start('video')}><Video/> Video</button>
       </footer>
      </section>
     </div>
    }

    function ConferenceOverlay({conf,users,join,leave,stream}){useEffect(()=>{const v=document.getElementById('conf-self');if(v&&stream)v.srcObject=stream},[stream,conf.incoming]);const members=(conf.members||[]).map(id=>users.find(u=>String(u._id)===String(id))).filter(Boolean);return <div className="conference"><header><Users/><b>{tr('Conference call')}</b><span>{conf.type}</span></header>{conf.incoming?<div className="incoming-conf"><h2>{tr('Incoming conference call')}</h2><div><button className="accept" onClick={join}><Phone/></button><button className="hang" onClick={leave}><PhoneOff/></button></div></div>:<div className="conf-grid"><div className="conf-tile"><video id="conf-self" autoPlay playsInline muted/><span>{tr('You')}</span></div>{members.map(u=><div className="conf-tile" key={u._id}><video id={'conf-'+u._id} autoPlay playsInline/><span>{label(u)}</span></div>)}</div>}<button className="hang floating" onClick={leave}><PhoneOff/></button></div>}
