import { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import Loading from "./Loading";
import Swal from "sweetalert2";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";

const Form = styled.form`
  display: flex;
  justify-content: center;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const Title = styled.div`
  width: 100px;
  border-radius: 25px;
  background-color: #43a047;
  color: white;
  text-align: center;
  padding: 5px;
`;

const NameModify = styled.div`
  border: 1px solid green;
  padding: 10px;
`;

const NameInput = styled.input`
  width: 100%;
  border: none;
  height: 25px;
  background-color: #c8e6c9;
`;

const Distribute = styled.div`
  display: flex;
  justify-content: center;
`;
const DistributeBar = styled.div`
  width: 100%;
  height: 1px;
  background-color: gray;
  margin: 20px 0px;
`;

const ResponseModify = styled.div``;

const BtnBundle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Btn = styled.button`
  cursor: pointer;
  width: 50vw;
  height: 30px;
  border: 0;
  border-radius: 0.25em;
  color: white;
  font-weight: bolder;
`;

const TextArea = styled.textarea`
  border: none;
  background-color: beige;
  width: 100%;
  height: 200px;
  resize: none;
  padding: 10px;
  background-color: #c8e6c9;
`;

const SubmitInput = styled.input`
  border: none;
  background-color: #66bb6a;
  color: white;
`;

export default function ReName() {
  const [newDisplayName, setNewDisplayName] = useState("");
  const [init, setInit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [docExist, setDocExist] = useState(false);
  const [modify, setModify] = useState("");

  const navigate = useNavigate();

  const user = authService.currentUser;

  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      setInit(true);
      dbService
        .collection("ReArchive")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setDocExist(true);
          } else {
            setDocExist(false);
          }
        });
    });
  }, []);

  // Name Exchange
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    Swal.fire("?????????????????????!", `????????? ??????: ${newDisplayName}`, "success");
    user.updateProfile({
      displayName: newDisplayName,
    });
    dbService
      .collection("ReArchive")
      .doc(user.uid)
      .update({ userDisplayName: newDisplayName });
  };

  // Response Exchange
  const onReChange = (event) => {
    const {
      target: { value },
    } = event;
    setModify(value);
  };

  const onReSubmit = (event) => {
    event.preventDefault();

    // ?????? & ?????? ?????????
    setTimeout(() => {
      // Doc update https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
      dbService
        .collection("ReArchive")
        .doc(user.uid)
        .update({ response: modify })
        .then()
        .catch((error) => {
          console.log("Doc ???????????? ????????? ????????? ?????? ?????????~!");
        });

      setNewDisplayName("");
    }, 1000);

    // ??????
    let timerInterval;
    Swal.fire({
      title: "???????????? ????????????...",
      icon: "success",
      timer: 1000,
      timerProgressBar: true,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    setModify("");
    setToggle(false);
  };

  const onModifyBtnClick = () => {
    // Modify (Update Doc)
    setToggle((e) => !e);
  };

  const onDeleteBtnClick = () => {
    // Delete
    setToggle(false);
    Swal.fire({
      title: "?????????????????????????",
      text: "?????? ???????????? ??? ????????????!",
      icon: "error",
      showCancelButton: false,
      showDenyButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "??????",
      denyButtonText: "??????",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dbService.doc(`ReArchive/${user.uid}`).delete();
        Swal.fire("?????????????????????!", "", "success");
        setDocExist(false);
      }
    });
  };

  const onCancleClick = () => {
    setToggle(false);
  };

  return (
    <>
      {init ? (
        <>
          <NameModify>
            <TitleBox>
              <Title>?????? ??????</Title>
            </TitleBox>
            <Form onSubmit={onSubmit}>
              <NameInput
                type="text"
                placeholder={user.displayName}
                value={newDisplayName}
                onChange={onChange}
                required
              />
              <SubmitInput type="submit" value="??????" />
            </Form>
          </NameModify>

          {docExist ? (
            <>
              <Distribute>
                <DistributeBar></DistributeBar>
              </Distribute>
              <BtnBundle>
                <Btn
                  onClick={onModifyBtnClick}
                  style={{ backgroundColor: "#3085D6" }}
                >
                  ??????
                </Btn>
                <Btn
                  onClick={onDeleteBtnClick}
                  style={{ backgroundColor: "#DC3741" }}
                >
                  ??????
                </Btn>
              </BtnBundle>
            </>
          ) : (
            <></>
          )}
          <ResponseModify>
            {toggle ? (
              <>
                <Form onSubmit={onReSubmit}>
                  <TextArea
                    type="text"
                    placeholder=""
                    value={modify}
                    onChange={onReChange}
                    required
                  />
                  <SubmitInput type="submit" value="??????" />
                </Form>
                <Btn
                  style={{ backgroundColor: "gray", width: "100%" }}
                  onClick={onCancleClick}
                >
                  ??????
                </Btn>
              </>
            ) : (
              <></>
            )}
          </ResponseModify>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
