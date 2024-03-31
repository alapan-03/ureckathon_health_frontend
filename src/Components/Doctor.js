import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Doctor(props) {

    let docInp = document.getElementsByClassName("doc-input")[0];
let docCont = document.getElementsByClassName("doctor-cont")[0]



const cookies = new Cookies();
let { qId } = useParams();

const [currUser, setCurrUser] = useState();
const [data, setData] = useState();
const [data2, setData2] = useState();
const [data3, setData3] = useState();
const [data4, setData4] = useState();

const [searchQuery, setSearchQuery] = useState('');

const [postData, setPostData] = useState({
  // Your POST data fields go here
  answer: ""
});


const [postDocData, setPostDocData] = useState({
  // Your POST data fields go here
  name: "",
  clinic: "",
  age: null,
  experience: null,
  specialty: "" 
});

const handleDocChange = (e) => {
  setPostDocData({ ...postDocData, [e.target.name]: e.target.value });
};



const [docId, setDocId] = useState(null);



let tok = cookies.get("token");
const stringWithoutQuotes = tok && tok.replace(/"/g, "");


useEffect(()=>{
    const fetchUser = async () => {
        try {
          const q = await fetch(
            `http://127.0.0.1:4000/api/v1/auth/getCurrUser`,
            {
              headers: {
                Authorization: `Bearer ${stringWithoutQuotes}`,
              },
            }
          );
  
          if (q.ok) {
            let dt = await q.json();
            console.log(dt)
            setCurrUser(dt);
          } else {
            let dt = await q.json();
            console.log(dt.message);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchUser();
  }, [])




useEffect(()=>{
const getDoctors = async () => {
    try {
        const q = await fetch(
            `http://127.0.0.1:4000/api/v1/doctor/getDoc`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${stringWithoutQuotes}`,
                },
            }
            );
            
            if (q.ok) {
                let dt = await q.json();
                // console.log(dt);
                setData3(dt);
            } else {
                let dt = await q.json();
                console.log(dt.message);
            }
        } catch (err) {
            console.log(err);
        }
    }
    getDoctors();
}, [])


if(docCont)
docCont.style.visibility = "visible";
  
  const postDoc = async () => {
    try {
        const q = await fetch(
          `http://127.0.0.1:4000/api/v1/doctor/postDoc`,
          {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            //   Authorization: `Bearer ${stringWithoutQuotes}`,
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDkwZDlmZDUzNDcxNjE5ZTg4MWY3NiIsImlhdCI6MTcxMTg2OTQ0OX0.jYdFt__G14FV29fXjdGRLUyylQ4OX_lQWPn_1xKhmVo`,
            },
            body: JSON.stringify(postDocData), 
          }
        );

        if (q.ok) {

            docCont.style.visibility = "hidden";
            docInp.style.visibility = "hidden";
            // window.location.reload()
          let dt = await q.json();
          console.log(dt);
          setData4(dt);
        } else {
          let dt = await q.json();
          console.log(dt.message);
        }
      } catch (err) {
        console.log(err);
      }
  }


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

    const filterDoctors = (doctor) => {
        const { name, clinic, experience, specialty, _id } = doctor;
        const lowerCaseQuery = searchQuery.toLowerCase();
        const experienceString = String(experience);
        return (
          name.toLowerCase().includes(lowerCaseQuery) ||
          clinic.toLowerCase().includes(lowerCaseQuery) ||
          experienceString.includes(lowerCaseQuery) ||
          specialty.toLowerCase().includes(lowerCaseQuery)
        );
      };
    
      const filteredDoctors = data3 && data3.doc.filter(filterDoctors);
      
      function attachDoc(docId){
        setDocId(docId);
        docCont.style.visibility = "hidden"
      }
    
      docId && console.log(docId)
    
      function showDocList(){
    
        docCont.style.visibility = "visible"
      }
    
    
    //   currUser && console.log(currUser.user.role)
    
      function showDocInp(){
    
        if(docInp){
            docInp.style.visibility = "visible"
        }
      }
    

    return(
        <>
        <div className="doc-input">
    <input type="text" name="name"
             value={postDocData.answer}
             onChange={handleDocChange} placeholder="Name"></input>

    <input type="number" name="age"
             value={postDocData.age}
             onChange={handleDocChange} placeholder="Age"></input>

    <input type="number" name="experience"
             value={postDocData.experience}
             onChange={handleDocChange} placeholder="Experience"></input>

    <input type="text" name="clinic"
             value={postDocData.clinic}
             onChange={handleDocChange} placeholder="Clinic"></input>

    <input type="text" name="specialty"
             value={postDocData.specialty}
             onChange={handleDocChange} placeholder="Specialty"></input>

             <button onClick={postDoc}>Post</button>
</div>
{/* </div>  */}

<div className="doctor-cont">
    <div>
<input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search doctors..."
      />
{currUser && currUser.user.role==="admin" && 
      <button onClick={showDocInp}>Add doctor</button>
}
</div>
    {filteredDoctors && filteredDoctors?.map((el)=>(
        <div className="doc-inner">
            <div className="doc-inner2">
                <p>Name: {el?.name}</p>
                <p>Clinic: {el?.clinic}</p>
                <p>Experience: {el?.experience}</p>
                <p>Specialty: {el?.specialty}</p>
            </div>
            {/* <button onClick={()=>attachDoc(el._id)}>Attach</button> */}
        </div>
    ))}
</div>


        </>
    )
}