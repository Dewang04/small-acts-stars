"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const messageFromTheStars =
"Hey Amrita! Great goinggg... 1 mahina karta raho, saara paap dhul jayega 🙃. But I'm so proud of you.. always...Your kindness and curiosity today made the universe a little brighter."



export default function Home(){

const today = new Date();

const todayKey = new Date(
today.getFullYear(),
today.getMonth(),
today.getDate()
).toISOString().split("T")[0];

const [good,setGood]=useState(false)
const [learn,setLearn]=useState(false)
const [goodText,setGoodText]=useState("")
const [learnText,setLearnText]=useState("")
const [message,setMessage]=useState("")
const [submitted,setSubmitted]=useState(false)

const [calendarOpen,setCalendarOpen]=useState(false)
const [savedDates,setSavedDates]=useState<any[]>([])
const [entries,setEntries]=useState<any[]>([])
const [viewEntry,setViewEntry]=useState(null)

const [month,setMonth]=useState(new Date(today.getFullYear(),today.getMonth(),1))


// LOAD DATA
useEffect(()=>{

async function load(){

const { data } = await supabase
.from("ritual_entries")
.select("*")

if(data){

let map: any = {}
let dates: any[] = []

data.forEach(d=>{
map[d.date]=d
dates.push(d.date)
})

setEntries(map)
setSavedDates(dates)

if(map[todayKey]){

const entry = map[todayKey]

setGood(entry.kindness)
setLearn(entry.learning)
setGoodText(entry.kindness_text || "")
setLearnText(entry.learning_text || "")
setMessage(entry.message || "")
setSubmitted(true)

}

}

}

load()

},[])



// SUBMIT
async function submitData(){

await supabase
.from("ritual_entries")
.upsert({
date: todayKey,
kindness: good,
learning: learn,
kindness_text: goodText,
learning_text: learnText,
message: message
})

setSubmitted(true)

setSavedDates(prev => [...new Set([...prev,todayKey])])

setEntries(prev => ({
...prev,
[todayKey]: {
kindness: good,
learning: learn,
kindness_text: goodText,
learning_text: learnText,
message: message
}
}))

}



// REVEAL


async function reveal(){

setMessage(messageFromTheStars)

await supabase
.from("ritual_entries")
.upsert({
date: todayKey,
message: messageFromTheStars
})

setEntries(prev: any) => ({
...prev,
[todayKey]: {
...(prev[todayKey] || {}),
message: messageFromTheStars
}
}))

}

// RESET
async function resetData(){

await supabase
.from("ritual_entries")
.delete()
.eq("date", todayKey)

setGood(false)
setLearn(false)
setGoodText("")
setLearnText("")
setMessage("")
setSubmitted(false)

setSavedDates(prev => prev.filter(d => d !== todayKey))

}



// OPEN DAY
function openDay(date){

if(!date) return

const key = new Date(
date.getFullYear(),
date.getMonth(),
date.getDate()
).toISOString().split("T")[0]

const entry = entries[key]

if(!entry){

setViewEntry({
date:key,
empty:true
})

return
}

setViewEntry({
date:key,
kindness:entry.kindness_text,
learning:entry.learning_text,
message:entry.message
})

}



// CALENDAR
function generateCalendarDays(){

const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
const lastDay = new Date(month.getFullYear(), month.getMonth()+1,0)

const start = firstDay.getDay()
const total = lastDay.getDate()

let days=[]

for(let i=0;i<start;i++){
days.push(null)
}

for(let d=1; d<=total; d++){
days.push(new Date(month.getFullYear(),month.getMonth(),d))
}

return days

}

const days = generateCalendarDays()



function getIcon(date){

if(!date) return null

const key = date.toISOString().split("T")[0]

const entry = entries[key]

if(!entry) return null

if(entry.kindness && entry.learning) return "🌟"
if(entry.kindness) return "✨"
if(entry.learning) return "🌱"

return null

}



return(

<div style={{
minHeight:"100vh",
background:"#000",
color:"#fff",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontFamily:"system-ui"
}}>

<div style={{
width:420,
padding:40,
background:"#111",
borderRadius:16
}}>


{/* HEADER */}

<div style={{display:"flex",justifyContent:"space-between"}}>

<div>

<h2 style={{opacity:0.6,marginBottom:5}}>
💫Hey Amritaaaaa!
</h2>

<h1>
🌌 Small Acts Under the Stars
</h1>

</div>

<button
onClick={()=>setCalendarOpen(true)}
style={{
background:"none",
border:"none",
color:"white",
fontSize:20,
cursor:"pointer"
}}
>
🗓
</button>

</div>


<p style={{opacity:0.5,marginTop:10}}>
{today.toDateString()}
</p>



{/* GOOD ACT */}

<label style={{display:"block",marginTop:25}}>

<input
type="checkbox"
checked={good}
onChange={e=>setGood(e.target.checked)}
/>

{" "}A small good act

</label>


<textarea
placeholder="Good I Put Into the World"
value={goodText}
onChange={e=>setGoodText(e.target.value)}
style={{
width:"100%",
marginTop:10,
padding:10,
background:"#000",
border:"1px solid #333",
color:"#fff",
borderRadius:8
}}
/>



{/* LEARNING */}

<label style={{display:"block",marginTop:25}}>

<input
type="checkbox"
checked={learn}
onChange={e=>setLearn(e.target.checked)}
/>

{" "}I learnt something new today

</label>


<textarea
placeholder="What Lit My Mind Today"
value={learnText}
onChange={e=>setLearnText(e.target.value)}
style={{
width:"100%",
marginTop:10,
padding:10,
background:"#000",
border:"1px solid #333",
color:"#fff",
borderRadius:8
}}
/>



{/* SUBMIT */}

<button
onClick={submitData}
style={{
width:"100%",
padding:12,
borderRadius:8,
border:"none",
background:"#fff",
color:"#000",
marginTop:25,
fontWeight:600
}}
>
Submit Today's Entry
</button>



{submitted && !message && (

<button
onClick={reveal}
style={{
width:"100%",
padding:12,
borderRadius:8,
border:"1px solid white",
background:"transparent",
color:"white",
marginTop:10
}}
>
Reveal Tonight's Message
</button>

)}



{message && (

<div style={{
marginTop:20,
padding:15,
border:"1px solid #333",
borderRadius:10
}}>
{message}
</div>

)}



<button
onClick={resetData}
style={{
marginTop:20,
width:"100%",
padding:10,
borderRadius:8,
border:"1px solid #444",
background:"transparent",
color:"#aaa"
}}
>
Reset Today's Entry
</button>

</div>



{/* CALENDAR */}

{calendarOpen && (

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.8)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:1000
}}>

<div style={{
background:"#111",
padding:30,
borderRadius:16,
width:420
}}>

<div style={{display:"flex",justifyContent:"space-between"}}>

<button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}>
◀
</button>

<h2>Calendar</h2>

<button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}>
▶
</button>

</div>

<p style={{opacity:0.5}}>
{month.toLocaleString('default',{month:'long'})} {month.getFullYear()}
</p>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
gap:10,
marginTop:20
}}>

{["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d=>
<div key={d} style={{opacity:0.5,fontSize:12}}>
{d}
</div>
)}

{days.map((date,i)=>{

if(!date) return <div key={i}></div>

const key = date.toISOString().split("T")[0]

const done = savedDates.includes(key)
const todayMatch = key === todayKey
const icon = getIcon(date)

return(

<div
key={i}
onClick={()=>openDay(date)}
style={{
background:
done
? "#22c55e"
: todayMatch
? "#444"
: "#1e1e1e",
height:50,
borderRadius:10,
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
cursor:"pointer"
}}
>

<div>{date.getDate()}</div>

{icon && <div style={{fontSize:12}}>{icon}</div>}

</div>

)

})}

</div>

<button
onClick={()=>setCalendarOpen(false)}
style={{
marginTop:20,
width:"100%",
padding:10,
borderRadius:8,
border:"1px solid #444",
background:"transparent",
color:"white"
}}
>
Close
</button>

</div>

</div>

)}



{/* ENTRY VIEW MODAL */}

{viewEntry && (

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.8)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:1000
}}>

<div style={{
background:"#111",
padding:30,
borderRadius:16,
width:420
}}>

<h2>{new Date(viewEntry.date).toDateString()}</h2>

{viewEntry.empty ? (

<p style={{marginTop:20}}>No entry recorded 🌙</p>

) : (

<>

<p style={{marginTop:20}}><b>✨ Kindness</b></p>
<p>{viewEntry.kindness || "None"}</p>

<p style={{marginTop:20}}><b>🌱 Learning</b></p>
<p>{viewEntry.learning || "None"}</p>

<p style={{marginTop:20}}><b>🌌 Message</b></p>
<p>{viewEntry.message || "Not revealed"}</p>

</>

)}

<button
onClick={()=>setViewEntry(null)}
style={{
marginTop:20,
width:"100%",
padding:10,
borderRadius:8,
border:"1px solid #444",
background:"transparent",
color:"white"
}}
>
Close
</button>

</div>

</div>

)}

</div>

)

}