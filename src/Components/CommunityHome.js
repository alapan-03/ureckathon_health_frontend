import { useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import { Link, useParams } from "react-router-dom";

export default function CommunityHome(props) {

    let { comId } = useParams();
    const cookies = new Cookies();


    const [data, setData] = useState([]);

    let tok = cookies.get("token");
    const stringWithoutQuotes = tok && tok.replace(/"/g, "");
    // console.log(stringWithoutQuotes)

    const [postData, setPostData] = useState({
        // Your POST data fields go here
        description: ""
      });

      const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    useEffect(()=>{
        const fetchQuestions = async (comId) => {

            try{
            let q = await fetch(`http://127.0.0.1:4000/api/v1/question/${comId}/getQuestion`, {
                headers:{
                    Authorization: `Bearer ${stringWithoutQuotes}`
                }
            })

            if(q.ok){
                let dt = await q.json();
                console.log(dt)
                setData(dt);
            }
            else{
                let dt = await q.json();
                console.log(dt.message)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    fetchQuestions(comId)
    }, [])


    const postQuestions = async () => {

        try{
            let q = await fetch(`http://127.0.0.1:4000/api/v1/question/${comId}/postQuestion`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${stringWithoutQuotes}`,
                },
                body: JSON.stringify(postData), 
            })
            
            if(q.ok){
                let dt = await q.json();
                console.log(dt)
                setData(dt);
                window.location.reload()
        }
        else{
            let dt = await q.json();
            console.log(dt.message)
        }
    }
    catch(err){
        console.log(err)
    }
}

    const currentUrl = window.location.pathname;

    return(
        <div className="q-cont-outer">

            <div className="q-cont">
            <h1>{data && data.q && data.q.length>0 && data?.q[0].communityId?.name}</h1>

            {
                data && Array.isArray(data?.q) ? data?.q?.map((el)=>(
                        
                    <Link className="link" to={`${currentUrl}/${el._id}`}>
                        <div className="q-inner-cont">
                            <div className="q-user-cont">
                            <p className="q-u-icon">{el?.userId?.name.substr(0,1).toUpperCase()}</p>
                            <p>{el?.userId?.name}</p>
                        </div>
                        <p className="q-des">{el.description}</p>
                    </div>
                </Link>
                )):<h2>No data</h2>
            }

            </div>

            <div className="postQ">
                <textarea name="description"
             value={postData.description}
             onChange={handleChange} placeholder="Post a question..."></textarea>

             <button onClick={postQuestions}>Post</button>
            </div>
        </div>
    )
}