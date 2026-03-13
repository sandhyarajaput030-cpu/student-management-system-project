import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDetails = () => {

const [students,setStudents] = useState([]);
const [loading,setLoading] = useState(true);
const [search,setSearch] = useState("");

const btnStyle={padding:"6px 12px",border:"none",borderRadius:"6px",color:"#fff",cursor:"pointer",margin:"5px"};
const saveBtn={...btnStyle,background:"#22c55e"};
const addBtn={...btnStyle,background:"#3b82f6"};
const deleteBtn={...btnStyle,background:"#ef4444"};
const eventBtn={...btnStyle,background:"#8b5cf6"};
const resetBtn={...btnStyle,background:"#f59e0b"};
const saveAttendanceBtn={...btnStyle,background:"#10b981"};


// ================= FETCH STUDENTS =================
const fetchStudents = async () => {
  try{

    const token=localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:8000/api/users/all-students",
      {headers:{Authorization:`Bearer ${token}`}}
    );

    const data = await res.json();

    if(res.ok && data.success){

      const formatted = data.students.map(s=>{

        const days = s.attendance?.[0]?.days || {};

        const presentCount = Object.values(days)
          .filter(v=>v==="present").length;

        const percent = Math.round((presentCount/30)*100);

        return{
          ...s,
          attendance:[{
            days,
            attendancePercent:percent
          }],
          fee:s.fee || {total:0,paid:0},
          exams:s.exams || [],
          events:s.events || []
        }

      });

      setStudents(formatted);
    }

    setLoading(false);

  }catch(err){
    console.log(err);
    setLoading(false);
  }
};

useEffect(()=>{fetchStudents()},[]);


// ================= TOGGLE ATTENDANCE =================
const toggleAttendance = (studentId,day)=>{

  setStudents(prev=>prev.map(s=>{

    if(s._id===studentId){

      const currentDays = s.attendance[0].days || {};
      const current = currentDays[day] || "absent";

      const newValue = current==="present" ? "absent" : "present";

      const updatedDays = {...currentDays,[day]:newValue};

      const presentCount = Object.values(updatedDays)
        .filter(v=>v==="present").length;

      const percent = Math.round((presentCount/30)*100);

      return{
        ...s,
        attendance:[{
          days:updatedDays,
          attendancePercent:percent
        }]
      }

    }

    return s;

  }));

};


// ================= SAVE ATTENDANCE =================
const saveAttendance = async(student)=>{

  try{

    const token = localStorage.getItem("token");

    const attendanceDays = student.attendance[0].days;

    const res = await fetch(
      `http://localhost:8000/api/users/student/${student._id}/update-details`,
      {
        method:"PATCH",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          attendance:attendanceDays
        })
      }
    );

    const data = await res.json();

    if(data.success){
      alert("Attendance saved successfully");
      fetchStudents();   // refresh data
    }
    else{
      alert(data.message || "Failed to save attendance");
    }

  }catch(err){
    console.log(err);
    alert("Error saving attendance");
  }

};


// ================= FEE =================
const updateFee=(studentId,field,value)=>{

  setStudents(prev=>prev.map(s=>{

    if(s._id===studentId){

      const newFee={...s.fee,[field]:Number(value)};

      fetch(
        `http://localhost:8000/api/users/student/${studentId}/update-details`,
        {
          method:"PATCH",
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({fee:newFee})
        }
      );

      return{...s,fee:newFee};

    }

    return s;

  }));

};

const resetFee=(studentId)=>{
  updateFee(studentId,"total",0);
  updateFee(studentId,"paid",0);
};


// ================= EXAMS =================
const addExam=(studentId)=>{
  setStudents(prev=>prev.map(s=>{
    if(s._id===studentId){
      return {...s,exams:[...s.exams,{subject:"",date:"",time:""}]}
    }
    return s;
  }));
};

const saveExam=async(studentId,exams)=>{

  const token=localStorage.getItem("token");

  await fetch(
    `http://localhost:8000/api/users/student/${studentId}/update-details`,
    {
      method:"PATCH",
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({exams})
    }
  );

};

const deleteExam=(studentId,index)=>{

  setStudents(prev=>prev.map(s=>{

    if(s._id===studentId){

      const exams=s.exams.filter((_,i)=>i!==index);

      saveExam(studentId,exams);

      return{...s,exams};

    }

    return s;

  }));

};


// ================= EVENTS =================
const addEvent=(studentId)=>{
  setStudents(prev=>prev.map(s=>{
    if(s._id===studentId){
      return {...s,events:[...s.events,{title:"",description:""}]}
    }
    return s;
  }));
};

const saveEvents=async(studentId,events)=>{

  const token=localStorage.getItem("token");

  await fetch(
    `http://localhost:8000/api/users/student/${studentId}/update-details`,
    {
      method:"PATCH",
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({events})
    }
  );

};

const deleteEvent=(studentId,index)=>{

  setStudents(prev=>prev.map(s=>{

    if(s._id===studentId){

      const events=s.events.filter((_,i)=>i!==index);

      saveEvents(studentId,events);

      return{...s,events};

    }

    return s;

  }));

};


// ================= FEE CHART =================
const renderChart=(fee)=>{

  const total=fee.total||0;
  const paid=fee.paid||0;
  const pending=total-paid;

  const data={
    labels:["Paid","Pending"],
    datasets:[
      {
        label:"₹ Amount",
        data:[paid,pending],
        backgroundColor:["#10b981","#f59e0b"]
      }
    ]
  };

  return <Bar data={data}/>;

};


if(loading) return <p>Loading students...</p>;


return(

<div style={{padding:"30px",background:"#f3f4f6"}}>

<h2>Student Management</h2>

<input
placeholder="Search student..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{padding:"8px",marginBottom:"20px",border:"1px solid #ccc",borderRadius:"6px"}}
/>

{students
.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()))
.map(s=>(

<div key={s._id}
style={{
marginBottom:"40px",
padding:"20px",
background:"#fff",
boxShadow:"0 4px 10px rgba(0,0,0,0.1)",
borderRadius:"10px"
}}>

<h3>{s.name}</h3>


{/* Attendance */}

<h4>Attendance ({s.attendance[0].attendancePercent}%)</h4>

<div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>

{[...Array(30)].map((_,i)=>{

const day=i+1;
const val=s.attendance[0].days[day]||"absent";

return(

<div
key={i}
onClick={()=>toggleAttendance(s._id,day)}
style={{
width:"30px",
height:"30px",
lineHeight:"30px",
textAlign:"center",
cursor:"pointer",
background:val==="present"?"#10b981":"#ef4444",
color:"#fff",
fontWeight:"bold"
}}
>
{val==="present"?"P":"A"}
</div>

);

})}

</div>

<button
style={saveAttendanceBtn}
onClick={()=>saveAttendance(s)}
>
Save Attendance
</button>


{/* Fee */}

<h4 style={{marginTop:"20px"}}>Fee Status</h4>

<div style={{display:"flex",gap:"10px",alignItems:"center"}}>

<label>Total:</label>

<input
type="number"
value={s.fee.total}
onChange={(e)=>updateFee(s._id,"total",e.target.value)}
/>

<label>Paid:</label>

<input
type="number"
value={s.fee.paid}
onChange={(e)=>updateFee(s._id,"paid",e.target.value)}
/>

<button
style={resetBtn}
onClick={()=>resetFee(s._id)}
>
Reset Fee
</button>

</div>

<div style={{maxWidth:"400px"}}>
{renderChart(s.fee)}
</div>


{/* Exams */}

<h4 style={{marginTop:"20px"}}>Exams</h4>

<button
style={addBtn}
onClick={()=>addExam(s._id)}
>
Add Exam
</button>


{s.exams.map((e,i)=>(

<div key={i} style={{display:"flex",gap:"10px",marginTop:"5px"}}>

<input
placeholder="Subject"
value={e.subject}
onChange={(ev)=>{
const exams=[...s.exams];
exams[i].subject=ev.target.value;
setStudents(prev=>prev.map(st=>st._id===s._id?{...st,exams}:st));
}}
/>

<input
type="date"
value={e.date}
onChange={(ev)=>{
const exams=[...s.exams];
exams[i].date=ev.target.value;
setStudents(prev=>prev.map(st=>st._id===s._id?{...st,exams}:st));
}}
/>

<input
type="time"
value={e.time}
onChange={(ev)=>{
const exams=[...s.exams];
exams[i].time=ev.target.value;
setStudents(prev=>prev.map(st=>st._id===s._id?{...st,exams}:st));
}}
/>

<button
style={saveBtn}
onClick={()=>saveExam(s._id,s.exams)}
>
Save
</button>

<button
style={deleteBtn}
onClick={()=>deleteExam(s._id,i)}
>
Delete
</button>

</div>

))}


{/* Events */}

<h4 style={{marginTop:"20px"}}>Events</h4>

<button
style={eventBtn}
onClick={()=>addEvent(s._id)}
>
Add Event
</button>

{s.events.map((ev,i)=>(

<div key={i} style={{display:"flex",gap:"10px",marginTop:"5px"}}>

<input
placeholder="Title"
value={ev.title}
onChange={(e)=>{
const events=[...s.events];
events[i].title=e.target.value;
setStudents(prev=>prev.map(st=>st._id===s._id?{...st,events}:st));
}}
/>

<input
placeholder="Description"
value={ev.description}
onChange={(e)=>{
const events=[...s.events];
events[i].description=e.target.value;
setStudents(prev=>prev.map(st=>st._id===s._id?{...st,events}:st));
}}
/>

<button
style={saveBtn}
onClick={()=>saveEvents(s._id,s.events)}
>
Save
</button>

<button
style={deleteBtn}
onClick={()=>deleteEvent(s._id,i)}
>
Delete
</button>

</div>

))}

</div>

))}

</div>

);

};

export default StudentDetails;