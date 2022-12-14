import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./Routes/Profile.js";
import Contact from "./Routes/Profile.js";
import Main from "./Routes/Main.js";
import Test from "./Routes/Test.js";
import Upload from "./Routes/Upload.js";
import FirstLogin from "./Routes/FirstLogin.js";
import Feedback from "./Routes/Feedback.js";
import Overview from "./Routes/Overview.js";
import NotFound from "./Routes/NotFound.js";
import EmailVerification from "./Routes/EmailVerification.js";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/Responses-Chat" element={<Main />} />
          <Route path="/Responses-Chat/firstlogin" element={<FirstLogin />} />
          <Route path="/Responses-Chat/upload" element={<Upload />} />
          <Route path="/Responses-Chat/profile" element={<Profile />} />
          <Route path="/Responses-Chat/feedback" element={<Feedback />} />
          <Route path="/Responses-Chat/contact" element={<Contact />} />
          <Route path="/Responses-Chat/emailverification" element={<EmailVerification />} />
          <Route path="/Responses-Chat/test" element={<EmailVerification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
