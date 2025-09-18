import { useState } from "react"
import axios from "axios";
import * as XLSX from "xlsx"


function App() {
const [msg, setMsg] = useState("")
const [status, setStatus ] = useState(false)
const [emailList, setEmailList] = useState([])

  function handlemsg(e)
  {
    setMsg(e.target.value)
  }
  function handlefile(event)
  {
    const file = event.target.files[0]

    const reader = new FileReader()


    reader.onload = function(event){
        const  data = event.target.result
        const workbook =XLSX.read(data,{type:"binary"})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        setEmailList(totalemail)
        

        
    }
    reader.readAsBinaryString(file)

  }

  function send()
  {
    setStatus(true)
    axios.post("https://bulkmail-back-api.onrender.com/sendmail",{msg, emailList})
    .then(function(data)
  {
    if(data.data === true)
    {
      alert("Email Send Successfully")
      setStatus(false)
    }
    else{
      alert("Email failed")
    }
  })
  }


  return (
    <div className="h-screen relative bg-[url('./assets/email.png')]  overflow-hidden bg-cover bg-center">
    <div className=" bg-blue-950 text-center relative z-20">
      <h1 className="text-teal-400 px-5 py-2 text-4xl font-bold">📧BulkMail</h1>
    </div>
    <div className=" bg-teal-600 text-center text-white relative z-20">
      <h1 className=" px-5 py-2 text-lg font-bold">We Can help your business with sending multiple emails at once</h1>
    </div>

<div className=" bg-teal-200
  text-black text-center relative z-20">
      <h1 className=" px-5 py-2 text-xl font-bold">Drag and Drop</h1>
    </div>

    <div className="relative z-20 flex flex-col items-center flex-1 w-screen px-5 my-8  bg-gray/50 backdrop-blur-md rounded-xl shadow-2xl p-8">
      <textarea onChange={handlemsg} className="w-[40%] h-36 outline-none border-black border px-3 rounded-md" placeholder="Enter the mail text..."></textarea>
    
    <div>
      <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5  m-3 p-3 mb-5"/>
      
    </div>
        <p className="p-2 bg-green-100"> Total Emails in the file:{emailList.length}</p>
    
    <button onClick={send} className="bg-blue-950  m-5 py-2 px-4 text-white font-medium border rounded-md hover:bg-blue-600">{status?"Sending...":"Send"}</button>
    </div>
    </div>
  )
}

export default App
