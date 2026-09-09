const defaults = [
["Samyuktha","samyuktha.2005s@gmail.com","AI Java","26/09/2005","B.Sc - CS"],
["Muthu Palaya Selvi","muthuselvi908@gmail.com","AI Java","28/04/1998","B.Sc - CS"],
["Ganesh Pandi","Kganeshpandi85@gmail.com","AI Java","Not available","Not available"],
["Mohamed Apsar","mohamed18apsar@gmail.com","Data Analyst","18/12/2004","B.com.CA"],
["Chermaraja","chermaraja602@gmail.com","AI Python","Not available","Not available"],
["P. Ilakkiya","Ilakkiyap10@gmail.com","AI Full Stack","14-01-2001","B.sc IT"],
["P. Loganayaki","loganayakiP2417@gmail.com","AI Full Stack","Not available","Not available"],
["N. Karpagam","karpagam142006@gmail.com","AI Python","01-04-2006","BCA"],
["Janaki","januharshith278@gmail.com","AI Python","20-02-2001","B. com"],
["Saranya","saranyaa08805@gmail.com","AI Full Stack","06-05-1992","B.SC IT"],
["Gayathri","agayathri773@gmail.com","AI Python","09-06-1997","M.com"],
["Vignesh Olivu","vignesholivu@gmail.com","AI Python","03/07/2003","B. com"],
["Sakkaravarthi","Not available","AI Java","Not available","Not available"],
["Swathika","swathika.prabakaran23@gmail.com","AI Python","23-12-2002","B.Sc(CS)"],
["Rohinth S","rohinths10@gmail.com","AI Python","15-01-2004","B.Tech IT"],
["Indhumathi","indhu266003@gmail.com","AI Java","26-06-2003","M.Com Computer Application"],
["Pushparaj L","iampushparajl@gmail.com","AI Java","24/11/2005","B.E(CSE)"],
["G. Dharun Kumar","dharunmedha@gmail.com","AI Full Stack","27-02-2008","B.Tech AI&DS"],
["Deepak Kumar S","deepakkumars170404@gmail.com","AI Python","17-04-2004","MBA"],
["Sathya Priya","sathyapriyaraj0901@gmail.com","AI Python","09-01-2006","BCA"],
["Uvas Shri","Not available","Software Testing","Not available","Not available"],
["Vikram","Not available","AI Python","Not available","Not available"],
["Gowtham","Not available","AI Python","Not available","Not available"],
["Deepak Ganesh","Not available","AI Full Stack","Not available","Not available"],
["M. Maha Lakshmi","Not available","Not available","Not available","Not available"],
["Vasantha Kumar","Not available","AI Python","Not available","Not available"],
["Kamaly C","Not available","AI Python","Not available","Not available"],
["Kartheswari","Not available","Data Analyst","Not available","Not available"],
["Peria Samy M","Not available","Data Science","Not available","Not available"],
["G. Kaleswari","Not available","Data Analyst","Not available","Not available"],
["S. Prabaganesh","Not available","Data Analyst","Not available","Not available"],
["S. Santhosh Kumar","Not available","AI Java","Not available","Not available"]
].map((r,i)=>({id:i+1,name:r[0],gmail:r[1],course:r[2],dob:r[3],qualification:r[4]}));

/* one topic icon, gradient panel and badge colour per course — chosen to be
   instantly readable without needing external photos: a Java file icon for
   AI Java, a Python file icon for AI Python, a layered-stack icon for Full
   Stack, bar/line-chart icons for the two data courses, a bug icon for
   Software Testing, and a graduation cap as the neutral fallback. */
const topic = {
  "AI Java":        { icon:"bi-filetype-java",   badge:"badge-java",     panel:"panel-java" },
  "AI Python":      { icon:"bi-filetype-py",      badge:"badge-python",   panel:"panel-python" },
  "AI Full Stack":  { icon:"bi-layers-half",       badge:"badge-fullstack",panel:"panel-fullstack" },
  "Data Analyst":   { icon:"bi-bar-chart-line",   badge:"badge-analyst",  panel:"panel-analyst" },
  "Data Science":   { icon:"bi-graph-up-arrow",   badge:"badge-science",  panel:"panel-science" },
  "Software Testing": { icon:"bi-bug",            badge:"badge-testing",  panel:"panel-testing" },
  "Not available":  { icon:"bi-mortarboard",      badge:"badge-na",       panel:"panel-na" }
};
function topicOf(course){ return topic[course] || topic["Not available"]; }

const KEY="campusConnectStudents_v2";
let students=load();
function load(){ try{ const r=JSON.parse(localStorage.getItem(KEY)); if(Array.isArray(r)&&r.length) return r; }catch(e){} return structuredClone(defaults); }
function save(){ localStorage.setItem(KEY, JSON.stringify(students)); }
function initials(n){ return n.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(); }
function esc(v){ return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

const grid=document.getElementById("profileGrid"), empty=document.getElementById("empty");
const search=document.getElementById("searchInput"), courseSel=document.getElementById("courseFilter");
const viewModal=new bootstrap.Modal("#viewModal"), addModal=new bootstrap.Modal("#addModal");

function stats(){
  document.getElementById("studentCount").textContent=students.length;
  document.getElementById("courseCount").textContent=new Set(students.map(s=>s.course).filter(c=>c&&c!=="Not available")).size;
}
function render(list){
  grid.innerHTML=list.map(s=>{ const t=topicOf(s.course); return `
    <div class="col-md-6 col-lg-4">
      <div class="card profile-card h-100">
        <div class="card-img-wrap ${t.panel}"><i class="bi ${t.icon}"></i></div>
        <div class="avatar">${esc(initials(s.name))}</div>
        <div class="card-body pt-2">
          <h6 class="fw-bold mb-0">${esc(s.name)}</h6>
          <span class="badge course-badge ${t.badge} mb-2">${esc(s.course)}</span>
          <div class="small text-muted"><i class="bi bi-envelope-at me-1"></i>${esc(s.gmail)}</div>
          <div class="small text-muted"><i class="bi bi-calendar2-check me-1"></i>${esc(s.dob)}</div>
          <div class="small text-muted mb-3"><i class="bi bi-mortarboard me-1"></i>${esc(s.qualification)}</div>
          <div class="d-flex gap-2">
            <button class="btn view-btn btn-sm flex-grow-1" onclick="viewProfile(${s.id})">View Profile</button>
            <button class="btn btn-outline-secondary btn-sm" onclick="editProfile(${s.id})" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-outline-danger btn-sm" onclick="removeProfile(${s.id})" title="Remove"><i class="bi bi-trash3"></i></button>
          </div>
        </div>
      </div>
    </div>`; }).join("");
  empty.classList.toggle("d-none", list.length>0);
  stats();
}
function applyFilter(){
  const q=search.value.toLowerCase().trim(), c=courseSel.value;
  render(students.filter(s=>{
    const hay=`${s.name} ${s.gmail} ${s.course} ${s.dob} ${s.qualification}`.toLowerCase();
    return hay.includes(q) && (c==="all"||s.course.toLowerCase().includes(c.toLowerCase()));
  }));
}
search.addEventListener("input", applyFilter);
courseSel.addEventListener("change", applyFilter);

function viewProfile(id){
  const s=students.find(x=>x.id===id); if(!s) return;
  document.getElementById("viewName").textContent=s.name;
  document.getElementById("viewBody").innerHTML=`
    <p><strong>Gmail:</strong> ${esc(s.gmail)}</p>
    <p><strong>Course:</strong> ${esc(s.course)}</p>
    <p><strong>Date of Birth:</strong> ${esc(s.dob)}</p>
    <p><strong>Qualification:</strong> ${esc(s.qualification)}</p>`;
  viewModal.show();
}
function removeProfile(id){
  const s=students.find(x=>x.id===id); if(!s) return;
  if(!confirm(`Remove ${s.name} from the student list?`)) return;
  students=students.filter(x=>x.id!==id); save(); applyFilter();
}
document.getElementById("restoreBtn").addEventListener("click", ()=>{
  if(!confirm("Restore any removed students? Your edits to existing profiles will be kept.")) return;
  const presentIds = new Set(students.map(s=>s.id));
  defaults.forEach(d=>{ if(!presentIds.has(d.id)) students.push(structuredClone(d)); });
  save();
  search.value=""; courseSel.value="all"; render(students);
});

/* the Add-student modal doubles as the Edit modal: editingId is null while
   adding, and set to a student's id while correcting an existing entry. */
let editingId=null;
const formTitle=document.getElementById("formModalTitle"), formSubmitBtn=document.getElementById("formSubmitBtn");

document.getElementById("openAdd").addEventListener("click", ()=>{
  editingId=null;
  document.getElementById("addForm").reset();
  formTitle.textContent="Add Student"; formSubmitBtn.textContent="Add";
});
function editProfile(id){
  const s=students.find(x=>x.id===id); if(!s) return;
  editingId=id;
  document.getElementById("fName").value = s.name==="Not available" ? "" : s.name;
  document.getElementById("fGmail").value = s.gmail==="Not available" ? "" : s.gmail;
  document.getElementById("fCourse").value = s.course==="Not available" ? "" : s.course;
  document.getElementById("fDob").value = s.dob==="Not available" ? "" : s.dob;
  document.getElementById("fQual").value = s.qualification==="Not available" ? "" : s.qualification;
  formTitle.textContent="Edit Student"; formSubmitBtn.textContent="Save Changes";
  addModal.show();
}
document.getElementById("addForm").addEventListener("submit", e=>{
  e.preventDefault();
  const val=id=>document.getElementById(id).value.trim()||"Not available";
  const data={name:val("fName"),gmail:val("fGmail"),course:val("fCourse"),dob:val("fDob"),qualification:val("fQual")};
  if(editingId){
    const s=students.find(x=>x.id===editingId);
    if(s) Object.assign(s, data);
  } else {
    students.push({id:Date.now(), ...data});
  }
  save(); e.target.reset(); editingId=null; addModal.hide(); applyFilter();
});

render(students);
