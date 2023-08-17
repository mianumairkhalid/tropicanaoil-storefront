import { useRef, useState } from "react"
import { ArrowLeft, MarkerPin01 } from '@untitled-ui/icons-react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import {  useNavigate } from "react-router-dom";
import logo from '../img/hondaLogo.png'


const Phonverify = () => {
  const [filledInfo, setFilledInfo] = useState(false)
  const [userphone, Setuserphone] = useState('');
  const [show, setShow] = useState("false");
  const [disabled, setDisabled] = useState(false);
  const [myotp, setmyotp] = useState('');
  const [errornow, seterrornow] = useState('');
  const [phonePage, setPhonePage] = useState(true);
  const [getOTP, setGetOTP] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [otperror, setOtperror] = useState(false)

  const [filledPhone, setFilledPhone] = useState(false);
  const [filledOTP, setFilledOTP] = useState(true);
  const [filledAllOtp, setFilledAllOtp] = useState('')
  const navigate = useNavigate();

  const telRef = useRef(null)

  const num1Ref = useRef(null)

  const handleChange = event => {
    const value = event.target.value.replace(/\D/g, "");
    Setuserphone(value);
  };

  const handleotpchange = event => {
    const value = event.target.value.replace(/\D/g, "");
    setmyotp(value);
  };

  const clickverify = (value) => {
    if(userphone.length > 7){
      phonverifynow(userphone);
      setShow()
      setDisabled(true)
    } 
  }

  const goBack = () => {
    setGetOTP(false);
    setPhonePage(true);
    setFilledPhone(false);
  }

  const goNext = () => {
    setPhonePage(false)
    setGetOTP(true);
  }


  const verifyotp = () => {
    verifyotpnow(userphone,myotp,Cookies.get('username'))
  }


const phonverifynow = (phone) => {
    try {
        return fetch("https://dev.zaviago.com/api/method/honda_api.api_calls.verifyuser.getphone?userphone="+phone, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => response.json()).then((data) => {
          var res = data.message;

          if(res.status == 'success'){
            seterrornow('');
            seterrornow(res.message);
          }
          else{
              seterrornow(res.message);
              setShow('false')
              setDisabled(false)
          }

        })

    } catch (error) {
        return error;
    }
}
const verifyotpnow = (userphone,myotp,username) => {
  var myHeaders = new Headers();
  myHeaders.append("Cookie", "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=");
  myHeaders.append("Authorization", "Bearer "+Cookies.get('token'));


  var requestOptions = {
      method: 'POST',
      headers: myHeaders
  };
  fetch("https://dev.zaviago.com/api/method/honda_api.api_calls.verifyuser.verifyotp?userphone="+userphone+"&otp="+myotp+"&username="+username, requestOptions)
  .then((response) => response.json()).then((data) => {
    var res = data.message;

    if(res.status == 'success'){
      seterrornow('');
      seterrornow(res.message);
      Cookies.set('phoneverify', false); 
      navigate("/");
    }
    else{
        seterrornow(res.message);
        setShow('false')
        setDisabled(false)
    }

  })
  .catch(error => console.log('error', error));

}



  return (
      <>
            {phonePage && (
              <>
                <header className='p-[14px] border-b border-b-[#F2F2F2] flex gap-x-[7px]'>
                  <img src={logo} width='60' className=" mx-auto"/>
                </header>
                <main className='px-5 py-[46px]'>
                  <h1 className='text-[22px] font-bold'>กรอกเบอร์มือถือของคุณ</h1>
                  <p className='mt-4'>กรอกเบอร์มือถือของคุณและกดรับรหัสยืนยันทาง SMS (OTP) เพื่อยืนยันเบอร์มือถือของคุณ</p>

                  <div className="flex gap-x-3">
                    <input type="tel" id="phone" autoComplete="off" ref={telRef} onChange={handleChange} className={`relative border ${phoneError ? "border-[#EC5454]" : "border-[#E3E3E3]"} rounded-[8px] outline-none py-2 px-3 mt-[11px] w-full`} onInput={(e) => {
                      if (e.target.value !== ""){
                        setFilledPhone(true)
                      } else {
                        setFilledPhone(false)
                      }
                    }} onKeyDown={() => setPhoneError(false)}/>
                  </div>

                  {!phoneError ? "" : (<p className="text-[#EC5454] inter mt-2">This phone number is invalid</p>)}

                  <button onClick={() => {
                    if (telRef.current.value.length < 10){
                      setPhoneError(true);
                    } else {
                      clickverify();
                    }
                  }} className={`mt-[14px] w-1/2 text-white rounded-[9px] p-3 text-center w-full ${!filledPhone ? "bg-[#C5C5C5] border border-[#C5C5C5]" : "bg-[#111111] border border-[#111111]"}`} disabled={!filledPhone}>รับรหัสยืนยัน SMS (OTP)</button>

                  <p className="text-[#9E9E9E] mt-[14px] text-[13px]">หน้าเพจนี้อันรวมไปถึงเอกสารหรือข้อความต่างๆที่มีความเกี่ยวข้องกับหน้าเพจนี้ถูกเขียนขึ้นมาเพื่อแจ้งท่านให้ทราบถึง ข้อกำหนด</p>
                </main>
              </>
            )}

            {getOTP && (
              <>
                <header className='p-[14px] border-b border-b-[#F2F2F2] flex gap-x-[7px]'>
                  <button onClick={goBack}>
                    <ArrowLeft />
                  </button>
                  ยืนยันรหัส
                </header>
                <main className='px-5 py-[46px]'>
                  <h1 className='text-[22px] font-bold'>ยืนยันรหัส OTP</h1>
                  <p className='mt-4'>เราได้ส่ง SMS (OTP) ไปที่เบอร์<br/>090-1234-567</p>

                  <div className="flex gap-x-[9px] mt-9">
                    <input type="text" id="num1" ref={num1Ref} className={`border ${otperror ? "border-[#EC5454]" : "border-[#D8DADC]"} w-full p-3 text-center text-2xl rounded-[15px]`} autoComplete="off" onKeyDown={() => {
                      setOtperror(false);
                    }}/>
                  </div>

                  {!otperror ? (<p className="text-center mt-[43px]">I didn't receive a code <strong>Resend</strong></p>) : (<p className="text-center text-[#EC5454] inter mt-[43px]">Wrong code, please try again <strong>Resend</strong></p>)}

                  <button onClick={() => {
                    if (num1Ref.current.value){
                      setOtperror(false);
                      verifyotp();
                    } else {
                      setOtperror(true)
                    }
                  }} className={`block mt-10 w-1/2 text-white rounded-[9px] p-3 text-center w-full ${!filledOTP ? "bg-[#C5C5C5] border border-[#C5C5C5]" : "bg-[#111111] border border-[#111111]"}`} disabled={!filledOTP}>ยืนยันรหัส OTP</button>
                </main>
              </>
            )}
   
      <main className='px-5 py-[46px]'>
          <div className='flex flex-col relative'>
              <div className="showerror">{errornow}</div>
              <label htmlFor='phone'>เบอร์โทร</label>
              <input className='border border-[#E3E3E3] rounded-[8px] outline-none py-2 px-3 mt-[11px]' onChange={handleChange} value={userphone} id='phone' name='phone' type='tel' disabled={disabled}/>
              <button onClick={clickverify} className="absolute translate-y-[38px] right-[4px] bg-black text-white px-3 py-[6px] rounded-[6px]">Send</button>
              
              
              <input  onChange={handleotpchange} value={myotp} className={`${show ? "invisible" : "visible"} border border-[#E3E3E3] rounded-[8px] outline-none py-2 px-3 mt-[11px]`} placeholder="OTP"  id='otp' name='otp' type='tel'/>
              <button onClick={verifyotp} className={`${show ? "invisible" : "visible"} text-white rounded-[9px] p-3 w-full bg-[#00A950] font-bold flex items-center justify-center mt-8`}>แจ้งโอนเงิน</button>
          </div>
      </main>
      <footer className='flex px-5 pb-5 gap-x-3'>
      </footer>
    </>
  )
}

export default Phonverify;