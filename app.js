const $=id=>document.getElementById(id),audio=$('audio');let blob=null;
const say=s=>$('status').textContent=s;
const fail=s=>$('error').textContent=s;
function hasAudio(){if(!blob){fail('Primero elegí un archivo de audio de tu celular.');return false;}return true;}
function time(n){if(!Number.isFinite(n))return 'desconocida';n=Math.floor(Math.max(0,n));return `${Math.floor(n/3600)?Math.floor(n/3600)+' horas ':''}${Math.floor(n%3600/60)} minutos ${n%60} segundos`;}
function position(){return 'Posición: '+time(audio.currentTime)+'. Duración: '+time(audio.duration)+'.';}
function update(){$('position').textContent=blob?position():'Sin archivo.';}
function on(id,fn){$(id).addEventListener('click',async()=>{fail('');try{await fn();}catch{fail('No se pudo reproducir. Probá un archivo MP3 y tocá Reproducir de nuevo.');}});}
$('file').addEventListener('change',()=>{fail('');const f=$('file').files[0];if(!f)return;audio.pause();audio.removeAttribute('src');audio.load();if(blob)URL.revokeObjectURL(blob);blob=URL.createObjectURL(f);audio.src=blob;audio.load();$('chosen').textContent='Archivo elegido: '+f.name+'.';say('Elegiste '+f.name+'. Tocá Reproducir.');});
audio.addEventListener('loadedmetadata',update);audio.addEventListener('timeupdate',update);
audio.addEventListener('error',()=>{if(blob)fail('Este archivo no se pudo reproducir. Probá un MP3 compatible con tu navegador.');});
audio.addEventListener('ended',()=>say('Terminó el audio. Podés volver a reproducirlo o elegir otro.'));
on('play',async()=>{if(!hasAudio())return;await audio.play();say('Reproduciendo tu audio.');});
on('pause',()=>{if(!hasAudio())return;audio.pause();say('Audio pausado. '+position());});
for(const [id,seconds]of [['back',-30],['forward',30]])on(id,()=>{if(!hasAudio())return;if(!Number.isFinite(audio.duration)){fail('Esperá a que cargue la duración del audio.');return;}audio.currentTime=Math.min(audio.duration,Math.max(0,audio.currentTime+seconds));update();say(position());});
on('where',()=>{if(hasAudio())say(position());});
for(const [id,delta]of [['down',-.1],['up',.1]])on(id,()=>{audio.volume=Math.min(1,Math.max(0,Math.round((audio.volume+delta)*10)/10));$('level').textContent='Volumen del reproductor: '+Math.round(audio.volume*100)+' por ciento. Si no cambia el sonido, usá los botones físicos del teléfono.';});
window.addEventListener('pagehide',()=>{audio.pause();if(blob){URL.revokeObjectURL(blob);blob=null;}});
