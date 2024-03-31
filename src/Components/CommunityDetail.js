import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";

export default function CommunityDetail(props) {
  const cookies = new Cookies();
  let { qId } = useParams();
  const [data, setData] = useState();
  const [data2, setData2] = useState();
  const [data3, setData3] = useState();
  const [data4, setData4] = useState();

  const [searchQuery, setSearchQuery] = useState('');

  const [postData, setPostData] = useState({
    // Your POST data fields go here
    answer: ""
  });

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
};



  const [docId, setDocId] = useState(null);



  let tok = cookies.get("token");
  const stringWithoutQuotes = tok && tok.replace(/"/g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = await fetch(
          `http://127.0.0.1:4000/api/v1/question/${qId}/getQuestionById`,
          {
            headers: {
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
          }
        );

        if (q.ok) {
          let dt = await q.json();
          // console.log(dt)
          setData(dt);
        } else {
          let dt = await q.json();
          console.log(dt.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const q = await fetch(
          `http://127.0.0.1:4000/api/v1/answer/${qId}/getAnswer`,
          {
            headers: {
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
          }
        );

        if (q.ok) {
          let dt = await q.json();
          console.log(dt);
          setData2(dt);
        } else {
          let dt = await q.json();
          console.log(dt.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData2();
  }, []);


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
                console.log(dt);
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




  const postAns = async () => {
    try {
        const q = await fetch(
          `http://127.0.0.1:4000/api/v1/answer/${qId}/${docId}/postAnswer`,
          {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
            body: JSON.stringify(postData), 
          }
        );

        if (q.ok) {
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

  // Filter the list of doctors based on the search query
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
  
  let docCont = document.getElementsByClassName("doctor-cont")[0]

  function attachDoc(docId){
    setDocId(docId);
    docCont.style.visibility = "hidden"
  }

  docId && console.log(docId)

  function showDocList(){

    docCont.style.visibility = "visible"
  }

  return (
    <>
      <section className="details">
        


<div className="doctor-cont">
<input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search doctors..."
      />
    {filteredDoctors && filteredDoctors?.map((el)=>(
        <div className="doc-inner">
            <div className="doc-inner2">
                <p>{el.name}</p>
                <p>{el.clinic}</p>
                <p>{el.experience}</p>
                <p>{el.specialty}</p>
            </div>
            <button onClick={()=>attachDoc(el._id)}>Attach</button>
        </div>
    ))}
</div>



        <div className="detail-cont">
          {data &&
            data?.q.map((el) => (
              <div className="detail-inner-cont">
                <div className="detail-user-cont">
                  <p className="detail-u-icon">
                    {el.userId.name.substr(0, 1).toUpperCase()}
                  </p>
                  <p>{el.userId.name}</p>
                </div>
                <p className="detail-des">{el.description}</p>
              </div>
            ))}
        </div>


        <div className="ans-cont-outer">
          <div className="ans-cont">
            {data2 &&
              data2?.a.map((el) => (
                <div className="ans-inner">
                  <div className="a-u-cont">
                    <p className="a-u-logo">{el.userId.name.substr(0, 1).toUpperCase()}</p>
                    <p>{el.userId.name}</p>
                  </div>
                  <p>{el.answer}</p>

                {
                  el.doctorId && 
                  <div className="showDoc">
                        <p>Name: {el.doctorId.name}</p>
                        <p>Clinic: {el.doctorId.clinic}</p>
                        <p>Age: {el.doctorId.age}</p>
                        <p>Experience: {el.doctorId.experience}</p>
                        <p>Specialty: {el.doctorId.specialty}</p>
                  </div>
                }
                </div>
              ))}
          </div>


          <div className="post-ans">
            <textarea
             name="answer"
             value={postData.answer}
             onChange={handleChange}
            ></textarea>
            <button onClick={showDocList}>{!docId ? "Recommend a doctor" : "Recommended"}</button>
            <button onClick={postAns}>Post</button>
          </div>
          </div>

      </section>
    </>
  );
}
