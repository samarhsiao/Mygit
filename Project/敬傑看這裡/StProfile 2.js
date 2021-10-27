import React, { useState, useRef, useEffect } from 'react'
import './style/st_editprofile.css'
import { Link } from 'react-router-dom'
import { devUrl } from '../../config'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

//共用元件
import MultiLevelBreadCrumb from '../../components/MultiLevelBreadCrumb'
import StSideBar from '../../components/st/StSideBar'
import StBgDecorationNormal from '../../components/st/StBgDecorationNormal'
import ConfirmMsg from '../../components/ConfirmMsg'
import Footer from '../../components/Footer'

//處理會員資料CRUD
// import UserDataService from '../../services/UserDataService'

export default withRouter(function StProfile(props) {
  //將所有欄位的值以物件形式存在一個狀態
  const [fields, setFields] = useState({
    avatar: '',
    firstname: '',
    lastname: '',
    birth: '',
    nickname: '',
  })

  const [fieldsErrors, setFieldsErrors] = useState({
    firstname: '',
    lastname: '',
    birth: '',
  })

  //將使用者在欄位輸入的值進行更新
  const handleFieldChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    let newValue = value
    const updatedFields = {
      ...fields,
      [name]: newValue,
    }
    setFields(updatedFields)
  }

  //表單的ref
  const formRef = useRef(null)
  //自訂欄位錯誤訊息
  const handleFormInvalid = (e) => {
    e.preventDefault()

    // 表單實體的物件參照
    const form = formRef.current

    let errorMsg = {}

    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i]

      if (
        element.tagName !== 'button' &&
        element.willValidate &&
        !element.validity.valid
      ) {
        // 必填用預設訊息，但錯誤格式驗証用title中的字串
        if (element.validity.valueMissing) {
          errorMsg = {
            ...errorMsg,
            [element.name]: element.validationMessage,
          }
        } else {
          errorMsg = {
            ...errorMsg,
            [element.name]: element.title,
          }
        }
      }
    }

    const updatedFieldErrors = {
      ...fieldsErrors,
      ...errorMsg,
    }

    setFieldsErrors(updatedFieldErrors)
  }

  //使用者輸入表單時錯誤訊息會自動更新
  const handleFormChange = (e) => {
    // 設定錯誤訊息狀態
    const updatedFieldErrors = {
      ...fieldsErrors,
      [e.target.name]: '',
    }

    // 3. 設定回原錯誤訊息狀態物件
    setFieldsErrors(updatedFieldErrors)
  }

  //預覽大頭貼的地方
  const imgRef = useRef(null)

  //實際擁有預覽功能的input因為太醜藏起來
  const inputRef = useRef(null)

  //預覽大頭貼功能
  const previewFile = () => {
    var preview = imgRef.current
    var file = inputRef.current.files[0]
    var reader = new FileReader()

    reader.addEventListener(
      'load',
      function () {
        preview.src = reader.result
      },
      false
    )

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //阻止表單預設送出行為

    const fd = new FormData(e.target)
    //看表單傳送的資料
    console.log('FormData中的填入資料')
    for (let i of fd.entries()) {
      console.log(i)
    }

    if (
      fields.lastname !== '' &&
      fields.firstname !== '' &&
      fields.birth !== ''
    ) {
      axios
        .post('http://localhost:3001/stprofile/:sid', {
          avatar: fields.avatar,
          firstname: fields.firstname,
          lastname: fields.lastname,
          birth: fields.birth,
          nickname: fields.nickname,
        })
        .then((res) => {
          console.log('修改資料完成')
        })
    }
  }

  return (
    <>
      <div className="container mainContent">
        <div className="row">
          <MultiLevelBreadCrumb />
          <div className="col-10 ml-auto pageName">
            <span className="pageNameText profile">
              Profile
            </span>
          </div>
        </div>
        <div className="row">
          <StSideBar />
          <form
            ref={formRef}
            className="form col-12 offset-0 col-md-8 offset-md-1"
            onSubmit={handleSubmit}
            onChange={handleFormChange}
            onInvalid={handleFormInvalid}
          >
            <ConfirmMsg />
            <div className="form-head ml-1">
              <Link href="">
                <i className="fas fa-chevron-left TCback-btn"></i>
              </Link>
              <div className="form-title">個人資料</div>
              <Link href="">
                <i className="TCback-btn"></i>
              </Link>
            </div>

            <form
              name="form1"
              style={{
                display: 'none',
              }}
            >
              <input
                type="file"
                name="avatar"
                accept="image/*"
                ref={inputRef}
                onChange={previewFile}
              />
            </form>
            <div className="form-content">
              <div className="d-flex align-items-center ml-1">
                <div className="pic">
                  <img
                    src={`${devUrl}/images/pic/presetAvatar.jpeg`}
                    className="img-fluid"
                    alt=""
                    name="avatar"
                    ref={imgRef}
                  />
                </div>
                <button
                  className="Stbtn btn-border-only"
                  onClick={(e) => {
                    e.preventDefault()
                    inputRef.current.click()
                  }}
                >
                  <span>請選擇圖片</span>
                </button>
              </div>
              <div className="fullname row mb-45">
                <div className="col-6">
                  <input
                    type="text"
                    className="nameInputs col"
                    placeholder="名字"
                    name="firstname"
                    value={fields.firstname}
                    onChange={handleFieldChange}
                    required
                  />
                  {fieldsErrors.firstname && (
                    <small className="notice">
                      {fieldsErrors.firstname}
                    </small>
                  )}
                </div>

                <div className="col-6">
                  <input
                    type="text"
                    className="nameInputs"
                    placeholder="姓氏"
                    name="lastname"
                    value={fields.lastname}
                    onChange={handleFieldChange}
                    required
                  />
                  {fieldsErrors.lastname && (
                    <small className="notice">
                      {fieldsErrors.lastname}
                    </small>
                  )}
                </div>
              </div>
              <div className="mb-50">
                <input
                  type="email"
                  className="col-12 allInputs"
                  placeholder="abc@gmail.com"
                  disabled
                />
              </div>
              <div className="mb-50">
                <input
                  type="date"
                  className="col-12 allInputs px-2"
                  name="birth"
                  value={fields.birthday}
                  onChange={handleFieldChange}
                  required
                  min="1921-01-01"
                  max="2003-01-01"
                />
                {fieldsErrors.birthday && (
                  <small className="notice">
                    {fieldsErrors.birthday}
                  </small>
                )}
              </div>

              <input
                type="text"
                className="col-12 allInputs"
                placeholder="暱稱"
                name="nickname"
                value={fields.nickname}
                onChange={handleFieldChange}
              />
            </div>
            <button className="Stbtn btn-secondary row mx-auto save-btn">
              儲存
            </button>
          </form>
        </div>
      </div>
      <StBgDecorationNormal />
      <Footer />
    </>
  )
})
